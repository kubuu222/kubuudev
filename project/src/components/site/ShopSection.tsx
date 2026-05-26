import { useEffect, useState } from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type ShopifyProduct = {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  images: { src: string }[];
  variants: { price: string; compare_at_price: string | null }[];
};

type ShopifyConfig = {
  shop_name: string;
  access_token: string;
  api_version: string;
  products_selected: string[];
  enabled: boolean;
};

export function ShopSection() {
  const [config, setConfig] = useState<ShopifyConfig | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('shopify_config').select('*').limit(1).maybeSingle();
      if (!data || !data.enabled || !data.shop_name) { setLoading(false); return; }

      const cfg = data as ShopifyConfig;
      setConfig(cfg);

      if (!cfg.products_selected?.length) { setLoading(false); return; }

      // Fetch products from Shopify via CORS proxy
      const ids = cfg.products_selected.join(',');
      const url = `https://corsproxy.io/?https://${cfg.shop_name}.myshopify.com/admin/api/${cfg.api_version}/products.json?ids=${ids}&limit=50`;

      try {
        const res = await fetch(url, {
          headers: { 'X-Shopify-Access-Token': cfg.access_token },
        });
        if (res.ok) {
          const json = await res.json();
          setProducts(json.products ?? []);
        }
      } catch {
        // silently fail on frontend
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !config?.enabled || products.length === 0) return null;

  return (
    <section id="shop" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{ background: 'radial-gradient(ellipse at center, oklch(0.62 0.17 252 / 0.15), transparent 60%)' }}
      />
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm font-medium text-primary mb-3 flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Sklep Shopify
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nasze <span className="text-gradient">produkty</span>
          </h2>
          <p className="text-muted-foreground">
            Sprawdź nasze produkty dostępne bezpośrednio w sklepie online.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((p, i) => {
            const price = p.variants[0]?.price ?? '0';
            const compareAt = p.variants[0]?.compare_at_price;
            const img = p.images[0]?.src;
            const shopUrl = `https://${config.shop_name}.myshopify.com/products/${p.handle}`;

            return (
              <article
                key={p.id}
                className="rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all animate-fade-up"
                style={{ background: 'var(--gradient-card)', animationDelay: `${i * 0.07}s` }}
              >
                {img ? (
                  <div className="aspect-square overflow-hidden">
                    <img src={img} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                    <ShoppingBag className="w-16 h-16 opacity-20" />
                  </div>
                )}

                <div className="p-5">
                  {p.product_type && (
                    <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">{p.product_type}</span>
                  )}
                  <h3 className="font-semibold text-base mt-2 mb-1 line-clamp-2">{p.title}</h3>
                  {p.vendor && <p className="text-xs text-muted-foreground mb-3">{p.vendor}</p>}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gradient">{price} PLN</span>
                      {compareAt && parseFloat(compareAt) > parseFloat(price) && (
                        <span className="text-sm text-muted-foreground line-through">{compareAt} PLN</span>
                      )}
                    </div>
                    <a
                      href={shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-foreground shadow-glow hover:scale-105 transition-transform"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      Kup <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a
            href={`https://${config.shop_name}.myshopify.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-primary text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Zobacz cały sklep
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
