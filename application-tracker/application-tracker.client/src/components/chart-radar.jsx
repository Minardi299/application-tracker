"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A radar chart"



const chartConfig = {
  value: {
    label: "applications",
    color: "var(--chart-1)",
  },
} 

export function ChartRadarDefault({data, endMonth}) {
  console.log("ChartRadarDefault data", data);
  const currentYear = new Date().getFullYear();
  return (
    <Card className="flex flex-col h-full">
      <CardHeader >
        <CardTitle>Last Month</CardTitle>
        <CardDescription>
          
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  min-h-full"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
           {endMonth} {currentYear}
        </div>
      </CardFooter>
    </Card>
  )
}
