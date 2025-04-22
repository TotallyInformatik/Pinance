"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LineChart, XAxis } from "recharts"

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
import { getTotalsByAccountAndYear } from "@/lib/db/sqlite"

const chartConfig = {
  wealth: {
    label: "wealth",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function WealthDevelopmentCard(
  {
    className
  }: {
    className?: string
  }) {

  const context = useContext(PageContext);
  const [chartData, setChartData] = useState<{
    wealth: number,
    date: string
  }[]>([]);

  useEffect(() => {

    (async () => {
      const totals = await getTotalsByAccountAndYear(new Date().getFullYear(), context.accountData.id);
      
      const newChartData = totals.map((t) => {
        return {
          wealth: t.total,
          date: `${t.month}-${t.year}`
        }
      })

      setChartData(newChartData)
      
    })()


  }, [context.month, context.year, context.reload])

  return (
    <Card className={cn(className, "p-8")}>
      <div>
        <h2 className='text-3xl font-bold justify-self-start mb-1'>Wealth</h2>
        <p className="text-muted-foreground">See the development of your wealth</p>
      </div>
      <ChartContainer config={chartConfig}>
      <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="wealth"
              type="natural"
              fill="var(--color-wealth)"
              fillOpacity={0.4}
              stroke="var(--color-wealth)"
              stackId="a"
            />
          </AreaChart>
      </ChartContainer>
    </Card>
  )
}
