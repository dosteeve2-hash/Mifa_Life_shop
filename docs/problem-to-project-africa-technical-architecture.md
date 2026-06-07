# Problem to Project Africa

## MVP Technical Architecture

### Version
v1

### Goal
Build a focused MVP that helps a user go from:

- skills with no idea
- idea with no structure
- problem with no project

to:

- a recommended project
- a clear explanation
- an actionable roadmap

This architecture is intentionally simple, scalable, and realistic for a first strong version.

---

## 1. Architecture Principle

The MVP must optimize for:

- speed of execution
- clarity
- maintainability
- good demo value
- strong AI output quality

The MVP should not begin with a heavy microservices architecture.

It should begin with a clean monolithic full-stack architecture:

- `Next.js` for frontend + backend entry points
- `Supabase` for database, auth, and storage
- `LLM provider layer` for prompt-based recommendation generation
- `structured country context` for Burkina Faso v1

---

## 2. Recommended Stack

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components + Client Components where needed

### Backend
- Next.js Route Handlers and Server Actions
- TypeScript

### Database
- Supabase PostgreSQL

### Auth
- Supabase Auth

### AI Layer
- start with API-based generation through a provider abstraction
- support:
  - OpenAI-compatible provider later
  - Claude later
  - Ollama later

For MVP, the code should be provider-agnostic.

### Storage
- Supabase Storage

### Deployment
- Vercel for app deployment
- Supabase for backend services

---

## 3. High-Level System Design

```text
User
  |
  v
Next.js App
  |- Landing / Forms / Results UI
  |- Server Actions / Route Handlers
  |- Recommendation Engine
  |- Context Builder
  |
  +--> Supabase
  |     |- users
  |     |- profiles
  |     |- submissions
  |     |- generated_projects
  |     |- country_context
  |     |- sectors
  |     |- saved_roadmaps
  |
  +--> LLM Provider Layer
        |- Prompt templates
        |- Model adapter
        |- Structured output parser
```

---

## 4. Product Modules

The MVP should be split into 6 technical modules.

### 4.1 Public Marketing Module

Purpose:

- landing page
- product explanation
- CTA into the tool

Routes:

- `/`

### 4.2 Intake Module

Purpose:

- collect structured user input
- route user into one of the 3 modes

Modes:

- skill-to-project
- idea-to-project
- problem-to-project

Routes:

- `/start`
- `/start/skills`
- `/start/idea`
- `/start/problem`

### 4.3 Recommendation Engine Module

Purpose:

- transform user input into structured prompt context
- inject Burkina Faso knowledge
- call model provider
- parse output into a stable schema

Backend only.

### 4.4 Results Module

Purpose:

- show project recommendation
- show alternative ideas
- show rationale
- show feasibility

Routes:

- `/results/[id]`

### 4.5 Roadmap Module

Purpose:

- show execution plan
- milestones
- skills to learn
- first actions

Routes:

- `/projects/[id]`

### 4.6 User Workspace Module

Purpose:

- saved generations
- bookmarks
- project history

Routes:

- `/dashboard`

---

## 5. MVP User Flow

### Flow A: user has skills, no idea

1. User visits landing page
2. Clicks `Start`
3. Chooses `I have skills but no idea`
4. Fills structured form
5. Form is submitted
6. Server builds context
7. AI generates project options
8. Result is stored in DB
9. User sees recommendation and roadmap

### Flow B: user has an idea

1. User selects `I already have an idea`
2. Enters idea and context
3. AI evaluates idea
4. Returns refinement, feasibility, risks, better framing

### Flow C: user sees a problem

1. User selects `I observed a problem`
2. Describes problem
3. Adds location, affected people, sector, constraints
4. AI transforms problem into project direction

---

## 6. Route Map

### Public routes
- `/`
- `/about`
- `/how-it-works`

### Intake routes
- `/start`
- `/start/skills`
- `/start/idea`
- `/start/problem`

### Auth routes
- `/login`
- `/signup`

### App routes
- `/results/[id]`
- `/projects/[id]`
- `/dashboard`

### Admin/internal routes
- `/admin`
- `/admin/context`
- `/admin/sectors`

---

## 7. Suggested Frontend Structure

```text
src/
  app/
    page.tsx
    about/page.tsx
    how-it-works/page.tsx
    start/page.tsx
    start/skills/page.tsx
    start/idea/page.tsx
    start/problem/page.tsx
    results/[id]/page.tsx
    projects/[id]/page.tsx
    dashboard/page.tsx
    login/page.tsx
    admin/page.tsx
    api/
      generate/route.ts
  components/
    marketing/
    forms/
    results/
    roadmap/
    dashboard/
    ui/
  lib/
    ai/
    context/
    db/
    validation/
    scoring/
  types/
```

---

## 8. Backend Architecture

For MVP, backend logic should stay inside the Next.js codebase.

### Use
- Server Actions for authenticated writes where appropriate
- Route Handlers for generation requests and internal APIs

### Keep logic in service files
- do not put business logic directly into pages

Suggested backend folders:

```text
src/lib/ai/
  generate-project.ts
  provider.ts
  prompts.ts
  schemas.ts

src/lib/context/
  build-country-context.ts
  build-user-context.ts
  burkina-context.ts

src/lib/db/
  submissions.ts
  generated-projects.ts
  users.ts

src/lib/scoring/
  project-score.ts

src/lib/validation/
  intake-schema.ts
```

---

## 9. AI System Design

This is the core of the product.

The AI layer should be modular from day 1.

### 9.1 Input schema

Every request should normalize into one common internal object:

```ts
type IntakePayload = {
  mode: "skills" | "idea" | "problem";
  country: string;
  city?: string;
  sector: string;
  user_level: "beginner" | "intermediate" | "advanced";
  background?: string;
  skills?: string[];
  tools?: string[];
  time_available?: string;
  goal?: string;
  raw_idea?: string;
  raw_problem?: string;
  constraints?: string[];
};
```

### 9.2 Prompt strategy

Prompt generation should combine:

- system prompt
- country context prompt
- sector context
- user context
- output schema instruction

### 9.3 Output schema

The AI should always return structured JSON.

Example:

```ts
type GeneratedProjectResult = {
  title: string;
  one_liner: string;
  problem_statement: string;
  target_users: string[];
  why_now: string;
  why_local_fit: string;
  feasibility: {
    level: "low" | "medium" | "high";
    explanation: string;
  };
  impact: {
    level: "low" | "medium" | "high";
    explanation: string;
  };
  recommended_stack: string[];
  non_technical_requirements: string[];
  mvp_scope: string[];
  roadmap_30_days: {
    week_1: string[];
    week_2: string[];
    week_3: string[];
    week_4: string[];
  };
  project_alternatives: Array<{
    title: string;
    one_liner: string;
  }>;
  next_best_action: string;
};
```

### 9.4 Provider abstraction

Create one adapter interface:

```ts
type AiProvider = {
  generateStructuredProject(input: PromptInput): Promise<GeneratedProjectResult>;
};
```

This allows:

- OpenAI-compatible backend later
- Claude later
- Ollama later

without rewriting app logic.

---

## 10. Country Context Engine

The product’s power depends on contextual relevance.

For MVP, use a lightweight context system.

### Burkina Faso v1 context should include:

- national challenges
- important sectors
- common constraints
- digital limitations
- opportunities for local innovation

### First implementation

Use a curated static knowledge module:

```text
src/lib/context/burkina-context.ts
```

This can contain:

- structured summaries
- key constraints
- sector opportunities
- implementation heuristics

Later, move to:

- DB-backed context entries
- admin-editable context
- documents and knowledge ingestion

---

## 11. Database Design

Use Supabase PostgreSQL.

### 11.1 profiles

Purpose:

- extended user profile

Suggested fields:

- `id`
- `email`
- `display_name`
- `country`
- `role`
- `created_at`

### 11.2 submissions

Purpose:

- raw intake form submissions

Suggested fields:

- `id`
- `user_id`
- `mode`
- `country`
- `sector`
- `user_level`
- `background`
- `skills`
- `tools`
- `time_available`
- `goal`
- `raw_idea`
- `raw_problem`
- `constraints`
- `created_at`

### 11.3 generated_projects

Purpose:

- store generated recommendations

Suggested fields:

- `id`
- `submission_id`
- `user_id`
- `country`
- `sector`
- `title`
- `one_liner`
- `problem_statement`
- `result_json`
- `created_at`

### 11.4 saved_projects

Purpose:

- user bookmarks and saved project candidates

Suggested fields:

- `id`
- `user_id`
- `generated_project_id`
- `created_at`

### 11.5 country_context

Purpose:

- optional future DB table for country knowledge

Suggested fields:

- `id`
- `country`
- `sector`
- `title`
- `content`
- `priority`
- `created_at`

### 11.6 sectors

Purpose:

- controlled sector list

Suggested fields:

- `id`
- `slug`
- `name`
- `active`

---

## 12. Auth Design

For MVP:

- anonymous browsing allowed
- generation can be allowed without login in earliest version
- saving results requires login

Recommended auth:

- Supabase email OTP

Why:

- easy for MVP
- low friction
- already familiar to your stack

---

## 13. Validation Layer

Use schema validation for all intake payloads.

Recommended:

- `zod`

Validate:

- client-side
- server-side

This prevents weak or malformed prompts and stabilizes output quality.

---

## 14. Scoring and Prioritization Layer

Even if AI generates content, the app should own the scoring logic as much as possible.

Use deterministic post-processing where possible.

For example:

- map time available to complexity tolerance
- map user level to feasible stack depth
- map sector to urgency hints

Then combine with AI narrative explanation.

This makes recommendations more stable and productized.

---

## 15. UI Architecture

The UI should feel:

- serious
- premium
- useful
- African but modern
- structured, not noisy

### Design principles

- mobile-first
- strong visual hierarchy
- form experience must feel guided
- outputs must feel trustworthy
- avoid generic AI chatbot look

### UI zones

- brand/story zone
- guided input zone
- recommendation zone
- roadmap zone
- action zone

---

## 16. Suggested Component Architecture

### Marketing components
- `Hero`
- `HowItWorks`
- `UseCases`
- `SectorGrid`
- `CTASection`

### Form components
- `ModeSelector`
- `CountrySelector`
- `SectorSelector`
- `SkillInput`
- `ConstraintInput`
- `ProblemTextarea`
- `IdeaTextarea`

### Results components
- `RecommendedProjectCard`
- `AlternativeProjectsList`
- `FeasibilityBadge`
- `ImpactBadge`
- `WhyItFitsSection`

### Roadmap components
- `RoadmapTimeline`
- `WeekCard`
- `NextActionCard`
- `SkillGapPanel`

### Dashboard components
- `SavedProjectsGrid`
- `RecentSubmissionsList`

---

## 17. API and Server Endpoints

For MVP, one generation endpoint is enough.

### POST `/api/generate`

Input:

- normalized intake payload

Output:

- generated project result
- stored record id

### Optional additional endpoints later

- `POST /api/save-project`
- `GET /api/results/[id]`
- `GET /api/dashboard`

---

## 18. Security and Reliability

### Basic requirements

- validate all inputs
- rate limit generation endpoint
- protect saved user data with RLS
- keep AI provider keys server-side only

### Supabase policies

- users can read only their own submissions
- users can read only their own saved projects
- public cannot access private user records

---

## 19. Observability

For MVP, basic observability is enough.

Track:

- number of generations
- most selected sectors
- most selected mode
- saved project rate
- common failure points

This can initially be:

- simple DB logging
- server logs

Later:

- analytics dashboard
- feedback loop

---

## 20. Build Order

### Phase 1: Core foundation

- project setup
- UI system
- Supabase setup
- auth setup
- base routes

### Phase 2: Intake and generation

- mode selection
- forms
- validation
- AI provider abstraction
- generation endpoint
- result storage

### Phase 3: Result experience

- result page
- roadmap rendering
- save project
- dashboard

### Phase 4: Country refinement

- Burkina context enrichment
- better scoring
- output quality iteration

---

## 21. MVP Build Decision

If we want the strongest first version, the first release should prove only one thing:

Can the platform give a Burkina-focused user a project recommendation that feels locally relevant, personally appropriate, and actionable?

If yes, the foundation is valid.

---

## 22. Recommended First Build Scope

### Build now

- landing page
- mode selector
- 3 intake forms
- AI generation endpoint
- results page
- roadmap page
- login
- save to dashboard

### Do not build yet

- collaboration
- investor area
- team matching
- advanced admin
- full country database
- multi-agent autonomous workflow

---

## 23. Final Technical Strategy

For the MVP:

- keep the system monolithic
- keep the AI layer modular
- keep the country knowledge structured
- keep the UX focused
- keep the output actionable

This will give you:

- a serious portfolio project
- a scalable product foundation
- and a very strong story for recruiters, collaborators, and future users

