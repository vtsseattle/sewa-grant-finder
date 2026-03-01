# Sewa Grant Finder — Project Instructions & Brainstorm

## 1. Project Overview

**Sewa Grant Finder** is a web application that helps Sewa International USA discover, search, and evaluate grants that align with the organization's core pillars and programs.

**Problem:** Finding relevant grants is time-consuming. Sewa staff and volunteers must manually sift through thousands of federal, state, and foundation grants to find ones that match their mission areas.

**Solution:** A searchable web app that matches grants to Sewa's pillars, surfaces relevance scores, and helps the team prioritize grant opportunities.

---

## 2. Sewa International USA — Pillars & Focus Areas

| Pillar | Description | Example Programs |
|--------|-------------|------------------|
| **Disaster Response** | Rescue (72 hrs), Relief (3 months), Rehabilitation (3–5 yrs) | Hurricane relief, wildfire response, earthquake aid, flood relief |
| **Education** | Academic support for underserved children; literacy & learning | ASPIRE (K–6 after-school), Sponsor a Child, Colombia Sewa Learning Centers, AmeriCorps |
| **Family Services** | Health, wellness, case management for families in need | Stop Diabetes Movement, Know Your Healthy SELF, family case management |
| **Women Empowerment** | Programs empowering women through skills, health, awareness | SHE CAF campaign |
| **Volunteer Development** | Mobilizing and growing the volunteer base | Sewa Day, Days of Volunteering, Doctors for Sewa, Sewa Internships, Neighborhood Sewa |
| **Policy Research** | Research and advocacy on community issues | Policy Cafe, Policy Summit |

**Geographic scope:** Primarily USA (chapters in Houston, Bay Area, Boston, Atlanta, DC, etc.), with international projects in India, Colombia, Guyana, Kenya, Pakistan, Sri Lanka.

---

## 3. Key Features (Brainstorm)

### MVP (Phase 1)
- [ ] **Grant Search** — Search grants by keyword, category, or Sewa pillar
- [ ] **Pillar Matching** — Automatically tag/score grants against Sewa's pillars using keyword/semantic matching
- [ ] **Grant Database** — Aggregate grants from public sources (Grants.gov API, Foundation Directory, state portals)
- [ ] **Filter & Sort** — Filter by deadline, funding amount, eligibility, geography, pillar alignment
- [ ] **Grant Detail View** — Show full grant info: description, eligibility, deadlines, funding range, source link
- [ ] **Saved Grants** — Allow users to bookmark grants for later review

### Phase 2 (Enhancements)
- [ ] **AI-Powered Relevance Scoring** — Use LLM/embeddings to score grant descriptions against Sewa's mission and pillar descriptions
- [ ] **Grant Alerts / Notifications** — Email or in-app alerts when new matching grants appear
- [ ] **Application Tracker** — Track grant application status (identified → drafting → submitted → awarded/rejected)
- [ ] **Team Collaboration** — Assign grants to team members, leave notes, share across chapters
- [ ] **Reporting Dashboard** — Visualize pipeline: how many grants found, applied, awarded, total $ secured

### Phase 3 (Advanced)
- [ ] **Auto-Draft Grant Narratives** — AI-assisted generation of grant narrative sections using Sewa's past proposals and program descriptions
- [ ] **Multi-Source Aggregation** — Pull from federal (Grants.gov), state, corporate, and private foundation databases
- [ ] **Chapter-Level Views** — Filter grants by chapter geography (Houston, Bay Area, etc.)

---

## 4. Decisions Made

### Scope
- **US-only** grants
- **Grant size preference:** < $1M
- **Special inclusion:** Foundation grants of Indian origin + grants from high-net-worth individuals

### Data Source
- **Brave Search API** (free tier) for real-time grant discovery
- No database for MVP — search-driven architecture

### Matching & Scoring
- **Keyword-based pillar scoring** computed on-the-fly for each search result
- Rank results by how closely they match Sewa's 6 pillars

### User Features
- **Location filtering** — narrow by US state or city
- **Pillar filtering** — search within specific Sewa pillars
- No authentication for MVP — open internal tool

### Tech Stack
- **Next.js** (React) — frontend + API routes
- **Brave Search API** — grant discovery engine
- **No database** for MVP — stateless search
- **Vercel** or local dev for hosting

---

## 5. Proposed Tech Stack (Starting Point)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | **Next.js** (React) | SSR, API routes built-in, fast to prototype |
| Backend/API | **Next.js API Routes** + **Python scripts** for data ingestion | Keep it simple; Python for grant data scraping/API calls |
| Database | **PostgreSQL** (via Supabase or Neon) | Free tier, relational, good for structured grant data |
| Search | **Full-text search in Postgres** → upgrade to **Elasticsearch** later | Start simple, scale as needed |
| AI/Matching | **OpenAI API** (embeddings + chat) | Semantic matching, narrative generation |
| Hosting | **Vercel** (frontend + API) | Free tier, Git-integrated deploys |
| Auth | **NextAuth.js** or none for MVP | Add if user roles are needed |

---

## 6. Data Model (Draft)

```
Grant
├── id (UUID)
├── title (string)
├── description (text)
├── source (enum: grants_gov, state, foundation, corporate)
├── source_url (string)
├── funding_amount_min (decimal)
├── funding_amount_max (decimal)
├── deadline (date)
├── eligibility (text)
├── geography (string[]) — states/regions
├── status (enum: open, closed, upcoming)
├── created_at (timestamp)
├── updated_at (timestamp)
└── pillar_scores (jsonb)
    ├── disaster_response (float 0-1)
    ├── education (float 0-1)
    ├── family_services (float 0-1)
    ├── women_empowerment (float 0-1)
    ├── volunteer_development (float 0-1)
    └── policy_research (float 0-1)

SavedGrant
├── id (UUID)
├── user_id (UUID)
├── grant_id (UUID → Grant)
├── notes (text)
├── application_status (enum: identified, drafting, submitted, awarded, rejected)
└── saved_at (timestamp)

User
├── id (UUID)
├── name (string)
├── email (string)
├── role (enum: admin, chapter_lead, volunteer)
└── chapter (string)
```

---

## 7. Grants.gov API Notes

- **API Docs:** https://www.grants.gov/web-api-applicant
- Provides search by keyword, CFDA, agency, dates
- Returns opportunity details including description, eligibility, deadlines
- Rate limits apply — should cache/store results locally
- XML/JSON responses available

---

## 8. Next Steps

1. **Align on scope** — Confirm MVP feature set
2. **Choose tech stack** — Finalize from the options above
3. **Set up project scaffolding** — Initialize Next.js app, DB, CI/CD
4. **Build grant ingestion pipeline** — Start with Grants.gov API
5. **Implement search + pillar matching** — Core value proposition
6. **Design UI** — Simple, functional grant search interface
7. **Deploy** — Get a working prototype live

---

## 9. Success Metrics

- Number of relevant grants surfaced per pillar per month
- Time saved vs. manual grant searching (target: 80% reduction)
- Number of grants Sewa applies to that were discovered via this tool
- Grant dollars awarded from tool-discovered opportunities

---

*This document is a living brainstorm. Update as decisions are made.*
