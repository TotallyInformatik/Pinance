'use client'

import { AICard } from '@/components/aicard/aicard';
import { getColumns } from '@/components/financetablecard/columns';
import { DataTable } from '@/components/financetablecard/data-table';
import { FinanceTableCard } from '@/components/financetablecard/financetablecard';
import { Loading } from '@/components/loading';
import { TotalCard } from '@/components/totalcard/totalcard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { account, getAccount, transaction } from '@/lib/db/sqlite';
import { getCurrencySymbol, getMonthAbbreviation, getMonthName, mod } from '@/lib/utils';
import assert from 'assert';
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react';

export const ACCOUNT_PARAM = "account"

export type PageContextType = {
  month: number,
  year: number,
  toggleReload: () => void
  reload: boolean, // this flag is literally just here for components to flip in order to reload certain things.
  accountData: account
}

export const PageContext = createContext<PageContextType>({
  month: (new Date()).getMonth(),
  year: (new Date()).getFullYear(),
  toggleReload: () => {},
  reload: false,
  accountData: {
    id: -1,
    currency: "TBD",
    title: "loading",
  },
});


export default function Account() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get(ACCOUNT_PARAM);

  const [accountData, setAccountData] = useState<account>(null!);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);

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
    <div className='flex flex-col gap-7'>
      <Tabs defaultValue='monthly'>
        <div className='flex justify-between items-end mb-10'>
          <h1 className='text-4xl font-bold'>{accountData.title}</h1>
          <TabsList>
            <TabsTrigger value='monthly'>Monthly</TabsTrigger>
            <TabsTrigger value='total'>Total</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='monthly' className='flex flex-col gap-5'>
        <section className='flex justify-start items-center gap-2'>
          <p className='text-muted-foreground'>Currently Viewing:</p>
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
                    }}
                    />
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
        <PageContext.Provider value={{
              month: currentMonth,
              year: currentYear,
              reload: reload,
              accountData: accountData,
              toggleReload: () => setReload(!reload)
            }}>
          <section>
            <h2 className='text-2xl font-medium mb-3'>Data</h2>
            <div className='h-min grid grid-cols-4 grid-rows-3 grid-flow-dense gap-5'>
                <FinanceTableCard className='col-span-3 row-span-3' />
                <TotalCard className='row-span-1' />
                <AICard className='row-span-1' />
            </div>
          </section>
          <section>
            <h2 className='text-2xl font-medium mb-3'>Analytics</h2>
          </section>
        </PageContext.Provider>
        </TabsContent>
        <TabsContent value='total'>

        </TabsContent>
      </Tabs>
    </div>
    </>
  }
}
