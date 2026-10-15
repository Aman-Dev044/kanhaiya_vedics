import { z } from "zod";
import { DELIVERY_SLOTS, ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from "@/models/Order";

const phone = z
  .string()
  .trim()
  .regex(/^(\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");
const pincode = z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode");
const email = z.string().trim().toLowerCase().email("Enter a valid email address");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email,
  phone: phone.optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const addressSchema = z.object({
  line1: z.string().trim().min(3, "Address is required").max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  pincode,
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: phone.optional().or(z.literal("")),
  address: addressSchema.optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        sku: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1, "Your cart is empty")
    .max(20),
  customer: z.object({
    name: z.string().trim().min(2, "Name is required").max(80),
    email,
    phone,
  }),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(PAYMENT_METHODS).default("cod"),
  deliverySlot: z.enum(DELIVERY_SLOTS).default("morning"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  note: z.string().trim().max(300).optional(),
});

const variantSchema = z.object({
  sku: z.string().trim().min(1),
  label: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  mrp: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
});

export const productSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers and dashes"),
  category: z.enum(["milk", "ghee"]),
  tagline: z.string().trim().optional().default(""),
  shortDescription: z.string().trim().min(10),
  description: z.string().trim().min(20),
  images: z.array(z.string().trim().min(1)).default([]),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
  highlights: z.array(z.string().trim().min(1)).default([]),
  storage: z.string().trim().optional().default(""),
  shelfLife: z.string().trim().optional().default(""),
  usage: z.string().trim().optional().default(""),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).default([]),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  seo: z
    .object({
      title: z.string().optional().default(""),
      description: z.string().optional().default(""),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
});

export const enquirySchema = z.object({
  type: z.enum(["contact", "subscription"]).default("contact"),
  name: z.string().trim().min(2, "Name is required").max(80),
  email: email.optional().or(z.literal("")),
  phone: phone,
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({ email });

// Settings: every section optional so the admin can save one panel at a time.
export const settingsSchema = z
  .object({
    brand: z.object({ name: z.string(), tagline: z.string(), description: z.string() }).partial(),
    contact: z
      .object({
        phone: z.string(),
        whatsapp: z.string(),
        email: z.string(),
        address: z.string(),
        hours: z.string(),
      })
      .partial(),
    social: z
      .object({ instagram: z.string(), facebook: z.string(), youtube: z.string(), x: z.string() })
      .partial(),
    delivery: z
      .object({
        fee: z.coerce.number().min(0),
        freeAbove: z.coerce.number().min(0),
        serviceablePincodes: z.array(z.string().regex(/^\d{6}$/, "Pincodes must be 6 digits")),
        morningSlot: z.string(),
        eveningSlot: z.string(),
        codEnabled: z.boolean(),
        upiOnDeliveryEnabled: z.boolean(),
      })
      .partial(),
    announcement: z.object({ enabled: z.boolean(), text: z.string() }).partial(),
    hero: z
      .object({ eyebrow: z.string(), title: z.string(), subtitle: z.string(), ctaText: z.string() })
      .partial(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).max(6),
    testimonials: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          location: z.string().trim().optional().default(""),
          quote: z.string().trim().min(1),
          rating: z.coerce.number().min(1).max(5).default(5),
        }),
      )
      .max(30),
    faqs: z.array(z.object({ question: z.string().trim().min(1), answer: z.string().trim().min(1) })).max(30),
    seo: z.object({ title: z.string(), description: z.string(), keywords: z.array(z.string()) }).partial(),
    theme: z.object({ defaultMode: z.enum(["light", "dark", "system"]) }).partial(),
  })
  .partial();
