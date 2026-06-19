# TrendSpark Nexus Backend Plan

## Frontend Review

The current frontend is a TanStack Router/Vite React app, not Next.js. It is still structured like a production dashboard and already defines the backend contract through `frontend/src/lib/mock-data.ts`.

Current screens and backend needs:

- Dashboard `/`: overview metrics, featured live trend, 24h growth chart, activity feed, latest trends.
- Live trends `/trends`: searchable and filterable trend feed by category, platform, virality, growth, recency.
- Trend detail `/trends/:id`: trend summary, platforms, timeline, score breakdown, AI explanation, related signals.
- Briefs `/briefs` and `/briefs/:id`: generated content briefs with why, angle, hook, script, CTA, export/share actions.
- Analytics `/analytics`: growth series, platform distribution, category bars, prediction accuracy.
- Saved `/saved`: user bookmarks.
- Settings `/settings`: account, source toggles, notification preferences, billing plan placeholder.
- Login `/login`: email/password and future Google OAuth.
- Shell: global search, notifications drawer, live source count, user/workspace profile.

The frontend's mock `Trend` currently mixes several backend concepts into one object:

- Trend identity: `id`, `title`, `emoji`, `category`, `summary`, `detectedAt`.
- Scoring: `growth`, `virality`, `relevance`, `lifeDays`, `engagement`.
- Sources: `platforms`.
- AI brief: `why`, `angle`, `hook`, `script`, `cta`.
- Analytics: `timeline`.

The backend should split these into separate MongoDB collections while returning frontend-friendly DTOs.

## Architecture Choice

Use a modular, event-driven NestJS backend with MongoDB as the source of truth.

```text
React Frontend
   |
REST / WebSocket
   |
NestJS API
   |
   +-- Auth Module
   +-- Dashboard Module
   +-- Trends Module
   +-- Briefs Module
   +-- Analytics Module
   +-- Notifications Module
   +-- Settings Module
   |
MongoDB Atlas / local MongoDB
Redis
BullMQ Workers
OpenAI API
External Collectors
```

Recommended stack:

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | NestJS |
| Language | TypeScript |
| Database | MongoDB |
| Mongo ODM | Mongoose via `@nestjs/mongoose` |
| Validation | Zod DTO validation or Nest pipes with Zod |
| Queue | BullMQ |
| Cache | Redis |
| Scheduler | `@nestjs/schedule` |
| Auth | JWT access tokens + refresh tokens |
| Passwords | bcrypt or argon2 |
| Real time | Socket.IO gateway |
| AI | OpenAI API |
| Embeddings | MongoDB Atlas Vector Search first, Pinecone later if needed |
| Logging | Pino |
| Docs | Swagger/OpenAPI |
| Deployment | Docker Compose for local, Render/Railway/VPS for API + workers |

Why Mongoose instead of Prisma:

- MongoDB is document-oriented and the app has nested source snapshots, AI outputs, timelines, settings, and event metadata.
- Mongoose maps cleanly to NestJS modules and lets us model embedded documents naturally.
- Prisma can work with MongoDB, but it is less natural for this event-heavy document model. If Prisma is a hard requirement later, we can switch before implementation.

## Backend Folder Structure

```text
backend/
  src/
    app.module.ts
    main.ts
    config/
      env.schema.ts
      app.config.ts
      mongo.config.ts
      redis.config.ts
      openai.config.ts
    common/
      decorators/
      filters/
      guards/
      interceptors/
      pipes/
      types/
    modules/
      auth/
      users/
      dashboard/
      trends/
      sources/
      collectors/
      ai/
      briefs/
      analytics/
      notifications/
      saved/
      settings/
      search/
    queues/
      queue.constants.ts
      queue.module.ts
      producers/
    workers/
      trend-ingestion.worker.ts
      trend-processing.worker.ts
      ai-brief.worker.ts
      analytics-rollup.worker.ts
      notification.worker.ts
    websocket/
      events.gateway.ts
      events.types.ts
    scripts/
      seed.ts
      backfill-analytics.ts
    test/
```

## MongoDB Collections

### users

Stores account and workspace identity.

```ts
{
  _id: ObjectId,
  name: string,
  email: string,
  passwordHash: string,
  role: "owner" | "admin" | "member",
  plan: "free" | "pro" | "team",
  brandVoice?: string,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

- unique `email`

### refresh_tokens

Use hashed refresh tokens so stolen DB records are not directly usable.

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: string,
  userAgent?: string,
  ip?: string,
  expiresAt: Date,
  revokedAt?: Date,
  createdAt: Date
}
```

Indexes:

- `userId`
- TTL on `expiresAt`

### trends

Clean, deduplicated trend intelligence displayed by the app.

```ts
{
  _id: ObjectId,
  slug: string,
  title: string,
  emoji?: string,
  category: string,
  summary: string,
  status: "new" | "processing" | "ready" | "archived",
  platforms: ("twitter" | "tiktok" | "youtube" | "reddit" | "instagram" | "linkedin" | "news")[],
  score: {
    virality: number,
    growth: number,
    engagement: number,
    recency: number,
    businessRelevance: number,
    sentiment: number,
    total: number
  },
  metrics: {
    engagement: number,
    views: number,
    likes: number,
    shares: number,
    comments: number,
    dailyMentions: number,
    lifeDays: number
  },
  detectedAt: Date,
  lastSeenAt: Date,
  imageUrl?: string,
  tags: string[],
  embedding?: number[],
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

- unique `slug`
- text index on `title`, `summary`, `tags`
- compound `score.total`, `detectedAt`
- `category`, `platforms`, `status`
- vector index on `embedding` if using MongoDB Atlas Vector Search

### raw_signals

Immutable-ish source records from collectors.

```ts
{
  _id: ObjectId,
  platform: string,
  externalId: string,
  url: string,
  author?: string,
  title: string,
  body?: string,
  hashtags: string[],
  language?: string,
  country?: string,
  metrics: {
    likes: number,
    shares: number,
    comments: number,
    views: number
  },
  collectedAt: Date,
  normalizedAt?: Date,
  trendId?: ObjectId,
  fingerprint: string,
  raw: Record<string, unknown>
}
```

Indexes:

- unique compound `platform`, `externalId`
- unique `fingerprint`
- `collectedAt`
- `trendId`

### trend_sources

Links clean trends to their strongest source examples.

```ts
{
  _id: ObjectId,
  trendId: ObjectId,
  platform: string,
  url: string,
  title: string,
  author?: string,
  metrics: {
    likes: number,
    shares: number,
    comments: number,
    views: number
  },
  capturedAt: Date
}
```

Indexes:

- `trendId`
- compound `platform`, `capturedAt`

### briefs

Generated content output. Keep prompt metadata for versioning.

```ts
{
  _id: ObjectId,
  trendId: ObjectId,
  userId?: ObjectId,
  title: string,
  why: string,
  angle: string,
  hook: string,
  script: string,
  cta: string,
  remix: string,
  lifespan: string,
  confidence: number,
  promptVersion: string,
  model: string,
  status: "queued" | "generating" | "ready" | "failed",
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

- `trendId`
- compound `userId`, `createdAt`
- `status`

### analytics_snapshots

Time-series chart data for trend detail and dashboard rollups.

```ts
{
  _id: ObjectId,
  trendId?: ObjectId,
  scope: "trend" | "dashboard" | "platform" | "category" | "model",
  bucket: "hour" | "day" | "week",
  timestamp: Date,
  metrics: {
    trends?: number,
    briefs?: number,
    mentions?: number,
    engagement?: number,
    reach?: number,
    velocity?: number,
    predicted?: number,
    actual?: number
  },
  dimensions: {
    platform?: string,
    category?: string
  }
}
```

Indexes:

- compound `scope`, `bucket`, `timestamp`
- `trendId`, `timestamp`
- TTL can be added later for high-volume raw snapshots.

### notifications

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  type: "trend" | "brief" | "platform" | "system",
  title: string,
  message: string,
  entityType?: "trend" | "brief",
  entityId?: ObjectId,
  read: boolean,
  createdAt: Date
}
```

Indexes:

- compound `userId`, `read`, `createdAt`

### saved_items

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  entityType: "trend" | "brief",
  entityId: ObjectId,
  notes?: string,
  createdAt: Date
}
```

Indexes:

- unique compound `userId`, `entityType`, `entityId`

### user_settings

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  sources: {
    twitter: boolean,
    tiktok: boolean,
    youtube: boolean,
    reddit: boolean,
    instagram: boolean,
    linkedin: boolean,
    news: boolean
  },
  notifications: {
    viralTrend: boolean,
    dailyDigest: boolean,
    weeklyReport: boolean,
    briefGenerated: boolean
  },
  briefPreferences: {
    defaultTone: string,
    defaultFormat: "short-form-video" | "thread" | "blog" | "linkedin-post",
    brandVoice: string
  },
  updatedAt: Date
}
```

Indexes:

- unique `userId`

## Event-Driven Processing

Use BullMQ queues for slow and retryable work.

```text
collector:fetch
  -> raw_signal:created
  -> trend:normalize
  -> trend:dedupe
  -> trend:score
  -> trend:ready
  -> brief:generate
  -> analytics:rollup
  -> notification:create
  -> websocket:emit
```

Queue names:

- `collector.queue`: scheduled collection from Reddit, YouTube, X/Twitter, TikTok, news.
- `trend.queue`: normalization, dedupe, clustering, scoring.
- `ai.queue`: summary, classification, angle, hook, script, CTA, remix.
- `analytics.queue`: dashboard and trend chart rollups.
- `notification.queue`: notification persistence and WebSocket fanout.

Each job should be idempotent. Use stable job IDs such as `platform:externalId`, `trend:slug:score`, or `brief:trendId:userId`.

## Trend Scoring

Initial score:

```text
total =
  engagementScore * 0.35 +
  growthScore * 0.25 +
  recencyScore * 0.20 +
  businessRelevanceScore * 0.20
```

Inputs:

- Engagement: normalized likes, comments, shares, views per platform.
- Growth: rate of mentions/engagement increase across buckets.
- Recency: decays as `lastSeenAt` ages.
- Business relevance: AI classifier result plus category/source weighting.
- Platform weight: used inside engagement normalization, not as a separate frontend field.

The frontend's `virality`, `growth`, `relevance`, `lifeDays`, and `engagement` map directly from `trend.score` and `trend.metrics`.

## AI Pipeline

Keep each AI task isolated and versioned:

```text
ai/
  prompt-registry.ts
  summary.service.ts
  classification.service.ts
  business-angle.service.ts
  hook.service.ts
  script.service.ts
  cta.service.ts
  lifespan.service.ts
  remix.service.ts
  embedding.service.ts
```

Pipeline:

```text
Clean Trend
  -> summary
  -> category/classification
  -> why it is trending
  -> business angle
  -> hook
  -> script
  -> CTA
  -> remix
  -> confidence and lifespan
  -> save brief
```

Store:

- generated output,
- model name,
- prompt version,
- source trend snapshot,
- token usage if available,
- generation status and failure reason.

## REST API Contract

All routes should be versioned under `/api/v1`.

### Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/profile
```

### Dashboard

```text
GET /api/v1/dashboard/overview
GET /api/v1/dashboard/activity
GET /api/v1/dashboard/metrics
```

`GET /dashboard/overview` should return the data needed by the current home page:

```ts
{
  featuredTrend: TrendCardDto,
  metrics: MetricDto[],
  growthSeries: { t: string; trends: number; briefs: number }[],
  activity: ActivityDto[],
  latestTrends: TrendCardDto[]
}
```

### Trends

```text
GET  /api/v1/trends
GET  /api/v1/trends/:id
GET  /api/v1/trends/live
GET  /api/v1/trends/search?q=
POST /api/v1/trends/:id/bookmark
DELETE /api/v1/trends/:id/bookmark
```

Query support:

```text
category
platform
minScore
sort=score|growth|recency|engagement
page
limit
```

### Briefs

```text
POST   /api/v1/briefs/generate/:trendId
GET    /api/v1/briefs
GET    /api/v1/briefs/:id
PUT    /api/v1/briefs/:id
DELETE /api/v1/briefs/:id
POST   /api/v1/briefs/:id/export
```

Generation should enqueue `brief:generate` and return `202 Accepted` if the brief is not ready yet.

### Analytics

```text
GET /api/v1/analytics/growth
GET /api/v1/analytics/platforms
GET /api/v1/analytics/categories
GET /api/v1/analytics/prediction-accuracy
GET /api/v1/analytics/trends/:id/timeline
```

### Notifications

```text
GET    /api/v1/notifications
PUT    /api/v1/notifications/read
DELETE /api/v1/notifications/:id
```

### Settings

```text
GET /api/v1/settings
PUT /api/v1/settings/account
PUT /api/v1/settings/sources
PUT /api/v1/settings/notifications
PUT /api/v1/settings/brief-preferences
```

### Search

```text
GET /api/v1/search?q=
```

Returns mixed results for trends, briefs, and saved items for the global search bar.

## WebSocket Events

Namespace: `/events`

Client subscribes after auth.

```text
trend:new
trend:update
brief:queued
brief:generated
notification:new
analytics:update
```

Payloads should reuse REST DTO shapes where possible.

Example:

```ts
{
  event: "trend:new",
  data: TrendCardDto
}
```

## Frontend DTOs

Create DTOs that match the existing mock data so frontend migration is easy.

```ts
type PlatformDto = "Twitter" | "TikTok" | "YouTube" | "Reddit" | "Instagram" | "LinkedIn" | "News";

type TrendCardDto = {
  id: string;
  title: string;
  emoji?: string;
  platforms: PlatformDto[];
  growth: number;
  virality: number;
  relevance: number;
  lifeDays: number;
  detectedAt: string;
  engagement: number;
  category: string;
  summary: string;
};

type TrendDetailDto = TrendCardDto & {
  why: string;
  angle: string;
  timeline: { t: string; v: number }[];
  sources: TrendSourceDto[];
  related: TrendCardDto[];
};

type BriefDto = {
  id: string;
  trendId: string;
  title: string;
  why: string;
  angle: string;
  hook: string;
  script: string;
  cta: string;
  remix: string;
  confidence: number;
  status: "queued" | "generating" | "ready" | "failed";
};
```

## Security Baseline

- JWT access token with short TTL.
- Refresh token rotation with hashed refresh tokens.
- bcrypt or argon2 password hashing.
- Helmet.
- CORS allowlist for local frontend and production domain.
- Rate limits for auth, search, and brief generation.
- Zod validation at API boundaries.
- Request logging with correlation IDs.
- Secrets via environment variables only.
- Role guard for admin/collector/internal endpoints.
- WebSocket auth handshake.

## Environment Variables

```text
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
FRONTEND_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/trendspark_nexus
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d

OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_EMBEDDING_MODEL=

X_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
YOUTUBE_API_KEY=
NEWS_API_KEY=
```

## Local Development Services

Use Docker Compose for infrastructure:

```text
mongodb
redis
backend-api
backend-worker
```

Run the API and workers separately so queue processing can scale independently in production.

## Implementation Roadmap

### Phase 1: Backend Foundation

- Scaffold NestJS backend.
- Add config validation, MongoDB connection, Redis connection, Swagger, Pino logging.
- Add Docker Compose for MongoDB and Redis.
- Add health endpoint: `/api/v1/health`.

### Phase 2: Auth and Users

- Implement users, auth, refresh tokens, guards, profile endpoint.
- Seed one demo user matching the frontend placeholder account.
- Add settings collection and default settings creation.

### Phase 3: Frontend-Compatible Read APIs

- Implement trends, briefs, dashboard, analytics, notifications read endpoints.
- Seed MongoDB from the current mock data so the frontend can switch from local mocks to API calls without changing the UI concept.
- Add bookmarks/saved items.

### Phase 4: Queues and Workers

- Add BullMQ queues.
- Implement trend processing and brief generation jobs.
- Make `POST /briefs/generate/:trendId` asynchronous.
- Emit WebSocket events when jobs complete.

### Phase 5: Collectors

- Start with Reddit, YouTube, and news collectors because they have accessible APIs.
- Add X/Twitter, TikTok, Instagram, and LinkedIn based on API access and scraping/legal constraints.
- Store raw signals first, then normalize into trends.

### Phase 6: AI Intelligence

- Add OpenAI prompt services.
- Add prompt versioning and regression fixtures.
- Add embeddings for dedupe and related trends.
- Add MongoDB Atlas Vector Search when hosted on Atlas.

### Phase 7: Production Readiness

- Add rate limiting, monitoring, structured audit logs, backups, and CI checks.
- Add pagination and cache hot dashboard endpoints in Redis.
- Split API and worker deployments.
- Add dead-letter queue handling and job retry dashboards.

## First Build Milestone

The first useful backend milestone should be:

1. `GET /api/v1/dashboard/overview`
2. `GET /api/v1/trends`
3. `GET /api/v1/trends/:id`
4. `GET /api/v1/briefs`
5. `GET /api/v1/briefs/:id`
6. `GET /api/v1/analytics/*`
7. `GET /api/v1/notifications`
8. MongoDB seed script using the existing frontend mock data shape.

This gives the frontend real API-backed data before collector and AI complexity arrives.
