# Greenlight — Time-off approvals

A small, production-ready web app for one clean **request → review → decision**
flow: employees submit time-off requests, managers review a single queue and
approve or deny with a note. Every decision is timestamped and attributed.

Built with **Next.js (App Router) · Supabase (Postgres + Auth) · Vercel**.

---

## What it does

- **Two roles**, chosen at signup:
  - **Employee (requester)** — submit time-off requests (type, dates, reason),
    track status, and cancel while still pending.
  - **Manager (approver)** — see one prioritized queue of pending requests,
    approve/deny with an optional note, and browse a decision history.
- **Email + password auth** via Supabase, with sessions managed in cookies
  through Next.js middleware (`proxy`).
- **Row-level security** in Postgres so users only ever see what they should:
  requesters see their own requests; approvers see all.

### How the flow maps to the app

| Stage    | Who       | Where                                   |
| -------- | --------- | --------------------------------------- |
| Request  | Employee  | Dashboard → “New request” form          |
| Review   | Manager   | Dashboard → “Needs your review” queue   |
| Decision | Manager   | Approve / Deny + note (logged on card)  |

---

## Tech & structure

```
src/
  app/
    page.tsx                 # marketing / landing (redirects if signed in)
    login/, signup/          # auth pages + client forms
    (app)/
      layout.tsx             # protected shell (header + role)
      dashboard/             # branches into requester vs approver view
  components/                # UI: cards, badges, forms, header
  lib/
    actions/                 # server actions: auth + request mutations
    supabase/                # browser, server, and middleware clients
    get-profile.ts           # current-user profile loader
    types.ts, format.ts      # shared types + date helpers
  proxy.ts                   # session refresh + route protection (Next 16)
supabase/
  schema.sql                 # tables, enums, RLS policies, signup trigger
```

---

## Deploy it (≈ 10 minutes)

You need a free [Supabase](https://supabase.com) account and a free
[Vercel](https://vercel.com) account.

### 1. Create the Supabase project & schema

1. Create a new project at [database.new](https://database.new). Note the
   database password.
2. In the dashboard, open **SQL Editor → New query**, paste the entire contents
   of [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**. This
   creates the tables, enums, RLS policies, and the signup trigger.
3. Open **Authentication → Sign In / Providers → Email** and make sure **Email**
   is enabled.
   - For the smoothest demo, turn **“Confirm email” off** (Authentication →
     Providers → Email). With it on, new users must click a confirmation link
     before they can sign in (the app shows a “check your inbox” message and
     still works once SMTP is configured).
4. Grab your API keys from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Deploy to Vercel

**Option A — Dashboard**

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo (framework auto-detected as
   Next.js).
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy.**

**Option B — CLI**

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

### 3. Point Supabase auth at your domain

In Supabase **Authentication → URL Configuration**, set the **Site URL** to your
Vercel URL (e.g. `https://your-app.vercel.app`).

---

## Run locally

```bash
# 1. install deps
npm install

# 2. configure env
cp .env.example .env.local      # then fill in your Supabase URL + anon key

# 3. start
npm run dev                     # http://localhost:3000
```

> `.env.local` is git-ignored. A placeholder copy is included locally so the
> project builds out of the box; fill in real Supabase keys to actually sign in.

---

## Try the flow

1. Sign up once as a **Manager** (e.g. `manager@acme.com`).
2. Sign up again (incognito window or sign out) as an **Employee**
   (`employee@acme.com`).
3. As the employee, submit a time-off request.
4. As the manager, open the dashboard, review the request, and approve or deny
   it with a note.
5. Back as the employee, watch the status and the manager’s note appear.

---

## Security notes

- All data access is enforced by **Postgres row-level security** — the anon key
  is safe to expose to the browser because policies, not the client, decide what
  each user can read or write.
- Decisions are restricted to approvers both in the server action and in RLS.
- Requesters can only cancel their own *pending* requests.
