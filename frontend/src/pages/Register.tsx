import { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section.tsx";
import Input from "../components/Input.tsx";
import { Button } from "@/components/ui/button.tsx"; // Attention : J'utilise le Button de ton composant Home (shadcn/ui a priori)
import { AnimatedGridPattern } from "../components/ui/animated-grid-pattern.tsx";
import ShinyText from "@/components/ShinyText.tsx";
import { cn } from "@/lib/utils.ts";

export default function Register() {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormData) => {
        const email = e.get('email');
        const fullName = e.get('fullName');
        const username = e.get('username');
        const password = e.get('password');
        const confirmPassword = e.get('confirmPassword');

        if (password !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            return; 
        }

        try {
            const resp = await fetch('/api/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    fullName: fullName,
                    username: username,
                    password: password
                })
            });

            const data = await resp.json();
            if (resp.ok) {
                setMessage("Inscription réussie !");
            } else {
                setMessage(data.error || "Erreur lors de l'inscription");
            }
        } catch (error) {
            setMessage("Une erreur réseau est survenue : " + error);
        }
    };

    return (
        <Section>
            {/* Conteneur principal avec la grille animée en fond */}
            <div className="relative flex min-h-[100vh] flex-col md:flex-row justify-center items-center gap-12 p-6">
                
                {/* ─── ARRIÈRE-PLAN ANIMÉ (Même que sur Home) ─── */}
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 w-full absolute z-0 pointer-events-none" // Ajout de pointer-events-none pour ne pas gêner le clic
                    )}
                />

                {/* ─── PARTIE GAUCHE : TEXTE & LOGO ─── */}
                <div className="relative z-10 w-full max-w-md text-center md:text-left flex flex-col items-center md:items-start">
                    <ShinyText
                        text="GLINT"
                        className="text-6xl font-extrabold tracking-tight sm:text-7xl mb-4"
                        speed={2.5}
                        color="#b8860b"
                        shineColor="#ffffff"
                        spread={120}
                        direction="left"
                    />
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                        Rejoins une communauté intime. Sans likes publics, sans scroll infini — juste des connexions authentiques avec tes proches.
                    </p>
                </div>

                {/* ─── PARTIE DROITE : FORMULAIRE D'INSCRIPTION ─── */}
                <div className="relative z-10 bg-card border border-border rounded-xl shadow-lg p-8 w-full max-w-md">
                    <div className="flex flex-col items-start justify-center gap-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Inscription</h1>
                        <p className="text-sm text-muted-foreground">Créez votre compte pour commencer l'expérience.</p>
                    </div>

                    <form action={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Adresse mail"
                            name="email"
                            placeholder="exemple@gmail.com"
                            type="email"
                            required
                        />
                        
                        <Input
                            label="Nom Complet"
                            name="fullName"
                            placeholder="Prénom NOM"
                            type="text" 
                            required
                        />
                        
                        <Input
                            label="Nom d'utilisateur"
                            name="username"
                            placeholder="Pseudo123456"
                            type="text"
                            required
                        />
                        <Input
                            label="Mot de passe"
                            name="password"
                            placeholder="********"
                            type="password"
                            required
                        />
                        <Input
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            placeholder="********"
                            type="password"
                            required
                        />

                        {/* Affichage des erreurs */}
                        {message && (
                            <p className="text-sm font-medium text-red-500 mt-2">
                                {message}
                            </p>
                        )}

                        <Button 
                            type="submit" 
                            size="lg" 
                            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            S'inscrire
                        </Button>
                    </form>

                    {/* Liens de navigation */}
                    <div className="flex flex-col items-center gap-3 mt-8">
                        <p className="text-sm text-muted-foreground">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:underline">
                                Se connecter
                            </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <Link to="/" className="hover:underline">
                                Retour à l'accueil
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </Section>
    );
}