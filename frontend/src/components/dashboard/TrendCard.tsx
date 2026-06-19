import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Clock, TrendingUp, Target } from "lucide-react";
import { PlatformBadge } from "./PlatformBadge";
import type { Trend } from "@/lib/mock-data";

export function TrendCard({ trend, index = 0 }: { trend: Trend; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl">{trend.emoji}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {trend.category}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
            {trend.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {trend.platforms.map((p) => (
              <PlatformBadge key={p} p={p} />
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 font-mono text-xs text-success">
            <TrendingUp className="h-3 w-3" />+{trend.growth}%
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">{trend.detectedAt}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Stat
          icon={<Sparkles className="h-3 w-3" />}
          label="Virality"
          value={`${trend.virality}`}
        />
        <Stat
          icon={<Target className="h-3 w-3" />}
          label="Relevance"
          value={`${trend.relevance}%`}
        />
        <Stat icon={<Clock className="h-3 w-3" />} label="Life" value={`${trend.lifeDays}d`} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          to="/briefs/$id"
          params={{ id: trend.id }}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Sparkles className="h-3.5 w-3.5" /> Generate Brief
        </Link>
        <Link
          to="/trends/$id"
          params={{ id: trend.id }}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-primary/40"
        >
          View <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular">{value}</span>
    </div>
  );
}
