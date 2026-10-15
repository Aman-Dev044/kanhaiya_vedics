"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MapPin, XCircle } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { inr } from "@/lib/format";

/** "Do we deliver to you?" — checks against the admin-configured serviceable pincodes. */
export function PincodeCheck() {
  const { delivery, contact } = useSettings();
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; pin: string }>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) return setResult(null);
    const list = delivery.serviceablePincodes;
    setResult({ ok: list.length === 0 || list.includes(pin), pin });
  };

  return (
    <section className="container-x py-10" aria-labelledby="pincode-title">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-7 sm:p-10">
          <div aria-hidden className="absolute -top-20 -right-20 size-72 rounded-full bg-gold-soft blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex items-start gap-5">
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="grid size-14 shrink-0 place-items-center rounded-2xl bg-leaf text-milk shadow-lg"
              >
                <MapPin className="size-6" />
              </motion.span>
              <div>
                <h2 id="pincode-title" className="text-3xl font-semibold">Do we deliver to you?</h2>
                <p className="mt-2 text-muted">
                  Enter your pincode to check. Free delivery on orders above {inr(delivery.freeAbove)}.
                </p>
              </div>
            </div>
            <div>
              <form onSubmit={check} className="flex gap-2">
                <label htmlFor="pin-check" className="sr-only">
                  Pincode
                </label>
                <input
                  id="pin-check"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ""));
                    setResult(null);
                  }}
                  placeholder="6-digit pincode"
                  className="field h-14 rounded-full px-6 text-lg tracking-widest"
                />
                <Button type="submit" size="lg" disabled={pin.length !== 6}>
                  Check
                </Button>
              </form>
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    key={`${result.pin}-${result.ok}`}
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 flex flex-wrap items-center gap-3 rounded-2xl p-4 ${result.ok ? "bg-leaf-soft" : "bg-red-500/10"}`}>
                      {result.ok ? <CheckCircle2 className="size-6 text-leaf" /> : <XCircle className="size-6 text-red-500" />}
                      <p className="flex-1 text-sm text-heading">
                        {result.ok ? (
                          <>
                            <strong>Yes!</strong> We deliver to {result.pin} — morning ({delivery.morningSlot}) & evening slots.
                          </>
                        ) : (
                          <>
                            Not yet in {result.pin}. Call us at <a className="font-semibold underline" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a> — we&apos;re expanding fast.
                          </>
                        )}
                      </p>
                      {result.ok && (
                        <ButtonLink href="/products" size="sm">
                          Order now
                        </ButtonLink>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
