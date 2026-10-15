export type Category = "milk" | "ghee";

export type Variant = {
  sku: string;
  label: string;
  price: number;
  mrp: number;
  stock: number;
};

export type Faq = { question: string; answer: string };

export type Product = {
  _id?: string;
  name: string;
  slug: string;
  category: Category;
  tagline?: string;
  shortDescription: string;
  description: string;
  images: string[];
  variants: Variant[];
  highlights: string[];
  storage?: string;
  shelfLife?: string;
  usage?: string;
  faqs: Faq[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  seo?: { title?: string; description?: string; keywords?: string[] };
  updatedAt?: string;
};

export type ThemeMode = "light" | "dark" | "system";

export type SiteSettings = {
  brand: { name: string; tagline: string; description: string };
  contact: { phone: string; whatsapp: string; email: string; address: string; hours: string };
  social: { instagram: string; facebook: string; youtube: string; x: string };
  delivery: {
    fee: number;
    freeAbove: number;
    serviceablePincodes: string[];
    morningSlot: string;
    eveningSlot: string;
    codEnabled: boolean;
    upiOnDeliveryEnabled: boolean;
  };
  announcement: { enabled: boolean; text: string };
  hero: { eyebrow: string; title: string; subtitle: string; ctaText: string };
  stats: { value: string; label: string }[];
  testimonials: { name: string; location?: string; quote: string; rating: number }[];
  faqs: Faq[];
  seo: { title: string; description: string; keywords: string[] };
  theme: { defaultMode: ThemeMode };
};

export type Address = {
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  address?: Address;
  createdAt?: string;
};

export type OrderStatus = "placed" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type PaymentMethod = "cod" | "upi_on_delivery";
export type DeliverySlot = "morning" | "evening";

export type OrderItem = {
  product: string;
  name: string;
  slug: string;
  image?: string;
  sku: string;
  variantLabel: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  user?: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  deliverySlot: DeliverySlot;
  notes?: string;
  statusHistory: { status: string; note?: string; at: string }[];
  createdAt: string;
  updatedAt: string;
};

export type Enquiry = {
  _id: string;
  type: "contact" | "subscription" | "newsletter";
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status: "new" | "in_progress" | "closed";
  createdAt: string;
};
