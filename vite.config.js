import fs from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE, SIZES, SPECS, FAQ } from './src/content/site.js'

// SEO / AEO / GEO build plugin.
// - Head: title, description, canonical, Open Graph, Twitter, JSON-LD (Product, FAQPage, WebSite, Organization)
// - Body: plain-HTML copy of the key facts + FAQ inside #root, so crawlers and AI bots that do not run
//   JavaScript can still read the page. React replaces it as soon as the app mounts.
// - Build output: robots.txt, sitemap.xml, llms.txt
//
// Set SITE_URL (in your host's env settings or a .env file) to the live address, e.g.
//   SITE_URL=https://pulsewatch.in
// Without it, URL-based tags (canonical, og:url, sitemap) are left out rather than pointing at a wrong domain.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inr = (n) => '₹' + n.toLocaleString('en-IN')

function seo(siteUrl) {
  const url = siteUrl ? siteUrl.replace(/\/+$/, '') + '/' : ''
  const hasOg = fs.existsSync('public/og-image.png')
  const ogImage = url && hasOg ? url + 'og-image.png' : ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Brand', '@id': '#brand', name: SITE.brand },
      {
        '@type': 'WebSite',
        '@id': '#website',
        name: SITE.product,
        ...(url && { url }),
        inLanguage: 'en-IN',
      },
      {
        '@type': 'Product',
        '@id': '#product',
        name: SITE.product,
        description: SITE.summary,
        brand: { '@id': '#brand' },
        category: 'Smartwatch',
        material: 'Titanium',
        color: 'Natural Titanium, Midnight, Champagne, Deep Cobalt',
        size: SIZES.map((s) => s.label).join(', '),
        ...(ogImage && { image: ogImage }),
        additionalProperty: SPECS.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: SITE.currency,
          lowPrice: Math.min(...SIZES.map((s) => s.price)),
          highPrice: Math.max(...SIZES.map((s) => s.price)),
          offerCount: SIZES.length,
          ...(url && { url: url + '#buy' }),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': '#faq',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  const head = [
    `<title>${esc(SITE.title)}</title>`,
    `<meta name="description" content="${esc(SITE.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    url && `<link rel="canonical" href="${url}" />`,
    url && `<link rel="sitemap" type="application/xml" href="${url}sitemap.xml" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="${esc(SITE.brand)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${esc(SITE.title)}" />`,
    `<meta property="og:description" content="${esc(SITE.description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    ogImage && `<meta property="og:image" content="${ogImage}" />`,
    ogImage && `<meta property="og:image:alt" content="${esc(SITE.product)} smartwatch" />`,
    `<meta property="product:price:amount" content="${SIZES[0].price}" />`,
    `<meta property="product:price:currency" content="${SITE.currency}" />`,
    `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(SITE.title)}" />`,
    `<meta name="twitter:description" content="${esc(SITE.description)}" />`,
    ogImage && `<meta name="twitter:image" content="${ogImage}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')

  const body = `<div class="prerender">
        <p>${esc(SITE.brand)} · Titanium smartwatch</p>
        <h1>${esc(SITE.product)}: titanium smartwatch with a 10-day battery</h1>
        <p>${esc(SITE.summary)}</p>
        <h2>Specifications</h2>
        <dl>${SPECS.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        <h2>Prices</h2>
        <ul>${SIZES.map((s) => `<li>${esc(s.label)}: ${inr(s.price)}</li>`).join('')}</ul>
        <h2>Frequently asked questions</h2>
        ${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('\n        ')}
        <p>${esc(SITE.note)}</p>
      </div>`

  const robots = [
    '# Search engines and AI assistants are welcome.',
    'User-agent: *',
    'Allow: /',
    '',
    ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot']
      .flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    url ? `Sitemap: ${url}sitemap.xml` : '',
  ].join('\n')

  const sitemap = url
    ? `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>
</urlset>
`
    : null

  const llms = `# ${SITE.product}

> ${SITE.summary}

${SITE.note}

## Key facts

${SPECS.map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Prices (India, INR)

${SIZES.map((s) => `- ${s.label}: ${inr(s.price)}`).join('\n')}
- Free delivery in 2 days; no-cost EMI available.

## FAQ

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}
${url ? `\n## Links\n\n- [Product page](${url})\n- [Buy](${url}#buy)\n- [FAQ](${url}#faq)\n` : ''}`

  return {
    name: 'seo-aeo-geo',
    transformIndexHtml(html) {
      return html.replace('<!--seo-head-->', head).replace('<div id="root"></div>', `<div id="root">\n      ${body}\n    </div>`)
    },
    generateBundle() {
      if (!url) this.warn('SITE_URL is not set: canonical, og:url, og:image and sitemap.xml were skipped.')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llms })
      if (sitemap) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), seo(env.SITE_URL)],
  }
})
