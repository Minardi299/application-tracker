

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import{ fetchAllApplications} from "@/hooks/use-folder";

export const description = "An interactive area chart"

const x=0;
const chartData = [
  { date: "2024-04-01", applied: 222, rejected: 150 },
  { date: "2024-04-02", applied: 97, rejected: 180 },
  { date: "2024-04-03", applied: 167, rejected: 120 },
  { date: "2024-04-04", applied: 242, rejected: 260 },
  { date: "2024-04-05", applied: 373, rejected: 290 },
  { date: "2024-04-06", applied: 301, rejected: 340 },
  { date: "2024-04-07", applied: 245, rejected: 180 },
  { date: "2024-04-08", applied: 409, rejected: 320 },
  { date: "2024-04-09", applied: 59, rejected: 110 },
  { date: "2024-04-10", applied: 261, rejected: 190 },
  { date: "2024-04-11", applied: 327, rejected: 350 },
  { date: "2024-04-12", applied: 292, rejected: 210 },
  { date: "2024-04-13", applied: 342, rejected: 380 },
  { date: "2024-04-14", applied: 137, rejected: 220 },
  { date: "2024-04-15", applied: 120, rejected: 170 },
  { date: "2024-04-16", applied: 138, rejected: 190 },
  { date: "2024-04-17", applied: 446, rejected: 360 },
  { date: "2024-04-18", applied: 364, rejected: 410 },
  { date: "2024-04-19", applied: 243, rejected: 180 },
  { date: "2024-04-20", applied: 89, rejected: 150 },
  { date: "2024-04-21", applied: 137, rejected: 200 },
  { date: "2024-04-22", applied: 224, rejected: 170 },
  { date: "2024-04-23", applied: 138, rejected: 230 },
  { date: "2024-04-24", applied: 387, rejected: 290 },
  { date: "2024-04-25", applied: 215, rejected: 250 },
  { date: "2024-04-26", applied: 75, rejected: 130 },
  { date: "2024-04-27", applied: 383, rejected: 420 },
  { date: "2024-04-28", applied: 122, rejected: 180 },
  { date: "2024-04-29", applied: 315, rejected: 240 },
  { date: "2024-04-30", applied: 454, rejected: 380 },
  { date: "2024-05-01", applied: 165, rejected: 220 },
  { date: "2024-05-02", applied: 293, rejected: 310 },
  { date: "2024-05-03", applied: 247, rejected: 190 },
  { date: "2024-05-04", applied: 385, rejected: 420 },
  { date: "2024-05-05", applied: 481, rejected: 390 },
  { date: "2024-05-06", applied: 498, rejected: 520 },
  { date: "2024-05-07", applied: 388, rejected: 300 },
  { date: "2024-05-08", applied: 149, rejected: 210 },
  { date: "2024-05-09", applied: 227, rejected: 180 },
  { date: "2024-05-10", applied: 293, rejected: 330 },
  { date: "2024-05-11", applied: 335, rejected: 270 },
  { date: "2024-05-12", applied: 197, rejected: 240 },
  { date: "2024-05-13", applied: 197, rejected: 160 },
  { date: "2024-05-14", applied: 448, rejected: 490 },
  { date: "2024-05-15", applied: 473, rejected: 380 },
  { date: "2024-05-16", applied: 338, rejected: 400 },
  { date: "2024-05-17", applied: 499, rejected: 420 },
  { date: "2024-05-18", applied: 315, rejected: 350 },
  { date: "2024-05-19", applied: 235, rejected: 180 },
  { date: "2024-05-20", applied: 177, rejected: 230 },
  { date: "2024-05-21", applied: 82, rejected: 140 },
  { date: "2024-05-22", applied: 81, rejected: 120 },
  { date: "2024-05-23", applied: 252, rejected: 290 },
  { date: "2024-05-24", applied: 294, rejected: 220 },
  { date: "2024-05-25", applied: 201, rejected: 250 },
  { date: "2024-05-26", applied: 213, rejected: 170 },
  { date: "2024-05-27", applied: 420, rejected: 460 },
  { date: "2024-05-28", applied: 233, rejected: 190 },
  { date: "2024-05-29", applied: 78, rejected: 130 },
  { date: "2024-05-30", applied: 340, rejected: 280 },
  { date: "2024-05-31", applied: 178, rejected: 230 },
  { date: "2024-06-01", applied: 178, rejected: 200 },
  { date: "2024-06-02", applied: 470, rejected: 410 },
  { date: "2024-06-03", applied: 103, rejected: 160 },
  { date: "2024-06-04", applied: 439, rejected: 380 },
  { date: "2024-06-05", applied: 88, rejected: 140 },
  { date: "2024-06-06", applied: 294, rejected: 250 },
  { date: "2024-06-07", applied: 323, rejected: 370 },
  { date: "2024-06-08", applied: 385, rejected: 320 },
  { date: "2024-06-09", applied: 438, rejected: 480 },
  { date: "2024-06-10", applied: 155, rejected: 200 },
  { date: "2024-06-11", applied: 92, rejected: 150 },
  { date: "2024-06-12", applied: 492, rejected: 420 },
  { date: "2024-06-13", applied: 81, rejected: 130 },
  { date: "2024-06-14", applied: 426, rejected: 380 },
  { date: "2024-06-15", applied: 307, rejected: 350 },
  { date: "2024-06-16", applied: 371, rejected: 310 },
  { date: "2024-06-17", applied: 475, rejected: 520 },
  { date: "2024-06-18", applied: 107, rejected: 170 },
  { date: "2024-06-19", applied: 341, rejected: 290 },
  { date: "2024-06-20", applied: 408, rejected: 450 },
  { date: "2024-06-21", applied: 169, rejected: 210 },
  { date: "2024-06-22", applied: 317, rejected: 270 },
  { date: "2024-06-23", applied: 480, rejected: 530 },
  { date: "2024-06-24", applied: 132, rejected: 180 },
  { date: "2024-06-25", applied: 141, rejected: 190 },
  { date: "2024-06-26", applied: 434, rejected: 380 },
  { date: "2024-06-27", applied: 448, rejected: 490 },
  { date: "2024-06-28", applied: 149, rejected: 200 },
  { date: "2024-06-29", applied: 103, rejected: 160 },
  { date: "2024-06-30", applied: 446, rejected: 400 },
]



const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  applied: {
    label: "applied",
    color: "var(--chart-1)",
  },
  rejected: {
    label: "rejected",
    color: "var(--chart-2)",
  },
} 

export function ChartAreaInteractive() {
  // const {
  //       data: data,
  //   } = useQuery({
  //       queryKey: ["applications", "all"],
  //       queryFn: () => fetchAllApplications(),
  //   });

  // const dates = data?.reduce((acc, item) => {
  //   const date = new Date(item.createdAt).toISOString().split("T")[0]; 
  //   if (!acc[date]) {
  //     acc[date] = [];
  //   }
  //   acc[date].push(item);
  //   return acc;
  // }, {});
  // const result = Object?.entries(dates).map(([date, items]) => {
  // const counts = items.reduce(
  //   (acc, item) => {
  //     if (item.status === 'Applied' || item.status === 'Offered' || item.status === 'Interviewing') acc.applied++;
  //     else if (item.status === 'Rejected') acc.rejected++;
  //     return acc;
  //   },
  //   { applied: 0, rejected: 0 }
  // );

  // return { date, ...counts };
//});

  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillapplied" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-applied)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-applied)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillrejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillrejected)"
              stroke="var(--color-rejected)"
              stackId="a"
            />
            <Area
              dataKey="applied"
              type="natural"
              fill="url(#fillapplied)"
              stroke="var(--color-applied)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
