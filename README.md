# 🌅 JSunrise — Premium Business Website

Complete, modern, responsive website for **JSunrise Marketing Office and J-Sunrise Store** (Pune, Maharashtra, India).

Google Maps: https://www.google.com/maps/place/JSunrise+Marketing+Office+and+J-Sunrise+Store/

## Features

- **Home** — hero banner, branding, featured products & services, intro, contact/location buttons
- **About Us** — background, mission & vision, values, company info
- **Our Products** — catalog with images, search, categories, inquiry buttons, editable prices
- **Our Services** — showcase with descriptions and inquiry form with validation
- **Gallery** — photo gallery with lightbox viewing
- **Contact Us** — validated form, contact info, socials, Google Maps embed, Get Directions, opening hours
- **Custom 404 page**
- **Secure Admin Dashboard** (Supabase Auth): manage products, services, gallery uploads, announcements, site content, business hours, inquiries, contact settings

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (DB + Auth + Storage)

## Setup

1. `npm install`
2. Create a project at https://supabase.com and copy your URL + anon key
3. `cp .env.local.example .env.local` and fill in the two variables
4. In Supabase → SQL Editor, run the entire `supabase/schema.sql`
5. In Supabase → Authentication → Users, add an admin user (email + password)
6. `npm run dev` → http://localhost:3000 · Admin: http://localhost:3000/admin

## Deploy (Vercel)

1. Merge `jsunrise-website` branch into `main`
2. Import the repo at https://vercel.com → New Project
3. Add the two env variables → Deploy
4. Update `metadataBase` in `src/app/layout.tsx` to your live domain

## Notes

- Unverified business details (phone, email, address, hours, products, services, socials) are seeded as editable placeholders — update everything from the Admin Dashboard, no code changes needed.
- Security: Row Level Security on all tables (public read + inquiry insert only; admin writes), middleware-protected admin routes.

© JSunrise Marketing Office and J-Sunrise Store. All rights reserved.
