import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, FileText } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui-bits/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getTrends } from "@/lib/api";

export const Route = createFileRoute("/briefs/")({
  head: () => ({
    meta: [
      { title: "Content Briefs · TrendJack Hunter" },
      { name: "description", content: "AI-generated content briefs ready to publish." },
    ],
  }),
  component: BriefsIndex,
});

function BriefsIndex() {
  const { data: trends = [], isLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: getTrends,
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI newsroom"
        title="Content briefs"
        description="One-click, publish-ready briefs for every active trend."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Loading briefs...
          </div>
        ) : (
          trends.map((t) => (
          <Link
            key={t.id}
            to="/briefs/$id"
            params={{ id: t.id }}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <FileText className="h-3 w-3" /> Brief · {t.category}
            </div>
            <h3 className="font-display text-lg font-semibold leading-snug">
              {t.emoji} {t.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.hook}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Open brief →
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
