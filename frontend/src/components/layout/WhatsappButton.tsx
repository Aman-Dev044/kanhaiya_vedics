"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WhatsappIcon } from "@/components/brand/SocialIcons";
import { useSettings } from "@/components/providers/SettingsProvider";

export function WhatsappButton() {
  const { contact, brand } = useSettings();
  const pathname = usePathname();
  if (!contact.whatsapp || pathname.startsWith("/admin")) return null;

  const text = encodeURIComponent(`Hi ${brand.name}! I'd like to know more about your milk and ghee.`);
  return (
    <motion.a
      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)]"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-25" />
      <WhatsappIcon className="relative size-7" />
    </motion.a>
  );
}
