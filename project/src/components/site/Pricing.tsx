import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "One-Page Premium",
    price: "999",
    tagline: "Idealny start dla małej firmy",
    features: [
      "Landing Page",
      "Formularz kontaktowy",
      "Podstawowe SEO",
      "Szybki czas wdrożenia (3-5 dni)",
    ],
    highlighted: false,
  },
  {
    name: "Biznes Pro",
    price: "1899",
    tagline: "Pełna obecność online",
    features: [
      "Do 5 podstron",
      "Integracja z Mapami Google",
      "Zaawansowane SEO",
      "Blog / Aktualności",
    ],
    highlighted: true,
    badge: "Najczęściej Wybierany",
  },
  {
    name: "E-Commerce Light",
    price: "3499",
    tagline: "Sprzedawaj online od dziś",
    features: [
      "Sklep do 50 produktów",
      "Integracja Przelewy24",
      "Konfiguracja dostaw",
      "Panel zarządzania",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.62 0.17 252 / 0.15), transparent 60%)",
        }}
      />
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm font-medium text-primary mb-3">Cennik</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Transparentne ceny, <span className="text-gradient">zero ukrytych kosztów</span>
          </h2>
          <p className="text-muted-foreground">
            Wybierz pakiet dopasowany do skali Twojego biznesu. Każdy projekt wyceniamy indywidualnie.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <article
              key={p.name}
              className={`relative rounded-2xl p-8 border transition-all animate-fade-up ${
                p.highlighted
                  ? "border-primary/60 shadow-glow md:-translate-y-4 md:scale-[1.02]"
                  : "border-border hover:border-primary/40 hover:-translate-y-1"
              }`}
              style={{
                background: p.highlighted
                  ? "linear-gradient(180deg, oklch(0.32 0.04 252), oklch(0.24 0.025 257))"
                  : "var(--gradient-card)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground shadow-glow"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {p.badge}
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{p.tagline}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-sm text-muted-foreground">od</span>
                <span className="text-5xl font-display font-bold text-gradient">{p.price}</span>
                <span className="text-lg text-muted-foreground">PLN</span>
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center px-5 py-3 rounded-lg font-medium transition-all ${
                  p.highlighted
                    ? "text-primary-foreground shadow-glow hover:scale-[1.02]"
                    : "border border-border hover:border-primary hover:text-primary"
                }`}
                style={
                  p.highlighted ? { background: "var(--gradient-primary)" } : undefined
                }
              >
                Wybierz pakiet
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
