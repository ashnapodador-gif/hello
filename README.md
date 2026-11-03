# JSunrise Marketing Website
Next.js 14 · TypeScript · Tailwind · Supabase (DB, Auth, Storage)

## Setup
1. `npm install`
2. Create a Supabase project → SQL Editor → run `supabase/schema.sql`.
3. Supabase → Authentication → Users → **Add user** (your admin email/password). Disable public sign-ups in Auth settings.
4. `cp .env.example .env.local` and fill in URL + anon key (the anon key is public by design; never use the service-role key here).
5. `npm run dev`, open `/admin`, sign in, then **Settings → upload the original store photo** (the ONE hero photo) and fill in contact info/business text.

## Security
All writes (products, settings, uploads, reading/deleting inquiries) are restricted by Row Level Security to authenticated users. The public can only read content and insert inquiries.

## Deploy
Push to GitHub → import in Vercel → add the two env vars → Deploy.

## Notes
- One-photo rule: the hero photo is the only image. Save the original from the Google Maps listing yourself and upload it unchanged.
- No business facts are invented; every text field is editable in the admin.
