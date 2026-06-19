import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · TrendJack Hunter" },
      { name: "description", content: "Sign in to your TrendJack Hunter workspace." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left: pitch */}
        <div className="hidden flex-col justify-between border-r border-border p-10 lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-bold">TrendJack</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Hunter
              </div>
            </div>
          </Link>

          <div className="max-w-md">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              <span className="live-pulse-dot" /> Real-time intelligence
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight">
              The AI newsroom for <span className="text-primary">entrepreneurs</span>.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              See what's trending, why it matters, how long it'll last — and ship a publish-ready
              brief in one click.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "Sources", v: "24" },
                { k: "Trends/day", v: "1.2k" },
                { k: "Accuracy", v: "94%" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-lg border border-border bg-card/60 p-3 backdrop-blur"
                >
                  <div className="font-mono text-xl font-semibold">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-mono text-[11px] text-muted-foreground">© TrendJack Hunter · v1.0</p>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-display font-bold">TrendJack Hunter</span>
              </Link>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to see today's hunts.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="mt-6 space-y-4"
            >
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    defaultValue="hello@kuzana.io"
                    className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    defaultValue="••••••••"
                    className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign in <ArrowRight className="h-4 w-4" />
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm hover:border-primary/40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 11v3.8h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 4 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12.3S6.9 21.5 12 21.5c6.9 0 9.4-4.9 9.4-7.3 0-.5-.1-.9-.1-1.2H12z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <a className="text-primary hover:underline" href="#">
                Create one →
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
