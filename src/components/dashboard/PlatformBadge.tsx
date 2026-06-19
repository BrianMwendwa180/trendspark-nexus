import type { Platform } from "@/lib/mock-data";

const styles: Record<Platform, string> = {
  Twitter: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  TikTok: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  YouTube: "bg-red-500/10 text-red-300 border-red-500/30",
  Reddit: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  Instagram: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30",
  LinkedIn: "bg-blue-500/10 text-blue-300 border-blue-500/30",
};

export function PlatformBadge({ p }: { p: Platform }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles[p]}`}
    >
      {p}
    </span>
  );
}
