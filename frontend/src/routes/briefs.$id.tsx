import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Download, Share2, FileText, ArrowLeft, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AppShell } from "@/components/layout/AppShell";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { getBrief, generateBriefAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/briefs/$id")({
  loader: async ({ params }) => {
    try {
      const trend = await getBrief(params.id);
      return { trend };
    } catch (err) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Brief · ${loaderData?.trend.title}` },
      { name: "description", content: loaderData?.trend.hook },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <p className="py-20 text-center text-sm text-muted-foreground">Brief not found.</p>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="py-20 text-center text-sm text-destructive">{error.message}</p>
    </AppShell>
  ),
  component: BriefPage,
});

function BriefPage() {
  const { trend } = Route.useLoaderData();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: () => generateBriefAPI(trend.id),
    onSuccess: (newTrend) => {
      queryClient.setQueryData(["trends"], (old: any) => {
        if (!old) return old;
        return old.map((t: any) => t.id === newTrend.id ? newTrend : t);
      });
      // Force reload or invalidate to update loader data?
      // Since it's a router loader, we can just let React update or do window.location.reload()
      // But a better way in Tanstack Router is router.invalidate()
      window.location.reload(); 
    },
    onError: (err) => {
      toast.error("Failed to generate brief: " + err.message);
    }
  });

  const sections = trend.is_generated && trend.generated_brief ? [
    { key: "hook", label: "Hook", body: trend.generated_brief.hook, tone: "Open" },
    { key: "angle", label: "Entrepreneurship angle", body: trend.generated_brief.angle, tone: "Strategy" },
    { key: "script", label: "45-second script", body: trend.generated_brief.script, tone: "Body" },
    { key: "remix", label: "Remix template", body: trend.generated_brief.remix_template, tone: "Action" },
  ] : [];

  return (
    <AppShell>
      <Toaster
        toastOptions={{
          style: {
            background: "oklch(0.20 0.028 260)",
            color: "oklch(0.97 0.01 250)",
            border: "1px solid oklch(0.30 0.025 260)",
            fontSize: 13,
          },
        }}
      />
      <Link
        to="/briefs"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All briefs
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3 w-3" /> Brief · {trend.source}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {trend.trend_name}
          </h1>

          <div className="mt-6 space-y-3">
            {trend.is_generated ? sections.map((s, i) => (
              <Collapsible
                key={s.key}
                title={s.label}
                tone={s.tone}
                body={s.body}
                defaultOpen={i < 2}
              />
            )) : (
              <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-card/50">
                <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary opacity-50" />
                <h3 className="font-display text-lg font-semibold mb-2">No brief generated yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Use the Kuzana AI engine to analyze this trend and generate a ready-to-shoot business script.
                </p>
                <button 
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> 
                  {generateMutation.isPending ? "Generating..." : "Generate Script Brief"}
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Traffic Velocity
            </div>
            <div className="font-mono text-4xl font-bold">{trend.traffic_velocity}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Urgency: {trend.urgency}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </h3>
            <div className="flex flex-col gap-2">
              <ActionBtn
                icon={<Copy className="h-4 w-4" />}
                label="Copy full brief"
                onClick={() => toast.success("Brief copied to clipboard")}
              />
              <ActionBtn
                icon={<Download className="h-4 w-4" />}
                label="Export PDF"
                onClick={() => toast.success("Exporting PDF…")}
              />
              <ActionBtn
                icon={<Download className="h-4 w-4" />}
                label="Export DOCX"
                onClick={() => toast.success("Exporting DOCX…")}
              />
              <ActionBtn
                icon={<Share2 className="h-4 w-4" />}
                label="Share link"
                onClick={() => toast.success("Share link copied")}
              />
            </div>
          </div>

          <Link
            to="/trends/$id"
            params={{ id: trend.id }}
            className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <h3 className="mb-1 font-display text-sm font-semibold">Trend deep-dive</h3>
            <p className="text-xs text-muted-foreground">
              See the full timeline, sources and related signals.
            </p>
          </Link>
        </aside>
      </div>
    </AppShell>
  );
}

function Collapsible({
  title,
  body,
  tone,
  defaultOpen,
}: {
  title: string;
  body: string;
  tone: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface/40"
      >
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-primary">{tone}</div>
          <div className="font-display text-base font-semibold">{title}</div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {body}
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(body);
                    toast.success("Copied");
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm hover:border-primary/40"
    >
      {icon} {label}
    </button>
  );
}
