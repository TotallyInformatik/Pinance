import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { account, getAccount, getTransactionsByAccountWithinMonth, transaction } from '@/lib/db/sqlite';
import { cn, getCurrencySymbol, getMonthAbbreviation, getMonthName, mod } from '@/lib/utils';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import assert from 'assert';
import { useContext, useEffect, useState } from 'react';
import { getColumns } from './columns';
import { DataTable } from './data-table';
import { Separator } from '../../ui/separator';
import { PageContext } from '@/app/accounts/page';


export const FinanceTableCard = ({
  className
}: {
  className?: string
}) => {

  const [transactions, setTransactions] = useState<transaction[]>([]);

  const context = useContext(PageContext);

  useEffect(() => {
    (async () => {
      const newTransactions = await getTransactionsByAccountWithinMonth(context.year, context.month+1, context.accountData.id)

      setTransactions(newTransactions);
    })()
  }, [context.month, context.year, context.reload])

  return <Card className={cn('p-8 gap-5', className)}>
    <h2 className='text-3xl font-bold'>Transactions</h2>
    <DataTable 
      columns={getColumns(context.accountData.currency, transactions, (d) => {
        context.toggleReload();
        setTransactions(d)
      })} 
      data={transactions} 
      setData={(d) => {
        context.toggleReload();
        setTransactions(d)
      }} 
      account={context.accountData}
      currentMonth={context.month+1}
      currentYear={context.year}
    />
  </Card>

}