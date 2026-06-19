import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui-bits/PageHeader";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "Settings · TrendJack Hunter" },
      { name: "description", content: "Manage your TrendJack Hunter workspace." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [tab, setTab] = useState<"account" | "sources" | "notifications" | "billing">("account");
  const tabs = [
    { id: "account", label: "Account" },
    { id: "sources", label: "Sources" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
  ] as const;

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Tune your workspace, sources and brief preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                tab === t.id
                  ? "bg-surface text-foreground"
                  : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="space-y-5">
          {tab === "account" && (
            <Panel title="Account">
              <Field label="Name" value="Kuzana" />
              <Field label="Email" value="hello@kuzana.io" />
              <Field label="Brand voice" value="Direct, contrarian, founder-led" textarea />
              <SaveButton />
            </Panel>
          )}
          {tab === "sources" && (
            <Panel title="Connected sources">
              {["Twitter / X", "TikTok", "YouTube", "Reddit", "Instagram", "LinkedIn"].map(
                (s, i) => (
                  <Toggle key={s} label={s} defaultOn={i < 4} />
                ),
              )}
            </Panel>
          )}
          {tab === "notifications" && (
            <Panel title="Notifications">
              <Toggle label="Push: new viral trend (>90 virality)" defaultOn />
              <Toggle label="Email: daily digest" defaultOn />
              <Toggle label="Email: weekly performance report" />
              <Toggle label="Slack: brief generated" />
            </Panel>
          )}
          {tab === "billing" && (
            <Panel title="Billing">
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
                  Current plan
                </div>
                <div className="mt-1 font-display text-xl font-bold">Pro · $49/mo</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Unlimited briefs, 24 sources, real-time alerts.
                </p>
              </div>
              <SaveButton label="Manage subscription" />
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, value, textarea }: { label: string; value: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          defaultValue={value}
          rows={3}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      ) : (
        <input
          defaultValue={value}
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      )}
    </label>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function SaveButton({ label = "Save changes" }: { label?: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      {label}
    </button>
  );
}
