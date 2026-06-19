import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="live-pulse-dot" /> {eyebrow}
          </div>
        )}
        <h1 className="truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
