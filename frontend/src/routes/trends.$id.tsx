import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, Share2, Bookmark } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { getTrend, getTrends } from "@/lib/api";

export const Route = createFileRoute("/trends/$id")({
  loader: async ({ params }) => {
    try {
      const [trend, allTrends] = await Promise.all([
        getTrend(params.id),
        getTrends()
      ]);
      return { trend, allTrends };
    } catch (err) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.trend.trend_name} · TrendJack Hunter` },
      { name: "description", content: loaderData?.trend.description },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <p className="py-20 text-center text-sm text-muted-foreground">Trend not found.</p>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="py-20 text-center text-sm text-destructive">{error.message}</p>
    </AppShell>
  ),
  component: TrendDetail,
});

function TrendDetail() {
  const { trend, allTrends } = Route.useLoaderData();
  return (
    <AppShell>
      <Link
        to="/trends"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to trends
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="live-pulse-dot" /> {trend.source} · detected {new Date(trend.detectedAt).toLocaleDateString()}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {trend.trend_name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <a href={trend.source_url} target="_blank" className="text-xs text-primary hover:underline">
              View original source
            </a>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {trend.description || "No description provided."}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/briefs/$id"
              params={{ id: trend.id }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" /> Generate brief
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm hover:border-primary/40">
              <Bookmark className="h-4 w-4" /> Save
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm hover:border-primary/40">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-1 font-display text-lg font-semibold">Trend timeline · 14d</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Engagement velocity across platforms, normalized.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend.timeline}>
                  <defs>
                    <linearGradient id="gTL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
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
                    dataKey="v"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    fill="url(#gTL)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {trend.is_generated && trend.generated_brief && (
              <>
                <Panel title="Hook">{trend.generated_brief.hook}</Panel>
                <Panel title="Angle">{trend.generated_brief.angle}</Panel>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Virality
            </h3>
            <ViralityGauge value={trend.virality} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <Mini label="Growth" value={`+${trend.growth}%`} />
              <Mini label="Relevance" value={`${trend.relevance}%`} />
              <Mini label="Life" value={trend.estimated_lifespan || `${trend.lifeDays}d`} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              What is happening
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90">
              {trend.what_is_happening || "No context provided."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Why it's spreading
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90">
              {trend.why_it_is_spreading || "No context provided."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related signals
            </h3>
            <ul className="space-y-2 text-sm">
              {allTrends
                .filter((t: any) => t.id !== trend.id)
                .slice(0, 3)
                .map((t: any) => (
                  <li key={t.id}>
                    <Link
                      to="/trends/$id"
                      params={{ id: t.id }}
                      className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-surface"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate">{t.trend_name}</span>
                      </span>
                      <span className="font-mono text-[10px] text-success">{t.urgency}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

function ViralityGauge({ value }: { value: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="var(--color-border)" strokeWidth="10" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={r}
          stroke="url(#gradGauge)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
        />
        <defs>
          <linearGradient id="gradGauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-mono text-3xl font-bold tabular">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  );
}
