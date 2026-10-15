import { FlaskConicalOff, GlassWater, HeartHandshake, Leaf, ShieldCheck, Sun } from "lucide-react";
import { SectionHeading, Stagger, StaggerItem } from "@/components/ui/Reveal";

const ITEMS = [
  { Icon: Leaf, title: "Desi indigenous breeds", text: "Only milk from native Indian cows — the way it has been for generations." },
  { Icon: FlaskConicalOff, title: "Nothing added", text: "No preservatives, no thickeners, no added colour. Just milk." },
  { Icon: GlassWater, title: "Glass, not plastic", text: "Reusable glass bottles keep the taste clean and the planet happier." },
  { Icon: Sun, title: "Fresh every day", text: "Milked in the morning, delivered the same day. Never stored for long." },
  { Icon: HeartHandshake, title: "Ethical care", text: "Our cows are treated as family — with space to roam, rest and graze." },
  { Icon: ShieldCheck, title: "Hygienic handling", text: "Clean milking, quick chilling and sealed bottles at every step." },
];

export function Promise() {
  return (
    <section className="relative overflow-hidden bg-surface-2/60 py-24 sm:py-32" aria-labelledby="promise-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="The Kanhaiya Promise"
          title={<span id="promise-title">Purity you can taste</span>}
          subtitle="Six simple promises behind every bottle and every jar."
        />
        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="group card h-full p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-leaf/40 hover:shadow-[0_30px_60px_-35px_rgb(var(--shadow)/0.5)]">
                <span className="grid size-14 place-items-center rounded-2xl bg-leaf-soft text-leaf transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-leaf group-hover:text-milk">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
