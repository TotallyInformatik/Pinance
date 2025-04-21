import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { account, getAccount, getTransactionsByAccountWithinMonth, transaction } from '@/lib/db/sqlite';
import { getCurrencySymbol, getMonthAbbreviation, getMonthName, mod } from '@/lib/utils';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import assert from 'assert';
import { useContext, useEffect, useState } from 'react';
import { getColumns } from './columns';
import { DataTable } from './data-table';
import { Separator } from '../ui/separator';
import { DateContext } from '@/app/accounts/page';


export const FinanceTableCard = ({
  accountData
}: {
  accountData: account
}) => {

  // const [currentMonth, setCurrentMonth] = useState<number>((new Date()).getMonth());
  // const [currentYear, setCurrentYear] = useState<number>((new Date()).getFullYear());
  // const [selectedDate, setSelectedDate] = useState<string>(`${currentMonth+1}/${currentYear}`);
  const [transactions, setTransactions] = useState<transaction[]>([]);

  const context = useContext(DateContext);

  useEffect(() => {
    (async () => {
      const newTransactions = await getTransactionsByAccountWithinMonth(context.year, context.month+1, accountData.id)
      console.log(newTransactions)

      setTransactions(newTransactions);
    })()
  }, [context.month, context.year])

  return <Card className='p-5 gap-0'>
    <DataTable 
      columns={getColumns(accountData.currency, transactions, setTransactions)} 
      data={transactions} 
      setData={setTransactions} 
      account={accountData}
      currentMonth={context.month+1}
      currentYear={context.year}
    />
  </Card>

}