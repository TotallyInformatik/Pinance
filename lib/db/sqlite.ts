import Database from '@tauri-apps/plugin-sql';
// when using `"withGlobalTauri": true`, you may use
// const Database = window.__TAURI__.sql;


export async function createTables() {
  const db = await Database.load('sqlite:database.db');
  await db.execute(
    `CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY,
        currency TEXT NOT NULL,
        title TEXT NOT NULL,
        total REAL NOT NULL CHECK(total = ROUND(total, 2))
    );
    CREATE TABLE IF NOT EXISTS transaction_history (
        id INTEGER PRIMARY KEY,
        account_id INTEGER,
        date TEXT,
        value REAL NOT NULL CHECK(value = ROUND(value, 2)),
        description TEXT,
        type TEXT,
        FOREIGN KEY (account_id) REFERENCES accounts(id),
        FOREIGN KEY (type) REFERENCES transaction_type(type)
    );
    CREATE TABLE IF NOT EXISTS transaction_type (
        type TEXT PRIMARY KEY
    );`
  )
}

export async function addType(t: string) {

  const db = await Database.load('sqlite:database.db');
  await db.execute("INSERT INTO transaction_type (type) VALUES ($1)", [t])
}

export async function getTypes() {

  const db = await Database.load('sqlite:database.db');
  const result = await db.select("SELECT type FROM transaction_type")
  return result;
}


// use rusqlite::{params, Connection, Result};
// use std::fs;


// pub fn create_db() -> Result<Connection> {

//     // Get the user-specific data directory
//     let user_data_dir = data_dir().ok_or("Unable to get user data directory")?;

//     // Create a path for your database under the user-specific data directory
//     let db_path = user_data_dir.join("pinance").join("database.db");

//     // Make sure the directory exists
//     if !db_path.parent().unwrap().exists() {
//         fs::create_dir_all(db_path.parent().unwrap());
//     }

//     let conn = Connection::open(&db_path)?;

//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS accounts (
//             id INTEGER PRIMARY KEY,
//             currency TEXT NOT NULL,
//             title TEXT NOT NULL,
//             total REAL NOT NULL CHECK(total = ROUND(total, 2))
//         )",
//         params![],
//     )?;
//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS transaction_history (
//             id INTEGER PRIMARY KEY,
//             account_id INTEGER,
//             date TEXT,
//             value REAL NOT NULL CHECK(value = ROUND(value, 2)),
//             description TEXT,
//             type TEXT,
//             FOREIGN KEY (account_id) REFERENCES accounts(id),
//             FOREIGN KEY (type) REFERENCES transaction_type(type)
//         )",
//         params![],
//     )?;
//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS transaction_type (
//             type TEXT PRIMARY KEY
//         )",
//         params![],
//     )?;

//     return Ok(conn);
// }

// pub fn insert_type(conn: &Connection, t: String) -> Result<usize> {

//     return conn.execute(
//         "INSERT INTO transaction_type (type) VALUES (?1)", params![t]
//     );

// }

// pub fn fetch_types(conn: &Connection) -> Result<Vec<String>> {

//     let mut stmt = conn.prepare("SELECT type FROM transaction_type")?;
//     let type_iter = stmt.query_map(params![], |row| row.get(0))?;

//     let mut types = Vec::new();
//     for t in type_iter {
//         types.push(t?);
//     }
//     return Ok(types)

// }