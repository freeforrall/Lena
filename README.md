# The Shared Space — Vercel starter

A responsive Next.js starter based on the uploaded weekly planner. Includes:
- Dom/Sub view switcher (visual demo only; not authentication)
- Weekly roster based on the document
- Daily routine checklist
- 17 rules from the document, with editable active toggles
- Cycle tracker UI
- Personal tracker placeholder
- Reports, check-ins, rewards, consequences and boundaries sections
- Local browser persistence for demo data
- Supabase SQL starter with row-level security policies
- PWA manifest

## Important status

**This is a deployable starter/demo, not yet a production-ready private multi-user app.**
The current UI stores tasks, rules and cycle entries in the current browser's local storage. That means:
- It does not sync between phones or accounts.
- The Dom/Sub switch is only a UI preview, not access control.
- Do not enter real intimate or menstrual health information in this demo.
- Supabase is not wired into the UI yet; the SQL file is a starting schema, not a complete audited security implementation.

Before using real data, implement Supabase Auth, workspace creation/invitations, server-side role checks, and test every RLS policy. Consider professional security review because cycle and intimate data are sensitive.

## Run locally

1. Install Node.js 20 or newer.
2. Extract this ZIP.
3. In the project folder run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000

## Deploy to Vercel

1. Create a GitHub repository and upload the extracted project.
2. Import the repository at https://vercel.com/new.
3. Deploy. No environment variables are needed for demo mode.
4. For Supabase integration, create a project at https://supabase.com, run `supabase/schema.sql` in the SQL editor, and add the environment variables from `.env.example` in Vercel.

## Next production steps

1. Add Supabase email authentication.
2. Add secure workspace creation and one-time invite codes.
3. Implement server-side workspace role permissions.
4. Connect task/rule/period/check-in CRUD to Supabase.
5. Add a separate `shared_with_workspace` control for each health/personal entry.
6. Add data export and account deletion.
7. Test RLS with two separate accounts before entering any real data.

## Planner content used

The weekly assignments and the 17 rules are transcribed/adapted from `weekly_daddy_roleplay_planner.docx`. Optional photo tasks are described as non-intimate and never mandatory. The app keeps the planner's general routine while making consent, privacy and wellbeing explicit.
