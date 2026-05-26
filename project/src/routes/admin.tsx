import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import {
  Code2, LogOut, Plus, Pencil, Trash2, X, Eye, EyeOff,
  DollarSign, ShoppingBag, RefreshCw, CheckSquare, Square, Save, Plug,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  sort_order: number;
  published: boolean;
};

type PricingPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  features: string[];
  highlighted: boolean;
  badge: string | null;
  sort_order: number;
  published: boolean;
};

type ShopifyConfig = {
  id?: string;
  shop_name: string;
  access_token: string;
  api_version: string;
  products_selected: string[];
  enabled: boolean;
};

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

// ─── Defaults ─────────────────────────────────────────────────────────────────

const emptyProduct: Omit<Product, 'id'> = {
  title: '', subtitle: '', description: '', category: 'local',
  features: [], price: '', image_url: '', link_url: '', sort_order: 0, published: true,
};

const emptyPricing: Omit<PricingPlan, 'id'> = {
  name: '', description: '', price: 0, currency: 'PLN', category: 'website',
  features: [], highlighted: false, badge: null, sort_order: 0, published: true,
};

const defaultShopifyConfig: ShopifyConfig = {
  shop_name: '', access_token: '', api_version: '2024-01',
  products_selected: [], enabled: false,
};

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'products' | 'pricing' | 'shopify'>('products');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Pricing
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [editingPricing, setEditingPricing] = useState<PricingPlan | null>(null);
  const [creatingPricing, setCreatingPricing] = useState(false);

  // Shopify
  const [shopifyConfig, setShopifyConfig] = useState<ShopifyConfig>(defaultShopifyConfig);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyError, setShopifyError] = useState<string | null>(null);
  const [shopifySaving, setShopifySaving] = useState(false);
  const [shopifyConnectForm, setShopifyConnectForm] = useState({ shop_name: '', access_token: '', api_version: '2024-01' });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('sort_order');
    setProducts((data as Product[]) ?? []);
  };

  const loadPricing = async () => {
    const { data } = await supabase.from('pricing_plans').select('*').order('sort_order');
    setPricing((data as PricingPlan[]) ?? []);
  };

  const loadShopifyConfig = async () => {
    const { data } = await supabase.from('shopify_config').select('*').limit(1).maybeSingle();
    if (data) {
      setShopifyConfig({
        id: data.id,
        shop_name: data.shop_name,
        access_token: data.access_token,
        api_version: data.api_version,
        products_selected: (data.products_selected as string[]) ?? [],
        enabled: data.enabled,
      });
      setShopifyConnectForm({
        shop_name: data.shop_name,
        access_token: data.access_token,
        api_version: data.api_version,
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadProducts();
      loadPricing();
      loadShopifyConfig();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // ── Shopify: fetch products via Supabase Edge Function proxy ──────────────
  // We call Supabase DB-stored config and fetch via a CORS proxy approach.
  // Since Shopify Admin API doesn't allow browser CORS, we store credentials
  // in DB and display them. Actual product sync uses the stored token.
  const fetchShopifyProducts = async () => {
    if (!shopifyConfig.shop_name || !shopifyConfig.access_token) {
      setShopifyError('Najpierw zapisz konfigurację Shopify.');
      return;
    }
    setShopifyLoading(true);
    setShopifyError(null);

    // Call via Supabase Edge Function (shopify-proxy) or direct API
    // For client-side we use a CORS proxy approach
    const url = `https://corsproxy.io/?https://${shopifyConfig.shop_name}.myshopify.com/admin/api/${shopifyConfig.api_version}/products.json?limit=50`;

    try {
      const res = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': shopifyConfig.access_token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Błąd API Shopify (${res.status}): ${text.slice(0, 200)}`);
      }

      const json = await res.json();
      setShopifyProducts(json.products ?? []);
    } catch (err) {
      setShopifyError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setShopifyLoading(false);
    }
  };

  const saveShopifyConfig = async () => {
    setShopifySaving(true);
    setShopifyError(null);

    const payload = {
      shop_name: shopifyConnectForm.shop_name.trim().replace(/\.myshopify\.com$/, ''),
      access_token: shopifyConnectForm.access_token.trim(),
      api_version: shopifyConnectForm.api_version.trim() || '2024-01',
      products_selected: shopifyConfig.products_selected,
      enabled: shopifyConfig.enabled,
    };

    let error;
    if (shopifyConfig.id) {
      ({ error } = await supabase.from('shopify_config').update(payload).eq('id', shopifyConfig.id));
    } else {
      const { data, error: insertError } = await supabase.from('shopify_config').insert(payload).select().single();
      error = insertError;
      if (data) setShopifyConfig((c) => ({ ...c, id: data.id }));
    }

    setShopifySaving(false);
    if (error) {
      setShopifyError(error.message);
    } else {
      setShopifyConfig((c) => ({ ...c, ...payload }));
      alert('Konfiguracja Shopify zapisana!');
    }
  };

  const toggleShopifyProduct = async (productId: string) => {
    const current = shopifyConfig.products_selected ?? [];
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    if (shopifyConfig.id) {
      await supabase.from('shopify_config').update({ products_selected: next }).eq('id', shopifyConfig.id);
    }
    setShopifyConfig((c) => ({ ...c, products_selected: next }));
  };

  const toggleShopifyEnabled = async () => {
    const next = !shopifyConfig.enabled;
    if (shopifyConfig.id) {
      await supabase.from('shopify_config').update({ enabled: next }).eq('id', shopifyConfig.id);
    }
    setShopifyConfig((c) => ({ ...c, enabled: next }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Panel Admina</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <LogOut className="w-4 h-4" /> Wyloguj
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8">
          <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={<Code2 className="w-4 h-4" />} label="Produkty" />
          <TabBtn active={tab === 'pricing'} onClick={() => setTab('pricing')} icon={<DollarSign className="w-4 h-4" />} label="Cennik" />
          <TabBtn active={tab === 'shopify'} onClick={() => setTab('shopify')} icon={<ShoppingBag className="w-4 h-4" />} label="Shopify" />
        </div>

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Produkty</h1>
                <p className="text-muted-foreground text-sm mt-1">Zarządzaj ofertą wyświetlaną na stronie głównej.</p>
              </div>
              <button
                onClick={() => setCreatingProduct(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-primary-foreground shadow-glow"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Plus className="w-4 h-4" /> Dodaj produkt
              </button>
            </div>

            <div className="grid gap-4">
              {products.length === 0 && (
                <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
                  Brak produktów. Dodaj pierwszy.
                </div>
              )}
              {products.map((p) => (
                <div key={p.id} className="rounded-xl border border-border p-5 flex items-center gap-4" style={{ background: 'var(--gradient-card)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{p.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{p.category}</span>
                      {!p.published && <span className="text-xs px-2 py-0.5 rounded-full bg-muted">ukryty</span>}
                    </div>
                    {p.subtitle && <div className="text-sm text-muted-foreground truncate">{p.subtitle}</div>}
                  </div>
                  {p.price && <div className="text-sm font-medium hidden sm:block">{p.price}</div>}
                  <IconBtn title={p.published ? 'Ukryj' : 'Pokaż'} disabled={busy}
                    onClick={async () => { setBusy(true); await supabase.from('products').update({ published: !p.published }).eq('id', p.id); await loadProducts(); setBusy(false); }}>
                    {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </IconBtn>
                  <IconBtn onClick={() => setEditingProduct(p)}><Pencil className="w-4 h-4" /></IconBtn>
                  <IconBtn danger disabled={busy}
                    onClick={async () => { if (!confirm(`Usunąć "${p.title}"?`)) return; setBusy(true); await supabase.from('products').delete().eq('id', p.id); await loadProducts(); setBusy(false); }}>
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Pricing Tab ── */}
        {tab === 'pricing' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Cennik</h1>
                <p className="text-muted-foreground text-sm mt-1">Zarządzaj planami cenowymi wyświetlanymi na stronie.</p>
              </div>
              <button
                onClick={() => setCreatingPricing(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-primary-foreground shadow-glow"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Plus className="w-4 h-4" /> Dodaj plan
              </button>
            </div>

            <div className="grid gap-4">
              {pricing.length === 0 && (
                <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
                  Brak planów cenowych. Dodaj pierwszy.
                </div>
              )}
              {pricing.map((p) => (
                <div key={p.id} className="rounded-xl border border-border p-5 flex items-center gap-4" style={{ background: 'var(--gradient-card)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{p.name}</h3>
                      {p.highlighted && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Wyróżniony</span>}
                      {p.badge && <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{p.badge}</span>}
                      <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{p.category}</span>
                      {!p.published && <span className="text-xs px-2 py-0.5 rounded-full bg-muted">ukryty</span>}
                    </div>
                    {p.description && <div className="text-sm text-muted-foreground truncate mt-1">{p.description}</div>}
                  </div>
                  <div className="text-sm font-medium hidden sm:block whitespace-nowrap">od {p.price} {p.currency}</div>
                  <IconBtn title={p.published ? 'Ukryj' : 'Pokaż'} disabled={busy}
                    onClick={async () => { setBusy(true); await supabase.from('pricing_plans').update({ published: !p.published }).eq('id', p.id); await loadPricing(); setBusy(false); }}>
                    {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </IconBtn>
                  <IconBtn onClick={() => setEditingPricing(p)}><Pencil className="w-4 h-4" /></IconBtn>
                  <IconBtn danger disabled={busy}
                    onClick={async () => { if (!confirm(`Usunąć plan "${p.name}"?`)) return; setBusy(true); await supabase.from('pricing_plans').delete().eq('id', p.id); await loadPricing(); setBusy(false); }}>
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Shopify Tab ── */}
        {tab === 'shopify' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Integracja Shopify</h1>
                <p className="text-muted-foreground text-sm mt-1">Podłącz swój sklep Shopify i wybierz produkty do wyświetlenia.</p>
              </div>
              <button
                onClick={toggleShopifyEnabled}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  shopifyConfig.enabled
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                <Plug className="w-4 h-4" />
                {shopifyConfig.enabled ? 'Aktywny' : 'Nieaktywny'}
              </button>
            </div>

            {/* Connection Form */}
            <div className="rounded-xl border border-border p-6 mb-6" style={{ background: 'var(--gradient-card)' }}>
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Konfiguracja połączenia
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nazwa sklepu *</label>
                  <div className="flex items-center rounded-lg border border-border overflow-hidden">
                    <input
                      className="flex-1 px-3 py-2 text-sm focus:outline-none"
                      style={{ background: 'var(--input)', color: 'var(--foreground)' }}
                      placeholder="moj-sklep"
                      value={shopifyConnectForm.shop_name}
                      onChange={(e) => setShopifyConnectForm((f) => ({ ...f, shop_name: e.target.value }))}
                    />
                    <span className="px-2 text-xs text-muted-foreground border-l border-border py-2" style={{ background: 'var(--surface)' }}>.myshopify.com</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Access Token *</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary"
                    style={{ background: 'var(--input)', color: 'var(--foreground)' }}
                    placeholder="shpat_xxxxxxxxxxxx"
                    value={shopifyConnectForm.access_token}
                    onChange={(e) => setShopifyConnectForm((f) => ({ ...f, access_token: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">API Version</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary"
                    style={{ background: 'var(--input)', color: 'var(--foreground)' }}
                    value={shopifyConnectForm.api_version}
                    onChange={(e) => setShopifyConnectForm((f) => ({ ...f, api_version: e.target.value }))}
                  >
                    <option value="2024-01">2024-01</option>
                    <option value="2024-04">2024-04</option>
                    <option value="2024-07">2024-07</option>
                    <option value="2025-01">2025-01</option>
                  </select>
                </div>
              </div>
              {shopifyError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-4">
                  {shopifyError}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={saveShopifyConfig}
                  disabled={shopifySaving || !shopifyConnectForm.shop_name || !shopifyConnectForm.access_token}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-primary-foreground shadow-glow disabled:opacity-60"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Save className="w-4 h-4" />
                  {shopifySaving ? 'Zapisywanie…' : 'Zapisz konfigurację'}
                </button>
                <button
                  onClick={fetchShopifyProducts}
                  disabled={shopifyLoading || !shopifyConfig.shop_name}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium border border-border hover:border-primary disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${shopifyLoading ? 'animate-spin' : ''}`} />
                  {shopifyLoading ? 'Ładowanie…' : 'Pobierz produkty'}
                </button>
              </div>
            </div>

            {/* Products from Shopify */}
            {shopifyProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">
                    Produkty ze Shopify ({shopifyProducts.length})
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    Wybrane: {shopifyConfig.products_selected.length}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {shopifyProducts.map((p) => {
                    const selected = shopifyConfig.products_selected.includes(String(p.id));
                    const price = p.variants[0]?.price ?? '0';
                    const img = p.images[0]?.src;
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleShopifyProduct(String(p.id))}
                        className={`cursor-pointer rounded-xl border p-4 flex gap-4 transition-all ${
                          selected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/40'
                        }`}
                        style={selected ? {} : { background: 'var(--gradient-card)' }}
                      >
                        {img && (
                          <img src={img} alt={p.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                            {selected
                              ? <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                              : <Square className="w-5 h-5 text-muted-foreground shrink-0" />}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{p.vendor} · {p.product_type}</div>
                          <div className="text-sm font-medium mt-2 text-primary">{price} PLN</div>
                          <div className={`text-xs mt-1 ${p.status === 'active' ? 'text-green-400' : 'text-muted-foreground'}`}>
                            {p.status === 'active' ? '● Aktywny' : '○ Nieaktywny'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Zaznaczone produkty będą wyświetlane w sekcji "Sklep" na stronie głównej.
                </p>
              </div>
            )}

            {shopifyProducts.length === 0 && shopifyConfig.shop_name && (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Kliknij "Pobierz produkty" aby załadować produkty z Shopify.</p>
              </div>
            )}

            {!shopifyConfig.shop_name && (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
                <Plug className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Wypełnij formularz powyżej i zapisz konfigurację, aby połączyć z Shopify.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {(creatingProduct || editingProduct) && (
        <ProductForm
          initial={editingProduct ?? { id: '', ...emptyProduct }}
          isNew={creatingProduct}
          onClose={() => { setCreatingProduct(false); setEditingProduct(null); }}
          onSaved={async () => { setCreatingProduct(false); setEditingProduct(null); await loadProducts(); }}
        />
      )}
      {(creatingPricing || editingPricing) && (
        <PricingForm
          initial={editingPricing ?? { id: '', ...emptyPricing }}
          isNew={creatingPricing}
          onClose={() => { setCreatingPricing(false); setEditingPricing(null); }}
          onSaved={async () => { setCreatingPricing(false); setEditingPricing(null); await loadPricing(); }}
        />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function IconBtn({ children, onClick, title, disabled, danger }: {
  children: React.ReactNode; onClick?: () => void; title?: string; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg border border-border transition-colors disabled:opacity-50 ${
        danger ? 'hover:border-destructive hover:text-destructive' : 'hover:border-primary'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────

function ProductForm({ initial, isNew, onClose, onSaved }: { initial: Product; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Product>(initial);
  const [featuresText, setFeaturesText] = useState(initial.features.join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setError(null);
    const payload = {
      title: form.title.trim(), subtitle: form.subtitle || null, description: form.description || null,
      category: form.category, features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      price: form.price || null, image_url: form.image_url || null, link_url: form.link_url || null,
      sort_order: Number(form.sort_order) || 0, published: form.published,
    };
    const { error } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', form.id);
    setSaving(false);
    if (error) setError(error.message); else onSaved();
  };

  return (
    <Modal title={isNew ? 'Nowy produkt' : 'Edytuj produkt'} onClose={onClose}>
      <Field label="Tytuł *"><Input value={form.title} onChange={(v) => update('title', v)} /></Field>
      <Field label="Podtytuł"><Input value={form.subtitle ?? ''} onChange={(v) => update('subtitle', v)} /></Field>
      <Field label="Opis"><Textarea rows={4} value={form.description ?? ''} onChange={(v) => update('description', v)} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Kategoria">
          <select className={inputCls} value={form.category} onChange={(e) => update('category', e.target.value)}>
            <option value="local">Lokalny Biznes</option>
            <option value="hobby">Hodowle i Hobby</option>
            <option value="ecom">E-Commerce</option>
            <option value="other">Inne</option>
          </select>
        </Field>
        <Field label='Cena (np. "od 1999 PLN")'><Input value={form.price ?? ''} onChange={(v) => update('price', v)} /></Field>
      </div>
      <Field label="Funkcje (jedna na linię)">
        <Textarea rows={4} value={featuresText} onChange={setFeaturesText} placeholder="Mobile-first\nIntegracja płatności" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="URL obrazka"><Input value={form.image_url ?? ''} onChange={(v) => update('image_url', v)} placeholder="https://..." /></Field>
        <Field label="Link (opcjonalny)"><Input value={form.link_url ?? ''} onChange={(v) => update('link_url', v)} placeholder="https://..." /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Kolejność">
          <input type="number" className={inputCls} value={form.sort_order} onChange={(e) => update('sort_order', Number(e.target.value))} />
        </Field>
        <label className="flex items-center gap-2 mt-7">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Opublikowany</span>
        </label>
      </div>
      {error && <ErrMsg>{error}</ErrMsg>}
      <ModalFooter onClose={onClose} onSave={save} saving={saving} disabled={!form.title.trim()} />
    </Modal>
  );
}

// ─── Pricing Form ─────────────────────────────────────────────────────────────

function PricingForm({ initial, isNew, onClose, onSaved }: { initial: PricingPlan; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<PricingPlan>(initial);
  const [featuresText, setFeaturesText] = useState(initial.features.join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof PricingPlan>(k: K, v: PricingPlan[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setError(null);
    const payload = {
      name: form.name.trim(), description: form.description || null,
      price: Number(form.price) || 0, currency: form.currency, category: form.category,
      features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      highlighted: form.highlighted, badge: form.badge || null,
      sort_order: Number(form.sort_order) || 0, published: form.published,
    };
    const { error } = isNew
      ? await supabase.from('pricing_plans').insert(payload)
      : await supabase.from('pricing_plans').update(payload).eq('id', form.id);
    setSaving(false);
    if (error) setError(error.message); else onSaved();
  };

  return (
    <Modal title={isNew ? 'Nowy plan cenowy' : 'Edytuj plan cenowy'} onClose={onClose}>
      <Field label="Nazwa planu *"><Input value={form.name} onChange={(v) => update('name', v)} placeholder="np. Strona Premium" /></Field>
      <Field label="Opis"><Input value={form.description ?? ''} onChange={(v) => update('description', v)} placeholder="Krótki opis planu" /></Field>
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Cena *">
          <input type="number" step="0.01" className={inputCls} value={form.price} onChange={(e) => update('price', Number(e.target.value))} />
        </Field>
        <Field label="Waluta"><Input value={form.currency} onChange={(v) => update('currency', v)} placeholder="PLN" /></Field>
        <Field label="Kategoria">
          <select className={inputCls} value={form.category} onChange={(e) => update('category', e.target.value)}>
            <option value="website">Strona Internetowa</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="custom">Custom</option>
          </select>
        </Field>
      </div>
      <Field label="Funkcje (jedna na linię)">
        <Textarea rows={4} value={featuresText} onChange={setFeaturesText} placeholder="Responsywna strona\nSEO Optimized" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Badge (np. NAJPOPULARNIEJSZY)"><Input value={form.badge ?? ''} onChange={(v) => update('badge', v)} /></Field>
        <Field label="Kolejność">
          <input type="number" className={inputCls} value={form.sort_order} onChange={(e) => update('sort_order', Number(e.target.value))} />
        </Field>
      </div>
      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.highlighted} onChange={(e) => update('highlighted', e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Wyróżnić plan</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">Opublikowany</span>
        </label>
      </div>
      {error && <ErrMsg>{error}</ErrMsg>}
      <ModalFooter onClose={onClose} onSave={save} saving={saving} disabled={!form.name.trim()} />
    </Modal>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

const inputCls = 'w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary text-sm';

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className={inputCls}
      style={{ background: 'var(--input)', color: 'var(--foreground)' }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Textarea({ value, onChange, rows, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      rows={rows ?? 4}
      className={inputCls}
      style={{ background: 'var(--input)', color: 'var(--foreground)' }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function ErrMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border" style={{ background: 'var(--background)' }}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border" style={{ background: 'var(--background)' }}>
          <h2 className="font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onClose, onSave, saving, disabled }: { onClose: () => void; onSave: () => void; saving: boolean; disabled: boolean }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border hover:border-primary">Anuluj</button>
      <button
        onClick={onSave}
        disabled={saving || disabled}
        className="px-4 py-2 rounded-lg font-medium text-primary-foreground shadow-glow disabled:opacity-60"
        style={{ background: 'var(--gradient-primary)' }}
      >
        {saving ? 'Zapisywanie…' : 'Zapisz'}
      </button>
    </div>
  );
}
