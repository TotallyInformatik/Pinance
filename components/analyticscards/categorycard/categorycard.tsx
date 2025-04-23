"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { getTransactionsByAccountWithinMonthGroupedByType, getTransactionTypes } from "@/lib/db/sqlite"

export function CategoryCard(
  {
    className,
    title,
    type
  }: {
    className: string,
    title: string,
    type: "earnings" | "expenses"
  }) {

    
  const context = useContext(PageContext);
  const [total, setTotal] = useState(0);
  const [chartConfig, setChartConfig] = useState({
    amount: {
      label: "amount",
    },
    wants: {
      label: "wants",
      color: "hsl(var(--chart-1))"
    },
    needs: {
      label: "needs",
      color: "hsl(var(--chart-2))"
    },
    other: {
      label: "other",
      color: "hsl(var(--chart-3))"
    }
  } satisfies ChartConfig)
  const [chartData, setChartData] = useState<{
    category: string,
    amount: number,
    fill: string
  }[]>([])

  useEffect(() => {

    (async () => {
      const types = await getTransactionTypes();
      const newChartConfig = Object();
      newChartConfig["amount"] = {
        label: "Amount"
      }
      types.forEach((t, idx) => {
        newChartConfig[t.type] = {
          label: t.type,
          color: `hsl(var(--chart-${idx+1}))`
        }
      })
      setChartConfig(newChartConfig satisfies ChartConfig)

      const data = await getTransactionsByAccountWithinMonthGroupedByType(context.year, context.month+1, context.accountData.id, type)
      // console.log(data)
      let newTotal = 0;
      const newChartData = data.map(d => {
        newTotal += Math.abs(d.sum)
        return {
          category: d.type,
          amount: Math.abs(d.sum),
          fill: `var(--color-${d.type})`
        }
      });
      setTotal(newTotal)
      setChartData(newChartData)
      
      // console.log(newChartData)

    })()

  }, [context.reload, context.month, context.year])


  return (
    <Card className={cn(className, "p-8")}>
      <div>
        <p className="mb-1 text-muted-foreground">{title}</p>
        <h2 className='mt-0 text-3xl font-bold justify-self-start'>{total.toFixed(2) + context.accountData.currency}</h2>
      </div>
      <CardContent>
      <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              strokeWidth={5}
            >
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
