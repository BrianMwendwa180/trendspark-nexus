import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import {
  categoryBars,
  growthSeries,
  platformDistribution,
  predictionAccuracy,
} from "@/lib/mock-data";

export const Route = createFileRoute("/analytics/")({
  head: () => ({
    meta: [
      { title: "Analytics · TrendJack Hunter" },
      {
        name: "description",
        content: "Trend growth, platform distribution and prediction accuracy.",
      },
    ],
  }),
  component: Analytics,
});

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4 h-72">{children}</div>
    </div>
  );
}

function Analytics() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence"
        title="Analytics"
        description="Cross-platform trend performance and model accuracy at a glance."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Trend growth" description="Detected trends per hour">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthSeries}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
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
              />
              <Area
                type="monotone"
                dataKey="trends"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#ag1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Platform distribution" description="Share of viral trends per source">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={platformDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                stroke="var(--color-background)"
                strokeWidth={2}
              >
                {platformDistribution.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted-foreground)" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Trend categories" description="Active trends by category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryBars}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-12}
                dy={8}
                height={50}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
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
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {categoryBars.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Prediction accuracy" description="Model vs actual virality, last 12 weeks">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionAccuracy}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[60, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted-foreground)" }} />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AppShell>
  );
}
