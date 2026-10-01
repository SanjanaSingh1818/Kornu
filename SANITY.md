# Editing the website with Sanity

All texts (Swedish, English, Arabic), images, links, contact details, the menu, the footer and the home page section order are editable in Sanity Studio.
**Packages and prices are not in Sanity.** They still come from Stripe (`api/products.ts`). Only the texts around them (headings, button labels) are in Sanity.

If Sanity is not configured, or a field is left empty, the website shows the original built-in content, so nothing breaks.

## One-time setup

1. **Create the Sanity project**
   ```sh
   cd studio
   npm install
   npx sanity login
   npx sanity init --bare        # creates a project and prints its project ID
   ```
   Copy `studio/.env.example` to `studio/.env` and fill in `SANITY_STUDIO_PROJECT_ID`.

2. **Connect the website.** In the root `.env`:
   ```
   VITE_SANITY_PROJECT_ID=<your project id>
   VITE_SANITY_DATASET=production
   ```
   Add the same two variables in Vercel → Project → Settings → Environment Variables.

3. **Allow the website to read from Sanity.** At sanity.io/manage → your project → API → CORS origins, add
   `http://localhost:5173` and your live domain (e.g. `https://kornu.se`). No credentials needed.

4. **Copy the current content into Sanity.** Create a token at sanity.io/manage → API → Tokens (permission: *Editor*), put it in the root `.env` as `SANITY_WRITE_TOKEN`, then from the project root:
   ```sh
   npm run seed:sanity -- --dry-run   # optional preview → sanity-seed-preview.json
   npm run seed:sanity
   ```
   This uploads the images in `public/images` and creates every document. Running it again **overwrites** the Sanity content with the local content, so only run it once (or when you intentionally want to reset).
   Delete the token from `.env` afterwards if you like; the website never needs it.

5. **Put the Studio online** so editors can log in from anywhere:
   ```sh
   cd studio
   npm run deploy               # hosted at https://<name>.sanity.studio
   ```
   Or run it locally with `npm run dev` (http://localhost:3333).

## Where things are in the Studio

The sidebar mirrors the website: one folder per page, with that page's sections in the order they appear. Each section holds everything it shows: texts, images, button **text and link**, and its list items (photos, reviews, quiz questions, trainers, course cards). Drag list items to reorder.

| Sidebar folder | Sections inside |
|---|---|
| 🏠 Home page | ① Section order (show/hide/reorder), Hero, Benefits bar, Journey, Packages texts, Theory quiz + questions, Simulator, Braking visualizer, Reviews, Final call to action, Visit us, Trainers, Gallery preview |
| 📚 Courses page | Header + course cards, Journey |
| 📦 Packages page | Header + texts (packages and prices themselves stay in Stripe) |
| 🎮 Simulator / 🖼️ Gallery / ℹ️ About page | Header, texts, images, photos |
| ✉️ Contact page | Header + labels, Final call to action, Visit-us headings |
| 💳 Payment result pages | Success and cancelled texts |
| ⚙️ Every page | Header & menu (links, buttons + their links), Footer, Contact form, Site settings (logo, phone, email, address, opening hours, social, Google) |

A section used on several pages (e.g. the green call-to-action box) is listed in each of those folders, but it is the same content: editing it once changes it everywhere.

Button links accept a site page (`/packages`, `/contact`, `/`), a section on the same page (`#paket`), a full address (`https://…`), or `tel:` / `mailto:`.

Every text field has **Svenska / English / العربية**. If a language is left empty, the site shows the Swedish text.

## How updates reach the site

The site reads published content from Sanity's CDN when a visitor opens it, and remembers it in the browser for the next visit. After you click **Publish**, the change shows on the next page load (the CDN can take up to about a minute). No rebuild or redeploy is needed.
