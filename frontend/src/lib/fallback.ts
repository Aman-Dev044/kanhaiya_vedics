// Static fallback used only when the backend API is unreachable (e.g. during a build without
// network access). Live data always comes from the API and is editable in the admin panel.
import type { Product, SiteSettings } from "./types";

export const fallbackProducts: Product[] = [
  {
    name: "Raw Farm Milk",
    slug: "raw-farm-milk-desi-cow",
    category: "milk",
    tagline: "From Desi Indigenous Cows",
    shortDescription:
      "Fresh, unprocessed farm milk from grass-fed desi indigenous cows — collected at dawn and delivered to your home in glass bottles.",
    description:
      "Our Raw Farm Milk comes from desi indigenous cows raised on open pastures and fed natural fodder. Milked by hand every morning, it is chilled immediately and bottled in reusable glass — never homogenised, never mixed with preservatives. You get milk exactly the way your grandparents remember it: rich, creamy and full of natural goodness.\n\nBecause it is raw and unprocessed, please boil the milk before drinking. A thick layer of malai on top is a sign of real, unadulterated milk.",
    images: ["/images/kanhaiya-raw-farm-milk.jpg", "/images/kanhaiya-milk-label-back.jpg", "/images/kanhaiya-milk-bottles.jpg"],
    variants: [
      { sku: "KV-MILK-500", label: "500 ml", price: 50, mrp: 55, stock: 200 },
      { sku: "KV-MILK-1000", label: "1 Litre", price: 90, mrp: 100, stock: 300 },
    ],
    highlights: [
      "From desi indigenous cows",
      "Fresh · Natural · Farm sourced",
      "No preservatives, no additives",
      "Delivered in reusable glass bottles",
      "Chilled within minutes of milking",
    ],
    storage: "Keep refrigerated (below 5°C). Keep the bottle tightly closed and shake well before use.",
    shelfLife: "Consume within 2 days from the packaging date.",
    usage: "Boil the milk before consumption. Do not consume if the seal is broken or the milk smells or looks abnormal.",
    faqs: [
      {
        question: "Do I need to boil this milk?",
        answer: "Yes. Our milk is raw and unprocessed, so please boil it before drinking.",
      },
      {
        question: "How long does the milk stay fresh?",
        answer: "Refrigerated below 5°C, it stays fresh for up to 2 days from the packaging date.",
      },
      {
        question: "Do you take back the glass bottles?",
        answer: "Yes — hand over the rinsed empty bottles to our delivery partner on your next delivery.",
      },
    ],
    rating: 0,
    reviewCount: 0,
    featured: true,
    isActive: true,
    sortOrder: 1,
    seo: {
      title: "Raw Farm Milk from Desi Indigenous Cows | Fresh Milk Delivery",
      description:
        "Buy fresh raw farm milk from desi indigenous cows online. No preservatives, bottled in glass and delivered from farm to your home every morning.",
      keywords: ["desi cow milk", "raw farm milk", "fresh milk delivery", "glass bottle milk", "indigenous cow milk"],
    },
  },
  {
    name: "Vedic Bilona Ghee",
    slug: "vedic-bilona-desi-cow-ghee",
    category: "ghee",
    tagline: "Hand-churned from Desi Cow Curd",
    shortDescription:
      "Traditional bilona ghee made the Vedic way — curd set from desi cow milk, hand-churned into makkhan and slow-cooked to a golden, granular ghee.",
    description:
      "Vedic Bilona Ghee is prepared using the age-old bilona method. Fresh milk from our desi indigenous cows is boiled and set into curd overnight, then hand-churned with a wooden bilona to separate makkhan. The makkhan is slow-cooked on a low flame until it turns into aromatic, golden, granular ghee.\n\nIt takes nearly 25–30 litres of milk to make a single litre of this ghee. The result is a rich, nutty aroma and a texture that can only come from patience and tradition — perfect for cooking, rotis, sweets and daily nourishment.",
    images: ["/images/kanhaiya-vedic-bilona-ghee.jpg"],
    variants: [
      { sku: "KV-GHEE-250", label: "250 ml", price: 699, mrp: 799, stock: 80 },
      { sku: "KV-GHEE-500", label: "500 ml", price: 1299, mrp: 1499, stock: 60 },
      { sku: "KV-GHEE-1000", label: "1 Litre", price: 2499, mrp: 2899, stock: 40 },
    ],
    highlights: [
      "Traditional bilona (hand-churned) method",
      "Made from desi cow curd, not cream",
      "Rich aroma & natural granular texture",
      "No preservatives, colours or additives",
      "Packed in glass jars",
    ],
    storage: "Store in a cool, dry place away from direct sunlight. Always use a dry spoon. No refrigeration needed.",
    shelfLife: "Best before 9 months from the packaging date.",
    usage: "Use for cooking, tadka, rotis, sweets, or a spoonful with warm milk at bedtime.",
    faqs: [
      {
        question: "What is bilona ghee?",
        answer:
          "Bilona ghee is made by setting milk into curd, hand-churning the curd to get makkhan, and slow-cooking the makkhan into ghee — the traditional Vedic method.",
      },
      {
        question: "Why is the ghee granular?",
        answer: "A grainy (danedar) texture is natural for slow-cooked bilona ghee and a sign of purity.",
      },
      {
        question: "Does it need refrigeration?",
        answer: "No. Store it in a cool, dry place and always use a dry spoon.",
      },
    ],
    rating: 0,
    reviewCount: 0,
    featured: true,
    isActive: true,
    sortOrder: 2,
    seo: {
      title: "Vedic Bilona Desi Cow Ghee | Hand-Churned Pure Ghee Online",
      description:
        "Buy traditional bilona ghee made from desi cow curd. Hand-churned, slow-cooked, no preservatives. Order pure Vedic ghee online from Kanhaiya Vedics.",
      keywords: ["bilona ghee", "desi cow ghee", "vedic ghee", "hand churned ghee", "pure ghee online"],
    },
  },
];

export const defaultSettings: SiteSettings = {
  brand: {
    name: "Kanhaiya Vedics",
    tagline: "From Farm to Homes",
    description:
      "Fresh raw farm milk and traditional Vedic bilona ghee from desi indigenous cows — sourced with care and delivered to your home.",
  },
  contact: {
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "hello@kanhaiyavedics.com",
    address: "Kanhaiya Vedics Farm, Vrindavan, Uttar Pradesh, India",
    hours: "Mon – Sun · 5:30 AM – 8:00 PM",
  },
  social: { instagram: "", facebook: "", youtube: "", x: "" },
  delivery: {
    fee: 40,
    freeAbove: 499,
    serviceablePincodes: [],
    morningSlot: "6:00 AM – 8:30 AM",
    eveningSlot: "5:00 PM – 7:30 PM",
    codEnabled: true,
    upiOnDeliveryEnabled: true,
  },
  announcement: {
    enabled: true,
    text: "Free home delivery on orders above ₹499 · Fresh milk every morning",
  },
  hero: {
    eyebrow: "Pure · Desi · Vedic",
    title: "Milk the way nature intended.",
    subtitle:
      "Raw farm milk and hand-churned bilona ghee from grass-fed desi indigenous cows. No preservatives, no shortcuts — just purity, delivered fresh to your doorstep.",
    ctaText: "Shop Fresh Milk",
  },
  stats: [
    { value: "100%", label: "Desi indigenous cows" },
    { value: "0", label: "Preservatives or additives" },
    { value: "< 12 hrs", label: "Farm to your doorstep" },
    { value: "Daily", label: "Morning doorstep delivery" },
  ],
  testimonials: [],
  faqs: [
    {
      question: "Where does your milk come from?",
      answer:
        "All our milk comes from desi indigenous cows raised on our partner farm. They graze freely and are fed natural fodder — no hormones, no shortcuts.",
    },
    {
      question: "Is the milk raw? Do I need to boil it?",
      answer:
        "Yes, our farm milk is raw and unprocessed, so please boil it before drinking. Keep it refrigerated below 5°C and consume within 2 days of the packaging date.",
    },
    {
      question: "What makes bilona ghee different?",
      answer:
        "Bilona ghee is made the traditional Vedic way: milk is set into curd, hand-churned to separate makkhan, and the makkhan is slow-cooked into ghee. It is richer in aroma and texture than ghee made from cream.",
    },
    {
      question: "When do you deliver?",
      answer: "We deliver in a morning slot and an evening slot. You can choose your preferred slot at checkout.",
    },
    {
      question: "Can I get milk delivered every day?",
      answer:
        "Yes! Request a daily milk subscription from the Subscription page and our team will set up a regular delivery schedule for you.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "You can pay with cash or UPI at the time of delivery.",
    },
  ],
  seo: {
    title: "Kanhaiya Vedics — Raw Farm Milk & Vedic Bilona Ghee from Desi Cows",
    description:
      "Order fresh raw farm milk and traditional bilona desi cow ghee online. Sourced from desi indigenous cows, delivered from farm to your home.",
    keywords: [
      "desi cow milk",
      "raw farm milk",
      "bilona ghee",
      "vedic ghee",
      "desi cow ghee",
      "fresh milk delivery",
      "farm fresh milk",
      "Kanhaiya Vedics",
    ],
  },
  theme: { defaultMode: "system" },
};
