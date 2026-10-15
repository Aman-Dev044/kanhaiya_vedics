import type { SiteSettings } from "./types";

type Policy = { title: string; description: string; sections: { heading: string; body: string[] }[] };

// Starter policy text — review with the business owner before going live.
export function getPolicy(slug: string, s: SiteSettings): Policy | null {
  const brand = s.brand.name;
  const contact = `${s.contact.phone} / ${s.contact.email}`;
  const policies: Record<string, Policy> = {
    "shipping-policy": {
      title: "Delivery & Shipping Policy",
      description: `How and when ${brand} delivers fresh milk and ghee to your home.`,
      sections: [
        {
          heading: "Delivery slots",
          body: [
            `We deliver in two slots: morning (${s.delivery.morningSlot}) and evening (${s.delivery.eveningSlot}). Choose your preferred slot at checkout.`,
          ],
        },
        {
          heading: "Delivery charges",
          body: [
            `Delivery is free on orders of ₹${s.delivery.freeAbove} or more. Below that, a delivery charge of ₹${s.delivery.fee} applies.`,
          ],
        },
        {
          heading: "Service areas",
          body: [
            "We currently deliver to selected pincodes. If your area is not serviceable, you will be informed at checkout or by our team.",
          ],
        },
        {
          heading: "Glass bottles",
          body: ["Milk is delivered in reusable glass bottles. Please rinse and return empty bottles to our delivery partner."],
        },
      ],
    },
    "refund-policy": {
      title: "Returns & Refunds Policy",
      description: `Our promise on freshness, and what happens if something is not right with your ${brand} order.`,
      sections: [
        {
          heading: "Perishable products",
          body: [
            "Milk is a perishable product and cannot be returned once delivered. Please check your order at the time of delivery.",
          ],
        },
        {
          heading: "Damaged or spoiled items",
          body: [
            `If a product arrives damaged, leaking or spoiled, contact us within 24 hours of delivery at ${contact} with a photo. We will replace it or refund the amount.`,
          ],
        },
        {
          heading: "Cancellations",
          body: ["You can cancel an order before it is out for delivery by calling or messaging us."],
        },
      ],
    },
    "privacy-policy": {
      title: "Privacy Policy",
      description: `How ${brand} collects, uses and protects your personal information.`,
      sections: [
        {
          heading: "What we collect",
          body: ["Your name, phone number, email address and delivery address when you place an order, create an account or contact us."],
        },
        {
          heading: "How we use it",
          body: [
            "Only to process and deliver your orders, contact you about them, and — if you subscribe — send occasional updates. We never sell your data.",
          ],
        },
        {
          heading: "Your choices",
          body: [`You can ask us to update or delete your information at any time by writing to ${s.contact.email}.`],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description: `The terms that apply when you use the ${brand} website and place orders.`,
      sections: [
        {
          heading: "Orders",
          body: ["All orders are subject to availability and confirmation. Prices may change without prior notice; the price at the time of ordering applies."],
        },
        {
          heading: "Product use",
          body: ["Our farm milk is raw and must be boiled before consumption. Store products as directed on the label."],
        },
        {
          heading: "Contact",
          body: [`For any questions about these terms, contact us at ${contact}.`],
        },
      ],
    },
  };
  return policies[slug] ?? null;
}

export const POLICY_SLUGS = ["shipping-policy", "refund-policy", "privacy-policy", "terms"];
