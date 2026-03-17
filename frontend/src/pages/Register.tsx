import { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";

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
           
            <div className="flex flex-col justify-center items-center gap-6 h-screen">

                <div className="w-1/3">
                    <h2 className="text-text-1 font-serif text-2xl">Glint</h2>
                    <p className="text-text-1/40 font-serif text-sm text-justify">Rejoignez une communauté où le raffinement rencontre l'authenticité</p>
                </div>

                <div className="bg-card border-border rounded-xs shadow-sm p-6 w-1/3">
                    <div className="flex flex-col items-start justify-center gap-1">
                        <h1 className="tracking-widest font-light text-text-1 font-serif text-lg">Inscription</h1>
                        <p className="font-extralight text-text-1/40 font-mono text-sm">Créez votre compte pour commencer</p>
                    </div>

                    <form action={handleSubmit} className="flex flex-col items-start justify-center mt-8 w-full gap-4">
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

                       
                        <p className={message === "" ? "hidden" : "block text-xs text-red-500"}>
                            {message}
                        </p>

                        <Button type="submit" className="w-full mt-2">
                            <p className="text-text-1 uppercase text-sm font-medium">S'inscrire</p>
                        </Button>
                    </form>

                    
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