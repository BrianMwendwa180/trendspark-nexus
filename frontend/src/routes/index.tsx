import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Plus, Filter } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendCard } from "@/components/dashboard/TrendCard";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getTrends } from "@/lib/api";
import { metrics, activity } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · TrendJack Hunter" },
      {
        name: "description",
        content: "Real-time trend intelligence and AI content briefs for entrepreneurs.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: trends = [], isLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: getTrends,
  });

  if (isLoading || trends.length === 0) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Hero banner */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6 overflow-hidden rounded-2xl border border-border hero-glow"
      >
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              <span className="live-pulse-dot" /> Live · {trends[0].detectedAt}
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              <span className="text-primary">{trends[0].title}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              {trends[0].summary}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                to="/briefs/$id"
                params={{ id: trends[0].id }}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4" /> Generate brief
              </Link>
              <Link
                to="/trends/$id"
                params={{ id: trends[0].id }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-primary/40"
              >
                View trend <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur">
            <Quick label="Virality" value={`${trends[0].virality}`} />
            <Quick label="Growth" value={`+${trends[0].growth}%`} accent />
            <Quick label="Life" value={`${trends[0].lifeDays}d`} />
            <div className="col-span-3 mt-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
              Detected across {trends[0].platforms.length} platforms ·{" "}
              <span className="font-mono">{trends[0].engagement.toLocaleString()}</span> engagements
            </div>
          </div>
        </div>
      </motion.section>

      {/* Metrics */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.key}
            icon={m.icon}
            label={m.label}
            value={m.value}
            delta={m.delta}
            suffix={"suffix" in m ? m.suffix : undefined}
            index={i}
          />
        ))}
      </section>

      {/* Chart + Activity */}
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Trend growth · 24h</h2>
              <p className="text-xs text-muted-foreground">Detected trends and AI briefs by hour</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--color-chart-1)]" /> Trends
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--color-chart-2)]" /> Briefs
              </span>
            </div>
          </div>
          <GrowthChart />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 font-display text-lg font-semibold">Activity</h2>
          <ul className="space-y-3">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="leading-snug">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest trends */}
      <section>
        <PageHeader
          title="Latest trends"
          description="Fresh signals from the last few hours, ranked by virality."
          actions={
            <>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs hover:border-primary/40">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-3.5 w-3.5" /> New hunt
              </button>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trends.map((t, i) => (
            <TrendCard key={t.id} trend={t} index={i} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Quick({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-lg font-semibold ${accent ? "text-accent" : ""}`}>
        {value}
      </div>
    </div>
  );
}
