import {
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getTrendBadge(current, previous) {
  const change = previous === 0 ? 100 : ((current - previous) / previous) * 100;
  const isUp = change >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const colorClass = isUp ? " bg-green-400 dark:bg-green-600" : " bg-red-400 dark:bg-red-600";

  return (
    <Badge variant="outline" className={`gap-2 px-3 py-1.5 text-base   ${colorClass}`}>
      <Icon className={`size-4 ${colorClass}`} />
      {isUp ? "+" : ""}
      {change.toFixed(1)}%
    </Badge>
  );
}

function getSubtext(current, previous) {
  const diff = current - previous;
  const absDiff = Math.abs(diff);
  if (diff > 0) return `${absDiff} more`;
  if (diff < 0) return `${absDiff} less`;
  return `Same as last month`;
}

export function SectionCards({
  submittedThisMonth,
  submittedLastMonth,
  interviewingThisMonth,
  interviewingLastMonth,
  rejectedThisMonth,
  rejectedLastMonth,
  acceptedThisMonth,
  acceptedLastMonth,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Applications Submitted</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {submittedThisMonth}
          </CardTitle>
          <CardAction>
            {getTrendBadge(submittedThisMonth, submittedLastMonth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Compared to last month</div>
          <div className="text-muted-foreground">{getSubtext(submittedThisMonth, submittedLastMonth)} applications submitted.</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Interviewing Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {interviewingThisMonth}
            </CardTitle>
          <CardAction>
            {getTrendBadge(interviewingThisMonth, interviewingLastMonth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Interview stage</div>
          <div className="text-muted-foreground">{getSubtext(interviewingThisMonth, interviewingLastMonth)} interviews done.</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rejected</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {rejectedThisMonth}
          </CardTitle>
          <CardAction>
            {getTrendBadge(rejectedThisMonth, rejectedLastMonth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Compared to last month</div>
          <div className="text-muted-foreground">{getSubtext(rejectedThisMonth, rejectedLastMonth)} rejections this month.</div>
        </CardFooter>
      </Card>

      {/* 4. Accepted */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Accepted</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {acceptedThisMonth}
          </CardTitle>
          <CardAction>
            {getTrendBadge(acceptedThisMonth, acceptedLastMonth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Accepted!</div>
          <div className="text-muted-foreground">{getSubtext(acceptedThisMonth, acceptedLastMonth)} than last time.</div>
        </CardFooter>
      </Card>
    </div>
  );
}
