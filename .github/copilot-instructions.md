# Copilot Instructions — Sewa Grant Finder

## Project Identity

This is **Sewa Grant Finder**, a web app built for **Sewa International USA** (sewausa.org).
It searches for US grants (preferably < $1M) and ranks them by relevance to Sewa's six organizational pillars.
The repo lives under the **vtsseattle** GitHub account.

## About Sewa International USA

- Hindu faith-based, 501(c)(3) humanitarian nonprofit, founded 2003
- Part of a global movement active in 20 countries
- Serves all people irrespective of race, color, religion, gender, or nationality
- Tax ID: 20-0638718
- US chapters in Houston, Bay Area, Boston, Atlanta, Washington DC, and more
- International projects in India, Colombia, Guyana, Kenya, Pakistan, Sri Lanka

### The 6 Pillars

| Pillar | Focus | Example Programs |
|--------|-------|------------------|
| **Disaster Response** | Rescue (72 hrs), Relief (3 months), Rehabilitation (3–5 yrs) | Hurricane/wildfire/earthquake relief, FEMA assistance, clean-up |
| **Education** | Academic support for underserved children, literacy | ASPIRE (K–6 after-school), Sponsor a Child, Colombia Sewa Learning Centers, AmeriCorps |
| **Family Services** | Health, wellness, case management | Stop Diabetes Movement, Know Your Healthy SELF, family case management |
| **Women Empowerment** | Skills development, health awareness, economic opportunity | SHE CAF campaign |
| **Volunteer Development** | Mobilizing and training volunteers | Sewa Day, Days of Volunteering, Doctors for Sewa, Sewa Internships, Neighborhood Sewa |
| **Policy Research** | Research and advocacy on community issues | Policy Cafe, Policy Summit |

These pillars are codified with keywords in `app/src/lib/pillars.ts`. When adding or modifying pillar logic, always keep this file as the single source of truth.

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, TypeScript) |
| Styling | **Tailwind CSS** |
| Data Source | **Brave Search API** (paid plan — free tier no longer available) |
| Scoring | Keyword-based pillar matching in `app/src/lib/scoring.ts` |
| Hosting | **Vercel** (production) + local dev |
| Database | None (stateless, search-driven) |
| Auth | None (open internal tool) |

### Project Structure

```
sewa-grant-finder/
├── INSTRUCTIONS.md              # Brainstorm & project roadmap
├── README.md                    # Setup & usage docs
├── .github/
│   └── copilot-instructions.md  # THIS FILE
└── app/                         # Next.js application root
    ├── .env.local               # BRAVE_API_KEY (never commit)
    ├── .env.example             # Template for env vars
    ├── vercel.json              # Vercel deployment config
    ├── src/
    │   ├── app/
    │   │   ├── api/search/route.ts   # GET /api/search — Brave Search proxy + pillar scoring
    │   │   ├── layout.tsx            # Root layout
    │   │   └── page.tsx              # Main search page (client component)
    │   ├── components/
    │   │   ├── SearchBar.tsx         # Search input with submit
    │   │   ├── PillarFilter.tsx      # Pillar dropdown selector
    │   │   ├── LocationFilter.tsx    # US state dropdown + city text input
    │   │   └── GrantCard.tsx         # Grant result card with pillar score bars
    │   └── lib/
    │       ├── pillars.ts            # Pillar definitions, keywords, colors, US_STATES list
    │       └── scoring.ts            # scorePillars() and processSearchResults()
    └── package.json
```

## Key Design Decisions

1. **US-only** — all search queries append "United States"; location filters are US states/cities
2. **Grants < $1M preferred** — search queries include "small grant OR community grant"
3. **Indian-origin foundations included** — optional toggle adds "Indian American", "South Asian", "Hindu", "Indian foundation" to queries
4. **Keyword-based scoring** — each grant result is scored 0–100% per pillar by counting keyword matches (see `scoring.ts`). Normalize at 5 matches = 100%. This is intentionally simple and designed to be upgradeable to AI/embeddings later.
5. **Results ranked by total relevance** — sum of all pillar scores, highest first
6. **No database** — MVP is fully stateless; every search hits Brave API live
7. **No auth** — open tool for Sewa staff and volunteers

## Coding Conventions

- **TypeScript** — strict types, no `any` unless unavoidable (mark with `eslint-disable` comment)
- **Client components** — mark with `"use client"` when using React hooks or browser APIs
- **Server components / API routes** — default; keep data fetching server-side
- **Tailwind only** — no CSS modules or inline styles; use Tailwind classes
- **Component files** — one component per file in `src/components/`, PascalCase filenames
- **Lib files** — utility/logic in `src/lib/`, camelCase filenames
- **Colors** — orange-600 for primary brand (Sewa's color), each pillar has its own color defined in `pillars.ts`
- **Error handling** — API routes return `{ error: string }` with appropriate HTTP status codes
- **Environment variables** — only `BRAVE_API_KEY` for now; access via `process.env` in API routes only

## API

### `GET /api/search`

Query params:
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Free-text search query |
| `pillar` | string | Pillar ID to focus search (e.g., `disaster_response`) |
| `state` | string | US state name |
| `city` | string | City name |
| `indian` | "true"/"false" | Include Indian-origin foundation terms (default: true) |

Response: `{ query: string, results: GrantResult[], total: number }`

## Future Enhancements (Roadmap)

In priority order:
1. AI-powered relevance scoring (embeddings via OpenAI or similar)
2. Grant alerts / email notifications for new matches
3. Application tracker (identified → drafting → submitted → awarded/rejected)
4. Saved/bookmarked grants with notes
5. Team collaboration and chapter-level views
6. Grants.gov API integration for federal grant data
7. Auto-draft grant narrative sections using AI
8. Reporting dashboard (pipeline visualization, $ tracked)

## Running Locally

```bash
cd app
cp .env.example .env.local   # Add BRAVE_API_KEY
npm install
npm run dev                   # http://localhost:3000
```

## Deploying

```bash
cd app
vercel --prod                 # Deploys to Vercel
```

Production URL: https://app-sigma-flame.vercel.app
Env var `BRAVE_API_KEY` is configured in Vercel project settings.
