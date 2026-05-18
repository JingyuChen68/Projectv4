# EmbedPrep — Embedded Systems Interview Prep Tool (Assignment 3)

## Project Overview
EmbedPrep is a full-stack Next.js + Tailwind CSS interview preparation tool for embedded systems, hardware, and automation engineering roles. It features 510+ practice questions, 17 study guides, 610+ industry intel items, a career roadmap planner, company research tracker, and preparation checklist.

**Assignment 3 additions:** Clerk auth, Supabase database, GitHub API integration for searching and saving open-source embedded systems projects.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Auth:** Clerk (sign up, log in, sign out)
- **Database:** Supabase (PostgreSQL with RLS)
- **External API:** GitHub Search API (repos)
- **State:** React Context API (client-side) + Supabase (persistent)

## Pages / Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Dashboard with stats, featured lessons, recent questions, quick actions |
| `/explore` | `src/app/explore/page.tsx` | Search GitHub for embedded systems repos, save to study list |
| `/saved` | `src/app/saved/page.tsx` | View saved repos and questions (per user, from Supabase) |
| `/sign-in` | `src/app/sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in page |
| `/sign-up` | `src/app/sign-up/[[...sign-up]]/page.tsx` | Clerk sign-up page |
| `/lessons` | `src/app/lessons/page.tsx` | 17 study guides with suggested learning path |
| `/lessons/[slug]` | `src/app/lessons/[slug]/page.tsx` | Individual lesson detail |
| `/questions` | `src/app/questions/page.tsx` | Browse & add 510+ practice questions |
| `/questions/[id]` | `src/app/questions/[id]/page.tsx` | View/edit a single question |
| `/industry` | `src/app/industry/page.tsx` | 610+ items: company profiles, interview questions, industry topics |
| `/career` | `src/app/career/page.tsx` | Career roadmap with 4 paths, skills self-assessment |
| `/companies` | `src/app/companies/page.tsx` | Company research tracker |
| `/checklist` | `src/app/checklist/page.tsx` | Preparation checklist |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/github/search` | GET | Searches GitHub repos (query param: `q`) |
| `/api/saved-repos` | GET | Fetch user's saved repos from Supabase |
| `/api/saved-repos` | POST | Save a repo to user's list |
| `/api/saved-repos` | DELETE | Remove a saved repo (query param: `repo_id`) |
| `/api/saved-questions` | GET | Fetch user's saved questions |
| `/api/saved-questions` | POST | Save a question |
| `/api/saved-questions` | DELETE | Remove a saved question (query param: `question_id`) |

## Database (Supabase)

### saved_repos
- `id` (UUID), `user_id` (TEXT, from Clerk), `repo_id` (BIGINT), `name`, `full_name`, `description`, `html_url`, `stargazers_count`, `language`, `topics` (TEXT[]), `owner_avatar_url`, `notes`, `saved_at`
- RLS enabled: users can only access their own rows

### saved_questions
- `id` (UUID), `user_id` (TEXT, from Clerk), `question_id`, `title`, `category`, `difficulty`, `status`, `notes`, `saved_at`
- RLS enabled: users can only access their own rows

## Auth Flow
1. Clerk handles sign-up/sign-in/sign-out
2. Middleware protects all routes except sign-in, sign-up, and the GitHub search API
3. API routes use Clerk's `auth()` to get `userId` and `getToken({ template: "supabase" })` for Supabase RLS
4. Clerk JWT `sub` claim maps to `user_id` in Supabase tables

## Environment Variables (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Style Preferences
- Colorful & friendly aesthetic with gradient accents (violet -> pink primary)
- Per-section gradient themes
- Rounded corners, soft shadows, interactive hover states
- Category-specific color coding throughout
