// Single source of truth for product facts.
// Used by the React page (FAQ section) and by vite.config.js to build
// the SEO tags, JSON-LD schema, static crawlable HTML, robots.txt, sitemap.xml and llms.txt.
// Change a fact here and every place updates on the next build.

export const SITE = {
  brand: 'PULSE',
  product: 'PULSE Watch S',
  title: 'PULSE Watch S: Titanium Smartwatch with 10-Day Battery & ECG',
  description:
    'PULSE Watch S is a titanium smartwatch with a 10-day battery, 3,000-nit LTPO OLED display, dual-band GPS, ECG and sleep tracking. 41 mm from ₹44,900, 45 mm ₹49,900.',
  summary:
    'PULSE Watch S is a titanium smartwatch with up to 10 days of battery life, a 3,000-nit LTPO OLED display, dual-band (L1 + L5) GPS, 100 m water rating, continuous heart rate, 30-second ECG and sleep-stage tracking. It comes in 41 mm (₹44,900) and 45 mm (₹49,900) sizes.',
  locale: 'en_IN',
  currency: 'INR',
  note: 'Concept product page.',
}

export const SIZES = [
  { id: '41', label: '41 mm', price: 44900 },
  { id: '45', label: '45 mm', price: 49900 },
]

export const SPECS = [
  ['Battery', 'Up to 10 days of normal use; 36 hours with GPS on'],
  ['Display', '3,000-nit LTPO OLED, dims to 1 nit at night'],
  ['GPS', 'Dual-band L1 + L5'],
  ['Water rating', '100 m; swim, surf or dive to 40 m, salt water safe'],
  ['Health', 'Continuous heart rate, 30-second ECG, irregular-rhythm alerts, sleep stages (deep, light, REM)'],
  ['Case', 'Titanium in Natural Titanium, Midnight, Champagne or Deep Cobalt'],
  ['Bands', 'Sport Band, Woven Loop or Link Bracelet'],
  ['Watch faces', 'Meridian (analog), Mono (digital), Rings (activity)'],
  ['Sizes and price', '41 mm ₹44,900; 45 mm ₹49,900'],
]

const inr = (n) => '₹' + n.toLocaleString('en-IN')
const emi = (n) => inr(Math.round(n / 12))

// Answer-first: the first sentence of each answer stands on its own,
// so search snippets and AI assistants can quote it directly.
export const FAQ = [
  {
    q: 'How long does the PULSE Watch S battery last?',
    a: 'Up to 10 days of normal use on a single charge. With GPS tracking on continuously, it lasts about 36 hours.',
  },
  {
    q: 'How much does the PULSE Watch S cost in India?',
    a: `The 41 mm model costs ${inr(SIZES[0].price)} and the 45 mm model costs ${inr(SIZES[1].price)}. No-cost EMI starts from ${emi(SIZES[0].price)} a month, and delivery is free within 2 days.`,
  },
  {
    q: 'Is the PULSE Watch S waterproof?',
    a: 'Yes. It is water rated to 100 m, so you can swim, surf or dive to 40 m with it, including in salt water.',
  },
  {
    q: 'Does the PULSE Watch S have ECG and heart-rate monitoring?',
    a: 'Yes. It measures heart rate continuously, takes an ECG in 30 seconds, and alerts you if your readings look unusual.',
  },
  {
    q: 'Can you read the PULSE Watch S screen in bright sunlight?',
    a: 'Yes. The LTPO OLED display reaches 3,000 nits, so it stays readable at noon, and it dims to 1 nit at night.',
  },
  {
    q: 'How accurate is the GPS on the PULSE Watch S?',
    a: 'It uses dual-band GPS (L1 + L5), which keeps run and ride tracks accurate even between tall buildings, and it locks on in seconds.',
  },
  {
    q: 'Does the PULSE Watch S track sleep?',
    a: 'Yes. It tracks deep, light and REM sleep stages and has a gentle haptic alarm that wakes only you.',
  },
  {
    q: 'What sizes, colours and bands are available?',
    a: 'Two sizes (41 mm and 45 mm), four titanium finishes (Natural Titanium, Midnight, Champagne, Deep Cobalt) and three band styles (Sport Band, Woven Loop, Link Bracelet), each in several colours.',
  },
]
