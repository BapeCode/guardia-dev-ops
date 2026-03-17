import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern.tsx";
import Section from "../components/Section.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { ArrowRight, LogIn } from "lucide-react";
import ShinyText from "@/components/ShinyText.tsx";
import Header from "@/components/Header.tsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Header />
      {/* ─── HERO ─── */}
      <Section>
        <div className="relative flex min-h-[90vh] flex-col items-center justify-center text-center">
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 w-full absolute",
            )}
          />
          <ShinyText
            text="GLINT"
            className="relative z-10 text-8xl font-extrabold tracking-tight sm:text-9xl"
            speed={2.5}
            color="#b8860b"
            shineColor="#ffffff"
            spread={120}
            direction="left"
          />

          <p className="relative z-10 mt-6 max-w-xl text-lg text-muted-foreground">
            Un réseau social intime pour toi et tes proches. Sans likes publics,
            sans scroll infini — juste des connexions authentiques.
          </p>

          <div className="relative z-10 mt-8 flex gap-4">
            <Button
              size="lg"
              className="gap-2 px-8 bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary/10"
            >
              S'inscrire
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <LogIn className="h-4 w-4" />
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── CONCEPT ─── */}
      <Section>
        <div className="mx-auto max-w-3xl py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Conçu pour la connexion,{" "}
            <span className="text-muted-foreground">pas l'addiction</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Les réseaux sociaux classiques te poussent à performer — plus de
            likes, plus de followers, plus de temps d'écran. Ici c'est
            l'inverse. Chaque feature est pensée pour rapprocher les gens, pas
            les rendre accros. Pas de classement, pas de compteurs publics. Des
            réactions privées et expressives, des badges que ton groupe débloque
            ensemble, et des souvenirs qui se construisent au fil du temps.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold">0</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Likes publics
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">2min</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Pour poster
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">5</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Proches max
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── AUTH CTA ─── */}
      <Section>
        <div className="flex flex-col items-center py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à essayer ?
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Rejoins la beta ou connecte-toi à ton compte existant.
          </p>
        </div>
      </Section>
    </>
  );
}
