# Orbizion website

Static website for https://orbizion.vercel.app/ — one homepage (`index.html`)
plus short SEO pages in `seo/`, `seo-for-clinics/`, `seo-for-schools/`
and `privacy/`. Deployed on Vercel (primary) and Firebase Hosting
(project `orbizion-32680`).

## Fast UI (Nov 2026, v3)

Same design, no animation libraries. Removed: GSAP + ScrollTrigger,
Lenis smooth scroll, Split-Type, Three.js, ScrollReveal/ScrollExpand,
ElasticMesh/LaserFlow, the canvas particle background, the preloader,
and the 4 Firebase SDKs (the tracker that used them is disabled).
External scripts in index.html are now only Tailwind CDN, Lucide icons
and app.js. The showcase shows its final expanded state directly.
app.js only runs nav + mobile menu, hero video, icons and the service
modal. Do not re-add an animation library without testing on a phone.

Service priority (Nov 2026): Website & Software Development is the
premium main service, Mobile App Development is premium too. All other
services are normal. Cybersecurity and AI / Advanced Tech are available
on special request only, not standard services.

## How to edit

- Homepage content: edit `index.html` directly. It is one file, about 1,300 lines.
  Do not edit `assets/js/app.js` — that file is not loaded. The live script is
  the root `app.js` (loaded as `app.js?v=5`).
- SEO pages: each page is a small standalone file in its own folder
  (`seo/index.html`, etc.). Keep title, meta description, H1 and canonical
  unique per page, and update `sitemap.xml` `lastmod` when you change a page.
- Styles: `assets/css/style.css` and `assets/css/reactbits.css`.
  Tailwind is loaded from the CDN in `<head>`. That is a known risk: the CDN
  is not meant for production and can break or slow the site. The proper fix
  is a local Tailwind build step (see "Known risks" below), not another CDN.
- Scripts: most libraries are `defer` loaded from CDNs. The main controller
  is root `app.js`, loaded with `defer`.

## Deploy

Push to `main` on GitHub. Vercel redeploys automatically.
For Firebase: `firebase deploy --only hosting` (needs Firebase CLI login).

## Videos — do not put big files in git

- Hero videos live in `assets/videos/` as MP4, with a poster JPG in
  `assets/images/`. Videos use `preload="metadata"` and a poster, so the
  page paints before the video downloads.
- Never commit a video over 5 MB, and never commit a duplicate copy.
  File names must be lowercase, no spaces: `cinematic-hero.mp4`, not
  `cenimatic video  2 trimed.mp4`.
- To compress a new video, use `scripts/compress-videos.sh` (720p, H.264
  CRF 23, audio removed — both videos are muted autoplay). Tested Nov 2026:
  1080p CRF 22 was 7.2 MB and VP9 WebM 6.5 MB for the hero video, while
  720p CRF 23 was 2.7 MB and looked identical at display size.
- Old git history still contains the deleted 10 MB duplicate. A fresh clone
  will stay large until history is rewritten with a force-push. Do not do
  that without warning everyone who has a local clone.

## Privacy

Silent visitor tracking is DISABLED. `app.js` used to collect IP, location,
clicks and form inputs into Firestore / Realtime Database with no consent.
That code is still in the file but its startup call is commented out.
Do not re-enable it without a consent banner and a privacy notice.
See `privacy/index.html`.

## SEO / GEO / AEO checklist (Nov 2026)

- Title, meta description, OG/Twitter tags: in each page `<head>`.
- Schema: Organization + ProfessionalService + WebSite + BreadcrumbList in
  `index.html`, FAQPage + Speakable in a second JSON-LD block.
- FAQ: visible `#faq` section on the homepage, plus FAQs on SEO pages.
- `llms.txt` at the site root for AI search engines.
- `sitemap.xml` and `robots.txt` at the site root; resubmit the sitemap in
  Google Search Console after every deploy.

## Known risks (not fixed in this zip)

1. Tailwind CDN in production — replace with a local Tailwind build when
   you have time to test the whole site after the change.
2. No custom domain yet — `orbizion.vercel.app` is a subdomain. Buy/connect
   a domain in Vercel and redirect, do not just change the canonical.
3. Firebase API key is in `firebase-config.js` (public by design for web
   apps, but only safe if Firestore / Realtime Database rules are locked
   down). Check the rules in the Firebase console before collecting any
   user data.
4. "Meta Certified" badge on the homepage — verify it is a real, current
   certification before using it in client pitches.
