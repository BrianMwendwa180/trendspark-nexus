export type Platform = "Twitter" | "TikTok" | "YouTube" | "Reddit" | "Instagram" | "LinkedIn";

export type Trend = {
  id: string;
  trend_name: string;
  description: string;
  source_url: string;
  source: string;
  traffic_velocity: number;
  urgency: "High" | "Medium" | "Low";
  generated_brief?: {
    hook: string;
    angle: string;
    script: string;
    remix_template: string;
  };
  is_generated: boolean;
  detectedAt: string;
};

const mkTimeline = (peak: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    t: `D${i + 1}`,
    v: Math.max(2, Math.round(peak * Math.exp(-Math.pow((i - 8) / 3.2, 2)) + Math.random() * 6)),
  }));

export const trends: Trend[] = [
  {
    id: "ai-replacing-junior-devs",
    title: "AI is replacing junior developers",
    emoji: "🤖",
    platforms: ["Twitter", "TikTok", "YouTube"],
    growth: 290,
    virality: 96,
    relevance: 95,
    lifeDays: 3,
    detectedAt: "2h ago",
    engagement: 482_000,
    category: "Tech & Work",
    summary:
      "A wave of layoff posts paired with Devin/Cursor demos has triggered fear-driven discourse around junior dev roles being automated.",
    why: "People fear AI replacing entry-level jobs, and influencer accounts are amplifying the narrative with high-engagement hot takes.",
    angle:
      "Reframe the conversation: businesses that adopt AI-augmented developers ship 3x faster — early adopters win the next 18 months.",
    hook: "Everyone is asking if AI will replace developers. They're asking the wrong question.",
    script:
      "Open on a recruiter ghosting a CS grad. Cut to a solo founder shipping a SaaS in a weekend with Cursor. The lesson: AI isn't replacing developers — it's replacing developers who don't use AI. Show three concrete workflows: spec → scaffold → ship. End with a CTA to download the playbook.",
    cta: "Follow Kuzana for the daily AI playbook.",
    timeline: mkTimeline(95),
  },
  {
    id: "hustle-culture-backlash",
    title: "Hustle culture backlash from Gen Z",
    emoji: "🛑",
    platforms: ["TikTok", "Instagram", "Reddit"],
    growth: 184,
    virality: 88,
    relevance: 81,
    lifeDays: 5,
    detectedAt: "5h ago",
    engagement: 312_000,
    category: "Culture",
    summary:
      "Gen Z creators are pushing back on 5am routines and grindset content with satirical 'soft life' POVs racking up millions of views.",
    why: "Post-pandemic burnout is colliding with creator fatigue; satire converts faster than sincerity right now.",
    angle:
      "Position yourself as the anti-grind operator: systems > sacrifice. Calm execution beats loud hustle.",
    hook: "I quit the 5am club and tripled my revenue. Here's what actually moved the needle.",
    script:
      "Tease the contrarian claim. Walk through the 3 systems that replaced your morning routine: async standups, batched deep work, and a 4-hour shutdown ritual. Show the calendar before/after. Close with the 'soft execution' framework.",
    cta: "Grab the Calm Operator template (link in bio).",
    timeline: mkTimeline(82),
  },
  {
    id: "micro-saas-side-hustles",
    title: "Micro-SaaS as the new side hustle",
    emoji: "💸",
    platforms: ["Twitter", "YouTube", "LinkedIn"],
    growth: 142,
    virality: 84,
    relevance: 92,
    lifeDays: 9,
    detectedAt: "9h ago",
    engagement: 218_400,
    category: "Entrepreneurship",
    summary:
      "Indie hackers shipping $5k MRR niche tools are dominating build-in-public feeds, with weekend launches outperforming agency content.",
    why: "Lower build costs (AI + Vercel + Stripe) have collapsed the time-to-revenue for a single founder.",
    angle:
      "Show the new stack: idea on Monday, paying user on Friday. Document the math, not the motivation.",
    hook: "I built a $4k/mo SaaS in 9 days. Here's the exact stack and the spreadsheet.",
    script:
      "Day-by-day build log. Show the Stripe dashboard, the landing page, the 3 channels that drove signups. End with the repeatable 9-day template.",
    cta: "Download the 9-day micro-SaaS template.",
    timeline: mkTimeline(78),
  },
  {
    id: "ozempic-economy",
    title: "The Ozempic economy reshaping CPG",
    emoji: "💊",
    platforms: ["Twitter", "LinkedIn", "Reddit"],
    growth: 121,
    virality: 79,
    relevance: 74,
    lifeDays: 12,
    detectedAt: "1d ago",
    engagement: 168_900,
    category: "Business",
    summary:
      "Snack and beverage giants are reporting volume dips tied to GLP-1 adoption; analysts are calling it a once-in-a-decade reset.",
    why: "Investor decks and analyst threads are reframing every CPG company as either a GLP-1 winner or loser.",
    angle:
      "Help operators map their category to the GLP-1 thesis — protein up, sugar down, portion sizes down.",
    hook: "Ozempic just rewrote the rules of the snack aisle. Here's who wins.",
    script:
      "Set the stakes with the volume drop chart. Break the market into winners (protein, hydration) and losers (large-format sweets). Give the 3-question framework operators should ask this quarter.",
    cta: "Subscribe for the weekly CPG teardown.",
    timeline: mkTimeline(72),
  },
  {
    id: "ai-girlfriend-apps",
    title: "AI companion apps hit mainstream",
    emoji: "💬",
    platforms: ["TikTok", "Twitter", "Reddit"],
    growth: 96,
    virality: 71,
    relevance: 63,
    lifeDays: 6,
    detectedAt: "1d ago",
    engagement: 142_100,
    category: "Consumer AI",
    summary:
      "Character.ai-style companion apps are crossing into mainstream discourse with NYT-style think pieces and parent panic clips.",
    why: "Moral-panic content historically outperforms; this cycle adds a real revenue story ($200M+ ARR rumors).",
    angle:
      "Skip the panic. Show the business model and what it means for consumer AI design patterns.",
    hook: "AI girlfriends are a $200M business. The product lesson is bigger than the headline.",
    script:
      "Frame the moral panic, then pivot to the unit economics. Show 3 product patterns (memory, persona, voice) other consumer apps should steal.",
    cta: "Read the full teardown on Kuzana.",
    timeline: mkTimeline(66),
  },
  {
    id: "vibe-coding",
    title: "'Vibe coding' enters the chat",
    emoji: "🎧",
    platforms: ["Twitter", "YouTube"],
    growth: 88,
    virality: 69,
    relevance: 70,
    lifeDays: 4,
    detectedAt: "2d ago",
    engagement: 98_200,
    category: "Tech & Work",
    summary:
      "Karpathy's 'vibe coding' tweet kicked off a meme cycle of devs shipping with prompts and refusing to read the diff.",
    why: "It crystallizes a vibe shift in dev culture — taste over typing.",
    angle: "Show the responsible version: vibe-first, verify-second. Give a checklist.",
    hook: "Vibe coding is real. Here's how to do it without shipping a security incident.",
    script:
      "Demo the vibe loop in Cursor. Then layer the 4-step verify checklist. End with the repos where vibe coding fails.",
    cta: "Get the Verify Checklist (free).",
    timeline: mkTimeline(60),
  },
];

export const metrics = [
  { key: "active", label: "Active Trends", value: 128, delta: 18, icon: "🔥" },
  { key: "new", label: "New Today", value: 34, delta: 12, icon: "⚡" },
  { key: "high", label: "High Relevance", value: 17, delta: 4, icon: "🎯" },
  { key: "viral", label: "Viral Score", value: 94, delta: 6, icon: "📈", suffix: "%" },
] as const;

export const growthSeries = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}:00`,
  trends: Math.round(40 + Math.sin(i / 3) * 18 + Math.random() * 12 + i * 1.4),
  briefs: Math.round(12 + Math.cos(i / 4) * 8 + Math.random() * 6 + i * 0.6),
}));

export const platformDistribution = [
  { name: "TikTok", value: 38 },
  { name: "Twitter", value: 27 },
  { name: "YouTube", value: 16 },
  { name: "Reddit", value: 11 },
  { name: "Instagram", value: 8 },
];

export const categoryBars = [
  { name: "Tech & Work", count: 42 },
  { name: "Entrepreneurship", count: 35 },
  { name: "Culture", count: 28 },
  { name: "Consumer AI", count: 22 },
  { name: "Business", count: 19 },
  { name: "Finance", count: 14 },
];

export const predictionAccuracy = Array.from({ length: 12 }, (_, i) => ({
  t: `W${i + 1}`,
  predicted: 70 + Math.round(Math.random() * 8 + i * 1.2),
  actual: 68 + Math.round(Math.random() * 10 + i * 1.1),
}));

export const notifications = [
  { id: "n1", type: "trend", title: "New trend detected: 'Vibe coding'", time: "2 min ago" },
  {
    id: "n2",
    type: "brief",
    title: "Brief generated for 'AI replacing junior developers'",
    time: "10 min ago",
  },
  { id: "n3", type: "platform", title: "Reddit surge in r/Entrepreneur", time: "32 min ago" },
  { id: "n4", type: "trend", title: "Viral spike: 'Ozempic economy'", time: "1 h ago" },
  { id: "n5", type: "system", title: "Weekly digest is ready", time: "3 h ago" },
];

export const activity = [
  { id: "a1", who: "You", what: "saved", target: "AI replacing junior devs", time: "2m" },
  {
    id: "a2",
    who: "Kuzana AI",
    what: "generated brief for",
    target: "Hustle culture backlash",
    time: "14m",
  },
  { id: "a3", who: "Hunter", what: "promoted", target: "Micro-SaaS side hustles", time: "1h" },
  { id: "a4", who: "You", what: "exported", target: "Ozempic economy script", time: "3h" },
];
