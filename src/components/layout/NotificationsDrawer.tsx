import { motion } from "framer-motion";
import { X, Flame, FileText, Radio, Sparkles } from "lucide-react";
import { notifications } from "@/lib/mock-data";

const iconFor = (type: string) =>
  type === "trend" ? Flame : type === "brief" ? FileText : type === "platform" ? Radio : Sparkles;

export function NotificationsDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-sidebar"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">5 new today</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {notifications.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div
                key={n.id}
                className="mb-2 flex gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/40"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{n.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.aside>
    </>
  );
}
