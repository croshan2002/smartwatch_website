# PULSE Watch S — 3D Smartwatch Product Site (Day 3)

Scroll-driven product page for a concept titanium smartwatch with a live, animated watch screen.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). Build with `npm run build`.

## Stack

- **Vite + React 19**
- **React Three Fiber + drei**: case, crown, sensor and all three bands built in code; the screen is a live canvas texture
- **Motion**: blur-in hero, tilt cards with glare, sliding segmented controls (`layoutId`), spring notification pop-ins, time flip
- **GSAP ScrollTrigger + Lenis**: smooth scroll and scroll-driven poses

## Sections

| Section | What happens |
| --- | --- |
| Hero | Watch shows the real time on an analog face and follows the mouse |
| A day on your wrist | Sticky timeline: 06:40 run → 10:00 meeting → 15:20 heart → 23:10 sleep. Screen face changes and a notification pops on the screen and beside it |
| Features | Activity rings fill in, cards tilt under the mouse |
| Studio | Change case finish, band style (Sport / Woven / Link) and colour, and face (Meridian / Mono / Rings) |
| Buy | Size picker and buy button with your chosen config |

## Where to change things

- Finishes, bands, faces: `src/lib/store.js`
- Watch faces (drawn with canvas 2D): `src/three/faces.js`
- Model + poses: `src/three/Watch.jsx`

## SEO, AEO and GEO

All product facts (specs, prices, FAQ) live in `src/content/site.js`. On `npm run build`, `vite.config.js` uses them to generate:

- Title, description, canonical, Open Graph and Twitter tags
- JSON-LD schema: Product (with prices), FAQPage, WebSite, Brand
- A plain-HTML copy of the facts and FAQ inside `#root`, so crawlers and AI bots that don't run JavaScript can read the page
- `robots.txt` (search engines and AI crawlers allowed), `sitemap.xml` and `llms.txt`

The visible FAQ section (`src/components/Faq.jsx`) uses the same data, so the page and the schema always match.

Before deploying, set `SITE_URL` to the live address (in your host's environment settings, or a `.env` file):

```
SITE_URL=https://your-domain.com
```

Without it, the canonical link, `og:url` and `sitemap.xml` are skipped. To get a large preview image when the link is shared, add a 1200×630 `public/og-image.png`.
