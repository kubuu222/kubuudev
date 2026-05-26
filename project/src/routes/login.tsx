import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Code2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">
            KubuuDev<span className="text-gradient">Studios</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border p-8" style={{ background: 'var(--gradient-card)' }}>
          <h1 className="text-2xl font-bold mb-2">
            {mode === 'signin' ? 'Logowanie do panelu' : 'Utwórz konto'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === 'signin'
              ? 'Zaloguj się aby zarządzać produktami.'
              : 'Pierwsze utworzone konto otrzymuje uprawnienia administratora.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:border-primary"
                style={{ background: 'var(--input)', color: 'var(--foreground)' }}
                placeholder="kubuu22@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Hasło</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:border-primary"
                style={{ background: 'var(--input)', color: 'var(--foreground)' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {loading ? 'Proszę czekać…' : mode === 'signin' ? 'Zaloguj się' : 'Zarejestruj'}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4"
          >
            {mode === 'signin' ? 'Nie masz konta? Utwórz nowe' : 'Masz już konto? Zaloguj się'}
          </button>
        </div>

        <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground mt-6">
          ← Powrót do strony
        </Link>
      </div>
    </div>
  );
}
