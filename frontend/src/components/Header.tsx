import { Button } from "@/components/ui/button.tsx";
import { Crown } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1
          className="text-xl font-bold"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          GLINT
        </h1>
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Accueil
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Fonctionnalités
              </a>
            </li>
            <li>
              <a
                className="text-sm font-semibold tracking-wide"
                href="/premium"
              >
                <Button
                  size="sm"
                  className="group relative gap-2 overflow-hidden border border-[#b8860b]/30 bg-gradient-to-r from-[#b8860b] via-[#d4a017] to-[#b8860b] bg-[length:200%_100%] px-5 text-white shadow-[0_0_12px_rgba(184,134,11,0.25)] transition-all duration-500 ease-out hover:bg-[position:100%_0] hover:shadow-[0_0_20px_rgba(184,134,11,0.4)] active:scale-95"
                >
                  <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  Premium
                </Button>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
