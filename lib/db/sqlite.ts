import Database from '@tauri-apps/plugin-sql';
import { convertToISO8601, DEFAULT_CURRENCY, pad0 } from '../utils';
// when using `"withGlobalTauri": true`, you may use
// const Database = window.__TAURI__.sql;

const DB_URL = 'sqlite:pinancedatabase.db';
let db: Database;

export async function initDB() {

  db = await Database.load(DB_URL);

  // todo: add balance attribute which the person just has to enter...
  // todo: extract month and year selector out of card

  await db.execute(
    `CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY,
      currency TEXT NOT NULL,
      title TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS transaction_history (
      id INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      value REAL NOT NULL CHECK(value = ROUND(value, 2)),
      description TEXT,
      type TEXT,
      account_id INTEGER,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (type) REFERENCES transaction_type(type) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS total_history (
      total REAL NOT NULL CHECK(total = ROUND(total, 2)),
      month INTEGER NOT NULL CHECK(month <= 12 AND month >= 1),
      year INTEGER NOT NULL,
      account_id INTEGER,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
      PRIMARY KEY (month, year, account_id)
    );
    CREATE TABLE IF NOT EXISTS transaction_type (
        type TEXT PRIMARY KEY
    );
    `
  )

  // todo: migrations or smth. idk

}


export type last_insert_rowid = {
  "last_insert_rowid()": number
}[]


// #region Accounts

export type shortAccount = {
  title: string,
  id: number,
}
export type shortAccountList = shortAccount[];
export async function getAccountList() {
  const result = await db.select("SELECT id, title FROM accounts");
  return result;
}


export type account = {
  id: number,
  currency: string,
  title: string,
}
export type accountList = account[];

export async function getAccount(id: number) {
  const result = await db.select("SELECT id, currency, title, total FROM accounts WHERE id = $1", [id]);
  return (result as accountList)[0];
}

export async function addAccount(title: string, currency: string = DEFAULT_CURRENCY, total: number = 0) {
  await db.execute("INSERT INTO accounts (currency, title, total) VALUES ($1, $2, $3)", [currency, title, total]);
  const result = await db.select("SELECT id, title FROM accounts WHERE title = $1", [title])
  return (result as shortAccountList)[0];
}

export async function removeAccountById(id: number) {
  await db.execute("DELETE FROM accounts WHERE id = $1", [id]);
}

// #endregion


// #region Total History

export type total = {
  id: number,
  total: number,
  month: number,
  year: number,
  account_id: number,
}
export type totalList = total[]

export async function getTotalByAccountAndMonth(month: number, year: number, account_id: number) {
  const result = await db.select("SELECT total, month, year, account_id FROM total_history WHERE (month=$1 AND year=$2 AND account_id=$3)", [month, year, account_id])
  // console.log(result);
  const typedResult = (result as totalList);
  if (typedResult.length > 0) {
    return typedResult[0];
  } else {
    return undefined;
  }

}

export async function getTotalsByYear(year: number) {
  const result = await db.select("SELECT * FROM total_history WHERE year=$1", [year])
  // console.log(result);
  const typedResult = (result as totalList);
  return typedResult;
}


export async function setTotalByAccountAndMonth(month: number, year: number, account_id: number, total: number) {
  await db.execute("INSERT INTO total_history (total, account_id, month, year) VALUES ($1, $2, $3, $4) ON CONFLICT(month, year, account_id) DO UPDATE SET total = excluded.total", [total, account_id, month, year])
}


// #endregion


// #region Transaction History

export type transaction = {
  id: number
  date: string,
  value: number,
  type: string | null,
  description: string,
}
export type transactionList = transaction[]

export async function addTransaction(date: string, value: number, type: string | null, description: string, account_id: number) {
  await db.execute("INSERT INTO transaction_history (date, value, description, type, account_id) VALUES ($1,$2,$3,$4,$5)", [convertToISO8601(date), value, description, type, account_id])
  const idData = await db.select("SELECT last_insert_rowid()") as last_insert_rowid;
  return idData[0]['last_insert_rowid()']
}

export async function getTransactionsByAccountWithinMonth(year: number, month: number, account_id: number) {
  // precondition: month is in normal notation, not index
  const results = await db.select("SELECT id, strftime('%d.%m.%Y', date) as date, value, description, type FROM transaction_history WHERE (account_id=$1 AND strftime('%m', date) == $2 AND strftime('%Y', date) == $3)", [account_id, pad0(month.toString()), year.toString()])
  return results as transactionList;
}

export type transactionsByDay = {
  day: number,
  sum: number,
}
export async function getTransactionsByAccountWithinMonthGroupedByDay(year: number, month: number, account_id: number) {
  const results = await db.select("SELECT strftime('%d', date) as day, sum(value) as sum FROM transaction_history WHERE (account_id=$1 AND strftime('%m', date) == $2 AND strftime('%Y', date) == $3) GROUP BY day", [account_id, pad0(month.toString()), year.toString()]);
  return results as transactionsByDay[];
}

export type transactionsByType = {
  type: string,
  sum: number
}
export async function getTransactionsByAccountWithinMonthGroupedByType(year: number, month: number, account_id: number, context: "earnings" | "expenses") {
  let results;
  if (context == "earnings") {
    results = await db.select("SELECT type, sum(value) as sum FROM transaction_history WHERE (account_id=$1 AND strftime('%m', date) == $2 AND strftime('%Y', date) == $3 AND (value >= 0)) GROUP BY type", [account_id, pad0(month.toString()), year.toString()]);
  } else {
    results = await db.select("SELECT type, sum(value) as sum FROM transaction_history WHERE (account_id=$1 AND strftime('%m', date) == $2 AND strftime('%Y', date) == $3 AND (value <= 0)) GROUP BY type", [account_id, pad0(month.toString()), year.toString()]);
  }
  return results as transactionsByType[];
}

export type transactionSum = {
  sum: number
}
export async function getTransactionsByAccountWithinMonthSummedUp(year: number, month: number, account_id: number) {
  const result = await db.select("SELECT sum(value) as sum FROM transaction_history WHERE (account_id=$1 AND strftime('%m', date) == $2 AND strftime('%Y', date) == $3)", [account_id, pad0(month.toString()), year.toString()]);
  return (result as transactionSum[])[0]
}


export async function getTransactionsWithinMonth(year: number, month: number) {
  // precondition: month is in normal notation, not index
  const results = await db.select("SELECT id, strftime('%d.%m.%Y', date) as date, value, description, type FROM transaction_history WHERE (strftime('%m', date) == $2 AND strftime('%Y', date) == $3)", [pad0(month.toString()), year.toString()])
  return results as transactionList;
}

export async function getAllTransactions() {
  const results = await db.select("SELECT * FROM transaction_history")
  return results
}

export async function removeTransaction(id: number) {
  await db.execute("DELETE FROM transaction_history WHERE id = $1", [id])
}

export async function updateTransaction(id: number, date: string, value: number, type: string | null, description: string) {
  await db.execute("UPDATE transaction_history SET date=$1, value=$2, type=$3, description=$4 WHERE id = $5", [convertToISO8601(date), value, type, description, id])
}


// #endregion


// #region Transaction Types

export async function addTransactionType(t: string) {
  await db.execute("INSERT INTO transaction_type (type) VALUES ($1)", [t])
}

export type transactionType = {
  type: string
}
export type transactionTypeList = transactionType[];
export async function getTransactionTypes() {
  const result = await db.select("SELECT type FROM transaction_type")
  return (result as transactionTypeList);
}

// #endregion

