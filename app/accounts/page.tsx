'use client'

import { getColumns } from '@/components/financetablecard/columns';
import { DataTable } from '@/components/financetablecard/data-table';
import { FinanceTableCard } from '@/components/financetablecard/financetablecard';
import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { account, getAccount, transaction } from '@/lib/db/sqlite';
import { getCurrencySymbol, getMonthAbbreviation, getMonthName, mod } from '@/lib/utils';
import assert from 'assert';
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react';

export const ACCOUNT_PARAM = "account"

export type DateContextType = {
  month: number,
  year: number
}

export const DateContext = createContext<DateContextType>({
  month: (new Date()).getMonth(),
  year: (new Date()).getFullYear(),
});


export default function Account() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get(ACCOUNT_PARAM);

  const [accountData, setAccountData] = useState<account>(null!);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentMonth, setCurrentMonth] = useState<number>((new Date()).getMonth());
  const [currentYear, setCurrentYear] = useState<number>((new Date()).getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(`${currentMonth+1}/${currentYear}`);
  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    
    (async () => {
      const loadedAccountData = await getAccount(parseInt(accountId));
      setAccountData(loadedAccountData);
      console.log(loadedAccountData);
      setLoading(false);
    })();

  }, [accountId])

  if (loading) {
    return <Loading />
  } else {
    return <>
    <div className='flex flex-col gap-5'>
      <section className='flex items-start justify-between'>
        <h1 className='text-2xl'>Account {">"} {accountData.title}</h1>
          <div className='w-fit flex flex-col items-end'>
            <Pagination className='justify-end'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => {
                    let newYear = currentYear;
                    const newMonth = mod(currentMonth-1, 12);
                    if (currentMonth == 0) {
                      newYear = currentYear-1;
                    }
                    setCurrentYear(newYear);
                    setCurrentMonth(newMonth);
                    setSelectedDate(`${newMonth+1}/${newYear}`);
                  }}/>
                </PaginationItem>
                <PaginationItem>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    
                    try {

                      const parts = selectedDate.split("/")
                      assert(parts.length == 2)

                      const year = parseInt(parts[1]);
                      const month = parseInt(parts[0]);

                      assert(1 <= month && month <=12)

                      setCurrentYear(year)
                      setCurrentMonth(month-1)

                    } catch {

                      setSelectedDate(`${currentMonth+1}/${currentYear}`)

                    }

                  }}>
                    <Input className="w-[85px]" placeholder='mm/yyyy' value={selectedDate} onChange={(e) => {
                      setSelectedDate(e.target.value)
                    }} />
                  </form>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => {

                    let newYear = currentYear;
                    const newMonth = mod(currentMonth+1, 12);
                    if (currentMonth == 11) {
                      newYear = currentYear+1;
                    }
                    setCurrentYear(newYear);
                    setCurrentMonth(newMonth);
                    setSelectedDate(`${newMonth+1}/${newYear}`);

                  }}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
      </section>
      <section>
        <DateContext.Provider value={{
          month: currentMonth,
          year: currentYear
        }}>
          <FinanceTableCard accountData={accountData} />
        </DateContext.Provider>
      </section>

    </div>
    </>
  }
}
