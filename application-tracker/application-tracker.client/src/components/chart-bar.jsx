import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"




const chartConfig = {
  wishlist: { label: "Wishlist", color: "var(--chart-1)" },
  applied: { label: "Applied", color: "var(--chart-2)" },
  interviewing: { label: "Interviewing", color: "var(--chart-3)" },
  accepted: { label: "Accepted", color: "var(--chart-4)" },
  rejected: { label: "Rejected", color: "var(--chart-5)" },
  offered: { label: "Offered", color: "var(--ring)" },
  withdrawn: { label: "Withdrawn", color: "var(--popover-foreground)" },
}
export function ApplicationsStackedChart({data, startMonth, endMonth}) {
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle>The last 12 months</CardTitle>
        <CardDescription>{startMonth} - {endMonth} {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <YAxis />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="wishlist" stackId="a" fill="var(--color-wishlist)" />
            <Bar dataKey="applied" stackId="a" fill="var(--color-applied)" />
            <Bar dataKey="interviewing" stackId="a" fill="var(--color-interviewing)" />
            <Bar dataKey="accepted" stackId="a" fill="var(--color-accepted)" />
            <Bar dataKey="rejected" stackId="a" fill="var(--color-rejected)" />
            <Bar dataKey="offered" stackId="a" fill="var(--color-offered)" />
            <Bar dataKey="withdrawn" stackId="a" fill="var(--color-withdrawn)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        {/* <div className="text-muted-foreground leading-none">
          Showing total applications for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
