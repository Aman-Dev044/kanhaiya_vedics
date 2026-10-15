"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/format";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "select" | "textarea";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  full?: boolean;
};

/**
 * Generic enquiry form posting to /api/enquiries. Any fields beyond name/email/phone/subject/message
 * are folded into the message so the admin sees everything in one place.
 */
export function EnquiryForm({
  type,
  fields,
  submitLabel,
  subject,
}: {
  type: "contact" | "subscription";
  fields: Field[];
  submitLabel: string;
  subject?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const core = ["name", "email", "phone", "subject", "message"];
    const extras = fields
      .filter((f) => !core.includes(f.name) && values[f.name])
      .map((f) => `${f.label}: ${values[f.name]}`);
    try {
      const res = await api<{ message: string }>("/api/enquiries", {
        method: "POST",
        body: {
          type,
          name: values.name || "",
          email: values.email || "",
          phone: values.phone || "",
          subject: values.subject || subject || "",
          message: [...extras, values.message].filter(Boolean).join("\n"),
        },
      });
      setDone(res.message);
      setValues({});
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center gap-4 p-10 text-center">
          <CheckCircle2 className="size-14 text-leaf" />
          <p className="font-display text-2xl text-heading">{done}</p>
          <Button variant="outline" onClick={() => setDone(null)}>
            Send another
          </Button>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={onSubmit} className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          {fields.map((f) => {
            const id = `enq-${f.name}`;
            const common = {
              id,
              name: f.name,
              required: f.required,
              value: values[f.name] || "",
              placeholder: f.placeholder,
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
                setValues((v) => ({ ...v, [f.name]: e.target.value })),
              className: "field",
            };
            return (
              <div key={f.name} className={cn((f.full || f.type === "textarea") && "sm:col-span-2")}>
                <label htmlFor={id} className="label">
                  {f.label}
                  {f.required && <span className="text-red-500"> *</span>}
                </label>
                {f.type === "select" ? (
                  <select {...common}>
                    <option value="">Select…</option>
                    {f.options?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea {...common} rows={4} className="field resize-none" />
                ) : (
                  <input {...common} type={f.type || "text"} />
                )}
              </div>
            );
          })}
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
              {submitLabel}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
