import { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";

export default function Register() {
    const [email, setEmail] = useState('');
    const [Nom, setNom] = useState('');
    const [Pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logique de création de compte à insérer ici
        if (password !== confirmPassword) {
            console.log("Les mots de passe ne correspondent pas");
            return;
        }
        console.log("Tentative d'inscription avec :", email, password);
    };

    return (
        <Section>
            <div className="flex justify-center items-center gap-6 h-screen">
                <div className="bg-card border-border rounded-xs shadow-sm p-6 w-1/3">
                    <div className="flex flex-col items-start justify-center gap-1">
                        <h1 className="tracking-widest font-light text-text-1 font-serif text-lg">Inscription</h1>
                        <p className="font-extralight text-text-1/40 font-mono text-sm">Créez votre compte pour commencer</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center mt-8 w-full gap-4">
                        <Input
                            label="Adresse mail"
                            placeholder="exemple@gmail.com"
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Nom Complet"
                            placeholder="Prénom NOM"
                            type="Nom"
                            value={Nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNom(e.target.value)}
                        />
                        <Input
                            label="Nom d'utilisateur"
                            placeholder="Pseudo123456"
                            type="Pseudo"
                            value={Pseudo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPseudo(e.target.value)}
                        />
                        <Input
                            label="Mot de passe"
                            placeholder="********"
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <Input
                            label="Confirmer le mot de passe"
                            placeholder="********"
                            type="password"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        />

                        <Button type="submit" className="w-full mt-2">
                            <p className="text-text-1 uppercase text-sm font-medium">S'inscrire</p>
                        </Button>
                    </form>

                    {/* Liens de navigation */}
                    <div className="flex flex-col items-center gap-2 mt-6">
                        <p className="font-extralight text-text-1/60 text-sm">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-text-1 font-medium hover:underline">
                                Se connecter
                            </Link>
                        </p>
                        <p className="font-extralight text-text-1/60 text-sm">
                            <Link to="/" className="text-text-1 font-medium hover:underline">
                                Retour à l'accueil
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}