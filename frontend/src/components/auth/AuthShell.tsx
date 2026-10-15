import Image from "next/image";
import { Logo } from "@/components/brand/Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-x grid min-h-[80vh] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="relative hidden aspect-[4/5] max-h-[44rem] overflow-hidden rounded-[2.5rem] lg:block">
        <Image src="/images/kanhaiya-milk-bottles.jpg" alt="" fill sizes="40rem" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f3d1c]/80 via-[#1f3d1c]/10 to-transparent" />
        <p className="absolute inset-x-10 bottom-10 font-display text-3xl leading-snug text-[#fbf8f1]">
          “Fresh farm milk from desi indigenous cows, sourced with care and brought to your home.”
        </p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <Logo size="md" className="mb-10" />
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
