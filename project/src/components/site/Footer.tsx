import { Code2, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                KubuuDev<span className="text-gradient">Studio</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium witryny dla małych biznesów, lokalnych usług i niszowych hobbystów.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold mb-4">Nawigacja</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#specializations" className="hover:text-primary">Specjalizacje</a></li>
              <li><a href="#pricing" className="hover:text-primary">Cennik</a></li>
              <li><a href="#process" className="hover:text-primary">Proces</a></li>
              <li><a href="#contact" className="hover:text-primary">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-4">Kontakt</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:kontakt@kubuudev.pl" className="hover:text-foreground">kontakt@kubuudev.pl</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+48123456789" className="hover:text-foreground">+48 123 456 789</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} KubuuDev Studios. Wszelkie prawa zastrzeżone.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Polityka prywatności</a>
            <a href="#" className="hover:text-foreground">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
