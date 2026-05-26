import { useMemo, useState } from "react";
import { Building2, Sparkles, ShoppingBag, Check } from "lucide-react";

type Category = "all" | "local" | "hobby" | "ecom";

const tabs: { id: Category; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "local", label: "Lokalny Biznes" },
  { id: "hobby", label: "Hodowle i Hobby" },
  { id: "ecom", label: "E-Commerce" },
];

const cards = [
  {
    id: "hobby" as Category,
    title: "Premium Reptile & Hobby Aesthetic",
    subtitle: "Hodowle Egzotyczne",
    description:
      "Mroczne, eleganckie layouty ze złotymi i szmaragdowymi akcentami. Dedykowane katalogi hodowlane dla węży, pająków i gadów.",
    features: ["Katalog rodowodowy", "Karty osobników", "Galeria w wysokiej jakości"],
    icon: Sparkles,
    accent: "from-emerald-400/80 to-amber-400/80",
    mock: <HobbyMock />,
  },
  {
    id: "local" as Category,
    title: "Czysty Minimalizm",
    subtitle: "Lokalne Usługi",
    description:
      "Dla mechaników, salonów piękności i firm budowlanych. Czyste layouty zoptymalizowane pod wysoki współczynnik kliknięć w numer telefonu.",
    features: ["Click-to-call CTA", "Google Maps + opinie", "Lokalne SEO"],
    icon: Building2,
    accent: "from-primary to-primary-glow",
    mock: <LocalMock />,
  },
  {
    id: "ecom" as Category,
    title: "Sklepy Internetowe",
    subtitle: "E-Commerce Light",
    description:
      "Szybki checkout i bezproblemowe doświadczenie mobilne. Projektowane pod konwersję, nie pod portfolio agencji.",
    features: ["Mobile-first checkout", "Integracja płatności", "Karty produktów PRO"],
    icon: ShoppingBag,
    accent: "from-blue-400/80 to-purple-400/80",
    mock: <EcomMock />,
  },
];

export function Specializations() {
  const [active, setActive] = useState<Category>("all");
  const visible = useMemo(
    () => (active === "all" ? cards : cards.filter((c) => c.id === active)),
    [active]
  );

  return (
    <section id="specializations" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-medium text-primary mb-3">Co robimy</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Nasze Specjalizacje</h2>
          <p className="text-muted-foreground">
            Nie projektujemy „dla wszystkich". Skupiamy się na niszach, w których znamy język klienta i jego rynek.
          </p>
        </div>

        {/* filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                active === t.id
                  ? "text-primary-foreground border-transparent shadow-glow"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-primary/50"
              }`}
              style={
                active === t.id
                  ? { background: "var(--gradient-primary)" }
                  : undefined
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((c, i) => {
            const Icon = c.icon;
            return (
              <article
                key={c.id}
                className="group relative rounded-2xl border border-border overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevated animate-fade-up"
                style={{ background: "var(--gradient-card)", animationDelay: `${i * 0.08}s` }}
              >
                <div className="relative h-48 overflow-hidden border-b border-border">{c.mock}</div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface border border-border">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {c.subtitle}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{c.description}</p>
                  <ul className="space-y-2">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HobbyMock() {
  return (
    <div className="absolute inset-0 p-4" style={{ background: "linear-gradient(135deg, #0a1a14, #1a1208)" }}>
      <div className="grid grid-cols-3 gap-2 h-full">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-md border border-amber-400/20 relative overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, oklch(0.4 0.12 145 / 0.5), transparent), linear-gradient(180deg, #0d1f17, #1a1208)",
            }}
          >
            <div className="absolute bottom-1 left-1 right-1">
              <div className="h-1 w-3/4 rounded bg-amber-400/60" />
              <div className="h-1 mt-1 w-1/2 rounded bg-emerald-400/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function LocalMock() {
  return (
    <div className="absolute inset-0 p-4 bg-surface">
      <div className="h-full rounded-md border border-border p-3 flex flex-col gap-2">
        <div className="h-2 w-1/3 rounded-full bg-primary" />
        <div className="h-2 w-2/3 rounded-full bg-muted" />
        <div className="flex-1 grid grid-cols-2 gap-2 mt-2">
          <div className="rounded bg-background border border-border" />
          <div className="rounded border border-border p-2 flex flex-col justify-end gap-1">
            <div className="h-1.5 w-full rounded bg-muted" />
            <div className="h-6 rounded" style={{ background: "var(--gradient-primary)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
function EcomMock() {
  return (
    <div className="absolute inset-0 p-4 bg-surface">
      <div className="grid grid-cols-2 gap-2 h-full">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded border border-border p-2 flex flex-col gap-1.5 bg-background/40">
            <div className="flex-1 rounded bg-gradient-to-br from-primary/20 to-purple-400/10" />
            <div className="h-1.5 w-3/4 rounded bg-muted" />
            <div className="flex justify-between items-center">
              <div className="h-2 w-8 rounded bg-primary" />
              <div className="h-3 w-3 rounded-full border border-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
