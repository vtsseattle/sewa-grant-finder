# Sewa Grant Finder

A web app to search for grants aligned with [Sewa International USA](https://www.sewausa.org)'s six pillars.

## Features

- **Brave Search-powered** grant discovery across the web
- **Pillar-based ranking** — scores grants against Sewa's 6 pillars: Disaster Response, Education, Family Services, Women Empowerment, Volunteer Development, Policy Research
- **Location filtering** — narrow results by US state or city
- **Indian-origin foundations** — option to include grants from Indian American foundations and high-net-worth individuals
- **Focus:** US grants under $1M

## Quick Start

```bash
cd app
cp .env.example .env.local
# Add your Brave Search API key to .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Get a Brave Search API Key

1. Go to [https://brave.com/search/api/](https://brave.com/search/api/)
2. Sign up for a paid plan (the free tier is no longer available)
3. Copy your API key into `.env.local`

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── api/search/route.ts   # Brave Search API proxy + scoring
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main search page
│   ├── components/
│   │   ├── SearchBar.tsx         # Search input
│   │   ├── PillarFilter.tsx      # Pillar dropdown
│   │   ├── LocationFilter.tsx    # State/city filters
│   │   └── GrantCard.tsx         # Grant result card with scores
│   └── lib/
│       ├── pillars.ts            # Sewa pillar definitions & keywords
│       └── scoring.ts            # Pillar matching & scoring engine
├── .env.example
└── package.json
INSTRUCTIONS.md                   # Project brainstorm & decisions
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Brave Search API** for grant discovery
- Keyword-based pillar scoring (upgradeable to AI/embeddings)

## License

Private — Sewa International USA
