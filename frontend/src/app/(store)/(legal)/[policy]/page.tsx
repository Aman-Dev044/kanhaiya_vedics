import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/data";
import { getPolicy, POLICY_SLUGS } from "@/lib/policies";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = { params: Promise<{ policy: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICY_SLUGS.map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policy } = await params;
  const p = getPolicy(policy, await getSettings());
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/${policy}` } };
}

export default async function PolicyPage({ params }: Props) {
  const { policy } = await params;
  const p = getPolicy(policy, await getSettings());
  if (!p) notFound();

  return (
    <>
      <PageHeader crumbs={[{ href: `/${policy}`, label: p.title }]} title={p.title} subtitle={p.description} />
      <article className="container-x max-w-3xl space-y-10 py-16">
        {p.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-2xl font-semibold">{s.heading}</h2>
            {s.body.map((b, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted">
                {b}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
