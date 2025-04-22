
"use client"

import { Area, AreaChart, Bar, CartesianGrid, Line, LineChart, ReferenceLine, XAxis } from "recharts"

import {
  Card,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useContext, useEffect, useState } from "react"
import { PageContext } from "@/app/accounts/page"
import { getTransactionsByAccountWithinMonth, getTransactionsByAccountWithinMonthGroupedByDay } from "@/lib/db/sqlite"

const chartConfig = {
  sum: {
    label: "Sum",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MonthlyDevelopmentCard(
  {
    className
  }: {
    className: string
  }
) {

  const [chartData, setChartData] = useState([{day: 0, sum: 0}])
  const context = useContext(PageContext);

  useEffect(() => {
    (async() => {
      const transactions = await getTransactionsByAccountWithinMonthGroupedByDay(context.year, context.month+1, context.accountData.id);
      setChartData(transactions)
    })()
  })

  return (
    <Card className={cn(className, "p-8 gap-5 h-fit")}>
      <div>
        <h2 className='text-3xl font-bold justify-self-start mb-1'>Development</h2>
        <p className="text-muted-foreground">See the development of your expenses </p>
      </div>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) => value.slice(0, 3)}
          />
          <ReferenceLine
            y={0}
            stroke="var(--muted-foreground)"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Line
            dataKey="sum"
            type="linear"
            fill="var(--color-sum)"
            stroke="var(--color-sum)"
          />
        </LineChart>
      </ChartContainer>
    </Card>
  )
}
