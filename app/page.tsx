'use client'

import { WealthDevelopmentCard } from "@/components/analyticscards/developmentcard/wealthdevelopmentcard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAccountList, getTotalByAccountAndMonth, shortAccount } from "@/lib/db/sqlite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ACCOUNT_PARAM } from "./accounts/page";



export default function Home() {

  const router = useRouter();
  const [accounts, setAccounts] = useState<shortAccount[]>([]);
  useEffect(() => {
    (async () => {
      const newAccounts = (await getAccountList()) as shortAccount[];
      setAccounts(newAccounts);
    })()
  }, [])

  return <>
  <div className='flex flex-col justify-between items-start mb-10'>
    <h1 className='text-4xl font-bold'>Greetings, Rui</h1>
  </div>
  <div className="grid grid-cols-3 grid-rows-2 gap-5">
    <WealthDevelopmentCard className="col-span-2 row-span-2"/>
    <Card className="p-8 h-fit">
      <h2 className="text-3xl font-bold">Quick Access</h2>
      <div className="flex gap-2 flex-wrap">
        {
          accounts.map((account) => {
            return <Button key={account.id} className="flex w-fit" onClick={() => {
              router.push(`/accounts?${ACCOUNT_PARAM}=${account.id}`);
            }}>
              {account.title}
            </Button>
          })
        }
      </div>
    </Card>
  </div>
  </>;
}
