import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { growthSeries } from "@/lib/mock-data";

export function GrowthChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={growthSeries} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gBrief" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
          />
          <Area
            type="monotone"
            dataKey="trends"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#gTrend)"
          />
          <Area
            type="monotone"
            dataKey="briefs"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            fill="url(#gBrief)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
