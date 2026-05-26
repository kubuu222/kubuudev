import { MessageSquare, PenTool, Rocket, LifeBuoy } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessageSquare,
    title: "Darmowa Konsultacja",
    desc: "Analizujemy Twoją konkurencję, niszę i cele biznesowe. Bez zobowiązań.",
  },
  {
    n: "02",
    icon: PenTool,
    title: "Projekt i Budowa",
    desc: "Używamy AI i nowoczesnych frameworków dla maksymalnej szybkości i unikalności.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Optymalizacja i Wdrożenie",
    desc: "Konfigurujemy domenę, hosting i certyfikat SSL. Strona działa od pierwszego dnia.",
  },
  {
    n: "04",
    icon: LifeBuoy,
    title: "Wsparcie Powdrożeniowe",
    desc: "Pierwszy miesiąc darmowej opieki technicznej i drobnych poprawek w pakiecie.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 md:py-32 bg-surface/40 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-sm font-medium text-primary mb-3">Jak działamy</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Prosta droga od pomysłu do publikacji</h2>
          <p className="text-muted-foreground">
            Czterostopniowy proces, który eliminuje stres i niepewność.
          </p>
        </div>

        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="relative rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:-translate-y-1 animate-fade-up"
                style={{ background: "var(--gradient-card)", animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-glow"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-display font-bold text-primary/20">{s.n}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
