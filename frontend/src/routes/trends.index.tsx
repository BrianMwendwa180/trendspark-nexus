import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Filter } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { TrendCard } from "@/components/dashboard/TrendCard";
import { trends } from "@/lib/mock-data";

export const Route = createFileRoute("/trends/")({
  head: () => ({
    meta: [
      { title: "Live Trends · TrendJack Hunter" },
      { name: "description", content: "Real-time trends across Twitter, TikTok, YouTube and Reddit." },
    ],
  }),
  component: TrendsPage,
});

function TrendsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Live feed"
        title="Live trends"
        description="Every signal we've detected in the last 48 hours, ranked by virality."
        actions={
          <>
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Filter trends…"
                className="h-9 w-64 rounded-md border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs hover:border-primary/40">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          </>
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {["All", "Tech & Work", "Entrepreneurship", "Culture", "Consumer AI", "Business", "Finance"].map(
          (c, i) => (
            <button
              key={c}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                i === 0
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ),
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trends.map((t, i) => (
          <TrendCard key={t.id} trend={t} index={i} />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Want deeper history?{" "}
        <Link to="/analytics" className="text-primary hover:underline">
          Explore analytics →
        </Link>
      </p>
    </AppShell>
  );
}
