import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function MetricCard({
  icon,
  label,
  value,
  delta,
  suffix,
  index = 0,
}: {
  icon: string;
  label: string;
  value: number;
  delta: number;
  suffix?: string;
  index?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.1, ease: "easeOut", delay: index * 0.08 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, index, mv, rounded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-80" />
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="inline-flex items-center gap-0.5 rounded-md bg-success/15 px-1.5 py-0.5 font-mono text-[11px] text-success">
          <ArrowUpRight className="h-3 w-3" />
          {delta}%
        </span>
      </div>
      <div className="mt-5 font-mono text-3xl font-semibold tracking-tight tabular">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </motion.div>
  );
}
