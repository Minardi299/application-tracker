"use client"

import { Sankey, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const monthData = {
  applied: 10,

  offered: 2,
  accepted: 1,
  rejected: 7,
}
const chartConfig = {
  applied: {
    label: "Applied",
    color: "var(--chart-1)",
  },
  
  offered: {
    label: "Offered",
    color: "var(--chart-3)",
  },
  accepted: {
    label: "Accepted",
    color: "var(--chart-4)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--chart-5)",
  },
};
function buildSankeyData(data) {
  const { applied, offered, accepted } = data;

  // Derived
  const directRejected = applied - offered;
  const offeredRejected = offered - accepted;

  const nodes = [
    { name: "Applied" },   // 0
    { name: "Offered" },   // 1
    { name: "Accepted" },  // 2
    { name: "Rejected" },  // 3
  ];

  const links = [
    {
      source: 0, // Applied
      target: 1, // Offered
      value: offered,
    },
    
    {
      source: 1, // Offered
      target: 2, // Accepted
      value: accepted,
    },
    {
      source: 1, // Offered
      target: 3, // Rejected after offer
      value: offeredRejected > 0 ? offeredRejected : 0,
    },
  ];

  return { nodes, links };
}



export function SankeyChart() {
  const sankeyData = buildSankeyData(monthData);
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Application Flow</CardTitle>
        <CardDescription>Track how applications progress</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <Sankey
          data={sankeyData}
          nodePadding={20}
          nodeWidth={15}
          iterations={32}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          width={600}
          height={400}
          link={{ stroke: "var(--chart-1)" }}
          node={{ fill: "var(--chart-2)" }}
        >
          <Tooltip />
        </Sankey>
      </CardContent>
    </Card>
  )
}
