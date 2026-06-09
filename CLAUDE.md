# Mifa Life — Project Rules & Architecture

## What this project is

Mifa Life is a Malian e-commerce marketplace (Next.js 16 + Supabase) built by 11 Malian students based in Tokat, Turkey. The platform sells fashion, electronics, and everyday goods across Mali with Orange Money / Wave payment integration.

## Stack

- **Framework**: Next.js 16.1.6, App Router, Turbopack
- **UI**: React 19, Framer Motion 12, Lucide React, inline styles + CSS vars
- **Backend**: Supabase (auth, database, storage) via `@supabase/ssr`
- **Fonts**: Playfair Display (headings), system sans-serif (body)
- **Deploy**: Vercel (preview per PR, production on `main`)
- **Language**: French (fr-FR) throughout — all UI copy, metadata, error messages

## Design system (CSS variables)

```
--em:      #00897B   (teal — primary action color)
--sl:      #2C3A3F   (dark slate — headings)
--sl3:     #111B22   (near-black — page headers/hero)
--bg:      #F5F5F5   (page background)
--bg2:     #EEEEEE   (subtle dividers)
--bg3:     #E0E0E0   (borders)
--white:   #FFFFFF
--t1–t4:   text hierarchy (dark → muted)
--em-l:    teal tint (light bg for highlights)
--em-g:    teal border
--or:      #FF6F00   (orange — flash/promo)
--or-l:    orange tint
```

## Code rules

### Server vs Client Components
- Default to **Server Components** (no `'use client'`) for pages that only need data fetching
- Use `'use client'` only when you need: `useState`, `useEffect`, event handlers, browser APIs
- **Never** put `onMouseEnter`/`onMouseLeave`/`onClick` on elements in Server Components — use CSS class hover instead (`.blog-card:hover` in `globals.css`)

### Supabase patterns
```typescript
// Server Component
import { createServerSupabaseClient } from '@/lib/supabase/server';
const supabase = await createServerSupabaseClient(); // throws if env absent

// Client Component — lazy singleton
let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}
```

### Graceful degradation
- **Always** wrap server Supabase calls in `try/catch` with a fallback (empty array, mock data, redirect)
- Pages must render something useful even without env vars (Vercel preview deployments)
- `export const dynamic = 'force-dynamic'` on any page that reads live data

### Styling conventions
- Inline styles for one-off values; `.blog-card` CSS class for reusable hover effects
- Page headers: `background: 'var(--sl3)'` + breadcrumb + Playfair `<h1>` + subtitle
- `clamp()` for responsive font sizes: `clamp(22px,4vw,34px)`
- Consistent card: `background: 'var(--white)', borderRadius: 14, border: '1px solid var(--bg3)'`

### Prices
- Currency: **FCFA** (West African CFA franc)
- Format: `price.toLocaleString('fr')` + ` F` or ` FCFA`
- Typical range: 1 000 – 500 000 FCFA

### No unnecessary abstractions
- Don't extract a component unless 3+ pages need the exact same thing
- Don't add error handling for impossible cases
- Don't write comments unless the WHY is genuinely non-obvious

## Database tables (Supabase)

| Table | Used by |
|---|---|
| `mifa_products` | shop, flash, promo, wishlist, comparateur, essentials |
| `mifa_orders` | orders, track, admin |
| `mifa_categories` | categories page |
| `profiles` | account, auth |
| `notifications` | notifications page |
| `seller_applications` | seller-register form |
| `blog_posts` | blog (optional, falls back to static) |

## Auth flow

Email OTP (no password). `/login` → Supabase sends magic link → `/account` on success. All account-related pages check `sb.auth.getUser()` and show a login wall if unauthenticated.

## Pages inventory

| Route | Type | Status |
|---|---|---|
| `/` | Server | ✅ Hero + products |
| `/shop` | Server | ✅ Grid + filters |
| `/shop/[id]` | Server | ✅ Product detail |
| `/login` | Client | ✅ OTP 3-step |
| `/account` | Client | ✅ Profile + orders |
| `/orders` | Server | ✅ Order list |
| `/cart` | Client | ✅ Cart |
| `/checkout` | Client | ✅ Checkout |
| `/track` | Server | ✅ Order tracking |
| `/contact` | Client | ✅ Form + sidebar |
| `/about` | Server | ✅ Story + values |
| `/faq` | Client | ✅ Accordion |
| `/blog` | Server | ✅ Article grid |
| `/blog/[slug]` | Server | ✅ Full article |
| `/returns` | Server | ✅ Return policy |
| `/privacy` | Server | ✅ Legal |
| `/wishlist` | Client | ✅ Saved products |
| `/promo` | Client | ✅ 48h countdown |
| `/flash` | Client | ✅ 6h flash sales |
| `/categories` | Server | ✅ Category grid |
| `/gift-cards` | Server | ✅ Coming soon |
| `/sizing-guide` | Server | ✅ Size tables |
| `/notifications` | Client | ✅ Notification feed |
| `/seller-register` | Client | ✅ Seller application |
| `/seller-dashboard` | Client | ✅ Seller KPIs |
| `/comparateur` | Client | ✅ Product compare |
| `/essentials` | Server | ✅ Daily essentials |
| `/assistant` | Client | ✅ AI chat |
| `/admin` | Client | ✅ Admin dashboard |
| `/dashboard` | — | Redirects → /account |

## Roadmap

See GitHub Issues for the full feature backlog. Key milestones:

1. **MVP Polish** — mobile responsive audit, Supabase tables creation, Vercel env vars
2. **Payments** — Orange Money API, Wave integration, receipt generation
3. **Seller tools** — product upload, inventory management, analytics
4. **AI features** — smart search, personalized recommendations, chatbot backend
5. **Mobile app** — React Native or PWA wrapper

## Commit conventions

```
feat: new feature
fix: bug fix
chore: config/deps
docs: documentation
style: formatting
refactor: restructure without behavior change
```

## Environment variables required

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Never hardcode these. All production secrets live in Vercel environment settings.
