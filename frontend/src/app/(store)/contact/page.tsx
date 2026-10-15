import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsappIcon } from "@/components/brand/SocialIcons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about our desi cow milk, bilona ghee, delivery or subscriptions? Call, WhatsApp or write to Kanhaiya Vedics.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { contact } = await getSettings();
  const cards = [
    { Icon: Phone, title: "Call us", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { Icon: WhatsappIcon, title: "WhatsApp", value: "Chat with us", href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}` },
    { Icon: Mail, title: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { Icon: Clock, title: "Hours", value: contact.hours },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/contact", label: "Contact" }]}
        eyebrow="Get in touch"
        title="We'd love to hear from you"
        subtitle="Questions about our milk, ghee, delivery areas or bulk orders? Reach out — a real person from our team will reply."
      />
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {cards.map(({ Icon, title, value, href }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card group flex items-center gap-5 p-5 transition-all hover:-translate-y-0.5 hover:border-leaf/50"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-leaf-soft text-leaf transition-colors group-hover:bg-leaf group-hover:text-milk">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{title}</span>
                  <span className="block font-semibold text-heading">{value}</span>
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.35}>
            <div className="card flex items-start gap-5 p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-leaf-soft text-leaf">
                <MapPin className="size-5" />
              </span>
              <address className="not-italic">
                <span className="block text-sm text-muted">Visit the farm</span>
                <span className="block font-semibold text-heading">{contact.address}</span>
              </address>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <EnquiryForm
            type="contact"
            submitLabel="Send message"
            fields={[
              { name: "name", label: "Your name", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "email", label: "Email", type: "email" },
              { name: "subject", label: "Topic", type: "select", options: ["Product question", "Delivery & areas", "Bulk / wholesale order", "Feedback", "Something else"] },
              { name: "message", label: "Message", type: "textarea", required: true },
            ]}
          />
        </Reveal>
      </div>
    </>
  );
}
