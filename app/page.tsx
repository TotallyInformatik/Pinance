'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { addType, createTables, getTypes } from "@/lib/db/sqlite";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";


interface Account {
  id: number,
  title: string,
}

export default function Home() {

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [accounts, setAccounts] = useState<Account[]>([{id: 1, title: "test1"}, {id: 2, title: "test2"}]);

  useEffect(() => {
    createTables();
  }, [])


  return <>
  hello
      {/* <Separator className="my-4 h-2" /> */}
        {/* <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            {
              accounts.map((account: Account) => {
                return <TabsTrigger key={account.id} value={account.title}>{account.title}</TabsTrigger>
              })
            }
          </TabsList>
          {
            accounts.map((account: Account) => {
              return <TabsContent key={account.id} value={account.title}>{account.title}</TabsContent>
            })
          }
        </Tabs> */}
  </>;
}
