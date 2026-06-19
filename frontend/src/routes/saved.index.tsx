import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getTrends } from "@/lib/api";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";

export const Route = createFileRoute("/saved/")({
  head: () => ({
    meta: [
      { title: "Saved trends · TrendJack Hunter" },
      { name: "description", content: "Your bookmarked trends and briefs." },
    ],
  }),
  component: Saved,
});

const sizes = ["h-44", "h-56", "h-40", "h-60", "h-48", "h-52"];

function Saved() {
  const { data: trends = [], isLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: getTrends,
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Library"
        title="Saved trends"
        description="Everything you've pinned. Drag, share or generate a brief in one click."
      />
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Loading saved trends...
          </div>
        ) : (
          trends.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="mb-4 break-inside-avoid"
          >
            <Link
              to="/trends/$id"
              params={{ id: t.id }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
            >
              <div className={`relative ${sizes[i % sizes.length]} bg-primary/5 p-5`}>
                <div className="relative flex h-full flex-col justify-between">
                  <span className="text-4xl">🎯</span>
                  <div>
                    <div className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] backdrop-blur ${
                      t.urgency === 'High' ? 'bg-destructive/15 text-destructive' : 
                      t.urgency === 'Medium' ? 'bg-accent/15 text-accent' : 
                      'bg-success/15 text-success'
                    }`}>
                      {t.urgency} Urgency
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-tight drop-shadow">
                      {t.trend_name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border p-3">
                <div className="flex flex-wrap gap-1 font-mono text-[10px] uppercase text-muted-foreground">
                  {t.source}
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Bookmark className="h-3 w-3" /> {new Date(t.detectedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </motion.div>
        )))}
      </div>
    </AppShell>
  );
}
