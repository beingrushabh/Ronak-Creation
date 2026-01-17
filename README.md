# Ronak Creation – Lehenga Catalog

This repository contains a full‑stack web application for a lehenga wholesaler catalog. It features a public catalog and an admin panel for managing products, banners and settings. The stack is built with Next.js (App Router) and TypeScript, Tailwind CSS for styling, Zod for validation, React Hook Form for forms, and Supabase for the database and storage.

## Features

* **Public catalog** with hero banners, trending products, new arrivals and a filterable catalog page.
* **Product detail pages** with image zoom, full specification table, colour swatches and an enquiry link.
* **Admin panel** with hardcoded password login (no user registration) that allows:
  * Adding/editing/hiding products
  * Uploading product images to Supabase Storage
  * Managing banners (enable/disable, sort order)
  * Changing how many banners show on the home page
* **API endpoints** for products, banners and admin actions.
* **Database schema** and seed data provided as SQL migrations.
* **Responsive, modern yet ethnic design** using a warm neutral background with maroon and gold accents.

## Getting Started

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note down the **project URL** and **anon key** from the API settings.
3. Obtain a **service role key** (from Settings → API) – this is used on the server for privileged operations (don’t expose it to the client).
4. Create two **storage buckets** in Supabase Storage:
   * `catalog-images` – for product images (public access recommended)
   * `banner-images` – for banner images (public access recommended)
5. Run the SQL migration in `supabase/migrations/0001_create_tables.sql` using Supabase’s SQL editor to create the `products`, `banners` and `settings` tables and indexes.
6. Seed the database either by executing `supabase/seed.sql` in the SQL editor or by running the Node seed script (`npm run seed`) after configuring environment variables (see below).

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the required values:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=someStrongPassword
ADMIN_SESSION_SECRET=someRandomSecret
```

* `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are exposed to the browser and used by the Supabase client.
* `SUPABASE_SERVICE_ROLE_KEY` is **server‑only** and used in API route handlers and admin pages for privileged operations. Never expose this key on the client.
* `ADMIN_PASSWORD` is the hardcoded password for the admin panel.
* `ADMIN_SESSION_SECRET` can be used to sign session cookies if you choose to strengthen authentication. In this demo a simple flag cookie is used.

### 3. Install Dependencies

Ensure you have Node.js installed (v18+ recommended). Then install the dependencies:

```bash
npm install
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 5. Admin Panel

Navigate to `/admin/login` and log in with the password defined in `ADMIN_PASSWORD`. After logging in you can create products, manage banners and change settings.

### 6. Deployment

This project is ready to be deployed to platforms like [Vercel](https://vercel.com). Ensure that all environment variables are set in your deployment environment and that your Supabase tables and storage buckets are created. For best performance enable [Next.js image optimisation](https://nextjs.org/docs/app/api-reference/components/image) in production.

## Database Schema

See `supabase/migrations/0001_create_tables.sql` for the full schema. The key tables are:

* `products` – Stores product details and is indexed on fabric category, work category, price, trending, hidden state and created date.
* `banners` – Stores home page banners with sort order and active flag.
* `settings` – Contains a single row specifying how many banners are active on the home page.

## Notes

* This codebase provides a foundation and reference implementation. You can further customise styles, animations and UX interactions as desired.
* When enabling uploads to Supabase Storage on the client, ensure that bucket policies permit `storage.objects.insert` for anonymous users or generate signed upload URLs on the server.

Enjoy building your lehenga catalog!