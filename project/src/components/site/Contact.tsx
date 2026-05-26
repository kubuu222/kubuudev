import { useState } from "react";
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="animate-fade-up">
            <div className="text-sm font-medium text-primary mb-3">Kontakt</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Uzyskaj <span className="text-gradient">Darmową, Niezobowiązującą</span> Wycenę w 24h
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Odpowiadamy na każdą wiadomość w ciągu jednego dnia roboczego. Bez automatów, bez naciągania na rozmowy sprzedażowe.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:kontakt@kubuudev.pl"
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group"
                style={{ background: "var(--gradient-card)" }}
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)" }}>
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium group-hover:text-primary transition-colors">kontakt@kubuudev.pl</div>
                </div>
              </a>
              <a
                href="tel:+48123456789"
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group"
                style={{ background: "var(--gradient-card)" }}
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)" }}>
                  <Phone className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Telefon</div>
                  <div className="font-medium group-hover:text-primary transition-colors">+48 123 456 789</div>
                </div>
              </a>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl p-6 md:p-8 border border-border shadow-card animate-fade-up"
            style={{ background: "var(--gradient-card)", animationDelay: "0.15s" }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Imię i nazwisko" name="name" placeholder="Jan Kowalski" required />
              <Field label="Email" name="email" type="email" placeholder="jan@firma.pl" required />
              <Field label="Telefon" name="phone" type="tel" placeholder="+48 ___ ___ ___" />
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Typ biznesu</label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Wybierz niszę…</option>
                  <option>Lokalny Biznes / Usługi</option>
                  <option>Hodowle Egzotyczne / Hobby</option>
                  <option>E-Commerce</option>
                  <option>Inne</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Wiadomość</label>
              <textarea
                required
                rows={4}
                placeholder="Opowiedz nam o swoim projekcie…"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-medium text-primary-foreground shadow-glow transition-all hover:scale-[1.01] disabled:opacity-80"
              style={{ background: "var(--gradient-primary)" }}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Wiadomość wysłana – odezwiemy się!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Wyślij Zapytanie
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Klikając „Wyślij" akceptujesz naszą politykę prywatności.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-sm"
      />
    </div>
  );
}
