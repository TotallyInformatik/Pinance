'use client'

import { WealthDevelopmentCard } from "@/components/analyticscards/developmentcard/wealthdevelopmentcard";
import { Card } from "@/components/ui/card";


export default function Home() {

  return <>
  <div className='flex flex-col justify-between items-start mb-10'>
    <h1 className='text-4xl font-bold'>Greetings, Rui</h1>
  </div>
  <div className="grid grid-cols-3 gap-5">
    <WealthDevelopmentCard className="col-span-2"/>
    <Card className="p-8">
      <h2 className="text-3xl font-bold">Quick Access:</h2>
      {

      }
    </Card>
  </div>
  </>;
}
