# 🔧 NAPRAWA NETLIFY + NOWE FUNKCJE SHOPIFY

## 🐛 CO BYŁO NIE TAK

Twój projekt używał **TanStack Start** (SSR framework z Cloudflare Workers).  
Netlify **nie obsługuje** tego formatu — stąd błąd.

### Rozwiązanie:
Projekt przebudowany na **Vite + React Router v6** (klasyczne SPA).  
✅ 100% kompatybilne z Netlify (i Vercel, GitHub Pages, itp.)

---

## 🚀 SZYBKI START

### 1. Zainstaluj zależności

```bash
cd kubuu-devstudios-enhanced
npm install
```

### 2. Utwórz plik .env.local

```bash
cp .env.local.example .env.local
# lub utwórz plik .env.local z treścią:
```

```env
VITE_SUPABASE_URL=https://krilrhpuequocwwyoifq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_vwRu5inFaLdMcIv9VrdeRQ_CEvRBvK-
```

### 3. Uruchom bazę danych — nowa migracja Shopify

W Supabase SQL Editor uruchom plik:
```
supabase/migrations/20260526190000_shopify_config.sql
```

### 4. Test lokalny

```bash
npm run dev
# → http://localhost:5173
```

### 5. Build i deploy

```bash
npm run build
# Folder 'dist/' gotowy do deploy
```

---

## 🌐 NETLIFY — KONFIGURACJA

### Zmienne środowiskowe w Netlify

1. Wejdź na: **app.netlify.com** → Twoja strona
2. `Site configuration` → `Environment variables`
3. Dodaj:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://krilrhpuequocwwyoifq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_vwRu5inFaLdMcIv9VrdeRQ_CEvRBvK-` |

### Build Settings w Netlify

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` lub `20` |

### ✅ Routing — _redirects

Plik `public/_redirects` już jest:
```
/* /index.html 200
```

I `netlify.toml` już jest skonfigurowany.  
**Nie musisz nic robić — routing działa automatycznie.**

---

## 🛍️ INTEGRACJA SHOPIFY

### Jak to działa

```
Admin Panel → Tab "Shopify"
  1. Wpisz shop_name (np. "moj-sklep")
  2. Wpisz Access Token (z Shopify Admin)
  3. Wybierz API Version
  4. Kliknij "Zapisz konfigurację"
  5. Kliknij "Pobierz produkty"
  6. Zaznacz produkty do wyświetlenia
  7. Aktywuj integrację przyciskiem "Aktywny"

Strona główna → Sekcja "Sklep"
  → Automatycznie wyświetla wybrane produkty
```

### Jak uzyskać Shopify Access Token

1. Wejdź do Shopify Admin: `https://[twoj-sklep].myshopify.com/admin`
2. `Settings` → `Apps and sales channels`
3. `Develop apps` → `Create an app`
4. Nazwij aplikację (np. "KubuuDev Integration")
5. `Configure Admin API scopes` → zaznacz:
   - `read_products`
   - `read_product_listings`
6. `Install app`
7. Skopiuj **Admin API access token** (zaczyna się od `shpat_`)

### Uwaga o CORS

Shopify Admin API nie pozwala na bezpośrednie wywołania z przeglądarki (CORS).  
Projekt używa `corsproxy.io` jako proxy — to działa na development i production.

**Dla produkcji** (bardziej niezawodne) możesz użyć Supabase Edge Function:
→ Instrukcja w sekcji "Zaawansowane" poniżej.

---

## 📋 STRUKTURA PROJEKTU (nowa)

```
kubuu-devstudios-enhanced/
├── netlify.toml                    ← ✅ FIX: przekierowania Netlify
├── public/
│   └── _redirects                 ← ✅ FIX: SPA routing
├── src/
│   ├── main.tsx                   ← ✅ ZMIANA: React Router zamiast TanStack
│   ├── App.tsx                    ← ✅ NOWY: definicja tras
│   ├── routes/
│   │   ├── index.tsx              ← Strona główna
│   │   ├── login.tsx              ← Logowanie
│   │   └── admin.tsx              ← ✅ SHOPIFY: nowa zakładka
│   ├── components/site/
│   │   └── ShopSection.tsx        ← ✅ NOWY: sekcja produktów Shopify
│   └── integrations/supabase/
│       └── client.ts              ← ✅ FIX: VITE_SUPABASE_ANON_KEY
└── supabase/migrations/
    └── 20260526190000_shopify_config.sql  ← ✅ NOWY: tabela shopify_config
```

---

## 🗄️ BAZA DANYCH — Nowa tabela

### Uruchom w Supabase SQL Editor:

```sql
-- Plik: supabase/migrations/20260526190000_shopify_config.sql
-- (zawarty w projekcie)
```

### Struktura tabeli shopify_config:

| Pole | Typ | Opis |
|------|-----|------|
| `id` | UUID | Klucz główny |
| `shop_name` | TEXT | Nazwa sklepu (bez .myshopify.com) |
| `access_token` | TEXT | Shopify Admin API token |
| `api_version` | TEXT | Wersja API (np. 2024-01) |
| `products_selected` | JSONB | Lista wybranych ID produktów |
| `enabled` | BOOLEAN | Czy sekcja Sklep jest widoczna |
| `created_at` | TIMESTAMPTZ | Data utworzenia |
| `updated_at` | TIMESTAMPTZ | Data edycji |

---

## ✅ CHECKLIST

### Po pobraniu projektu:

- [ ] `npm install` — zainstaluj zależności
- [ ] Utwórz `.env.local` z kluczami Supabase
- [ ] W Supabase SQL Editor uruchom `20260526190000_shopify_config.sql`
- [ ] `npm run dev` — test lokalny
- [ ] Sprawdź `/admin` → zakładka "Shopify"

### Przed deploy na Netlify:

- [ ] W Netlify dodaj zmienne środowiskowe (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Push do GitHub → Netlify automatycznie zbuduje

### Po deploy:

- [ ] Strona otwiera się na Netlify
- [ ] `/login` działa
- [ ] `/admin` działa po zalogowaniu
- [ ] Zakładka "Shopify" jest widoczna

---

## ❓ TROUBLESHOOTING

### "Page not found" na Netlify po odświeżeniu
→ Sprawdź czy plik `public/_redirects` istnieje z treścią `/* /index.html 200`
→ Sprawdź `netlify.toml` — musi być `[[redirects]]`

### "Missing Supabase environment variable"
→ Sprawdź czy w Netlify masz `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`  
→ NIE `SUPABASE_URL` (bez VITE_) — to ważne!

### Admin panel nie działa / "Unauthorized"
→ Zaloguj się na `/login`
→ Sprawdź czy Twój user_id jest w tabeli `user_roles` z rolą `admin`

### Shopify "Błąd API" / CORS error
→ Sprawdź czy access_token jest poprawny (zaczyna się od `shpat_`)
→ Sprawdź czy nazwa sklepu jest bez `.myshopify.com`
→ Sprawdź czy masz scope `read_products` w Shopify App

### Produkty Shopify się nie wyświetlają na stronie
→ Sprawdź czy integracja jest "Aktywna" (przycisk w admin)
→ Sprawdź czy produkty są zaznaczone w admin panelu
→ Sprawdź konsolę przeglądarki (F12)

---

**Powodzenia! 🚀**
