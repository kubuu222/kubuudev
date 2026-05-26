import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string;
  features: string[];
  price: string | null;
  image_url: string | null;
  link_url: string | null;
};

const categoryLabel: Record<string, string> = {
  local: "Lokalny Biznes",
  hobby: "Hodowle i Hobby",
  ecom: "E-Commerce",
  other: "Inne",
};

export function Portfolio() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setItems((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-medium text-primary mb-3">Produkty</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nasze <span className="text-gradient">Produkty i Realizacje</span>
          </h2>
          <p className="text-muted-foreground">
            Wybierz gotowe rozwiązanie skrojone pod Twoją branżę.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <article
              key={p.id}
              className="group relative rounded-2xl border border-border overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevated animate-fade-up"
              style={{ background: "var(--gradient-card)", animationDelay: `${i * 0.08}s` }}
            >
              {p.image_url ? (
                <div className="h-48 overflow-hidden border-b border-border bg-surface">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
              ) : (
                <div className="h-48 border-b border-border relative overflow-hidden" style={{ background: "var(--gradient-card)" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)", opacity: 0.5 }}>
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {categoryLabel[p.category] ?? p.category}
                </div>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                {p.subtitle && <div className="text-sm text-primary mb-2">{p.subtitle}</div>}
                {p.description && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
                )}
                {p.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  {p.price && <div className="font-display font-bold text-gradient">{p.price}</div>}
                  {p.link_url && (
                    <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Zobacz →
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
