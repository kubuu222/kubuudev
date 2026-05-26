import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-hero-glow">
      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Tworzymy z pasją od 2020 roku
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              Nowoczesne Strony Internetowe,{" "}
              <span className="text-gradient">Które Sprzedają</span> Twój Biznes
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Tworzymy unikalne, błyskawicznie szybkie i responsywne witryny skrojone pod Twoją niszę.
              Przestań tracić klientów przez nieaktualną stronę.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-primary-foreground shadow-glow transition-all hover:scale-[1.03] hover:shadow-elevated"
                style={{ background: "var(--gradient-primary)" }}
              >
                Darmowa Wycena
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#specializations"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium border border-border bg-surface/40 hover:bg-surface backdrop-blur-sm transition-colors"
              >
                Zobacz Nasze Realizacje
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              {[
                { v: "150+", l: "Wdrożonych witryn" },
                { v: "98%", l: "Zadowolonych klientów" },
                { v: "<1s", l: "Czas ładowania" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-display font-bold text-gradient">{s.v}</div>
                  <div className="text-muted-foreground text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: abstract mockup */}
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
      {/* glow */}
      <div
        className="absolute -inset-8 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "var(--gradient-primary)", opacity: 0.25 }}
      />

      <div className="relative">
        {/* browser window */}
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-elevated bg-surface-elevated">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-md bg-background/60 flex items-center px-3 text-[10px] text-muted-foreground">
              kubuudev.pl
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-full bg-muted" />
              <div className="flex gap-2">
                <div className="h-2 w-10 rounded-full bg-muted" />
                <div className="h-2 w-10 rounded-full bg-muted" />
                <div className="h-2 w-14 rounded-full" style={{ background: "var(--gradient-primary)" }} />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-4">
              <div className="col-span-3 space-y-3">
                <div className="h-3 w-3/4 rounded-full bg-foreground/70" />
                <div className="h-3 w-2/3 rounded-full bg-foreground/40" />
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-5/6 rounded-full bg-muted" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-24 rounded-lg" style={{ background: "var(--gradient-primary)" }} />
                  <div className="h-8 w-24 rounded-lg border border-border" />
                </div>
              </div>
              <div className="col-span-2 aspect-square rounded-xl relative overflow-hidden" style={{ background: "var(--gradient-card)" }}>
                <div className="absolute inset-3 rounded-lg border border-primary/30" />
                <div className="absolute bottom-3 left-3 right-3 h-8 rounded-md" style={{ background: "var(--gradient-primary)", opacity: 0.6 }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-video rounded-lg border border-border bg-background/50 p-2 space-y-1.5">
                  <div className="h-1.5 w-3/4 rounded-full bg-muted" />
                  <div className="h-1.5 w-1/2 rounded-full bg-muted" />
                  <div className="h-1.5 w-2/3 rounded-full bg-primary/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* floating cards */}
        <div className="absolute -top-6 -right-4 hidden md:block animate-float">
          <div className="rounded-xl border border-border bg-surface-elevated shadow-card p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs font-medium">PageSpeed</div>
              <div className="text-lg font-bold text-gradient">99/100</div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 -left-4 hidden md:block animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="rounded-xl border border-border bg-surface-elevated shadow-card p-3">
            <div className="text-[10px] text-muted-foreground">Konwersja</div>
            <div className="flex items-baseline gap-1">
              <div className="text-lg font-bold">+247%</div>
              <div className="text-[10px] text-primary">↑ vs. stara strona</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
