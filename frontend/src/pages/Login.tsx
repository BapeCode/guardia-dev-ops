import Section from "../components/Section.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import {useState} from "react";

export default function Login() {
    const [message, setMessage] = useState("")

    const handleSubmit = (e: SubmitEventHandler<HTMLFormElement>) => {
        e.preventDefault()
        console.log(e.target)
        setMessage("Votre compte n'a pas été trouver, veuillez réessayer")
    }

    return (
        <Section>
            <div className="flex flex-col justify-center items-center gap-6 h-screen">
                <div className="w-1/3">
                    <h2 className="text-text-1 font-serif text-2xl">Glint</h2>
                    <p className="text-text-1/40 font-serif text-sm text-justify">Rejoingnez une communauté où le raffinement rencontre l'authenticité</p>
                </div>

                <div className="bg-card border-border rounded-xs shadow-sm p-6 w-1/3">
                    <div className="flex flex-col items-start justify-center gap-1">
                        <h1 className="tracking-widest font-light text-text-1 font-serif text-lg">Connexion</h1>
                        <p className="font-extralight text-text-1/40 font-mono text-sm">Entrez vos identifiants pour accéder à votre compte</p>
                    </div>

                    <form className="flex flex-col items-start justify-center mt-8 w-full gap-4" action={handleSubmit}>
                        <Input label="Adresse mail" placeholder="votre@email.fr" type="email"/>
                        <Input label="Mot de passe" placeholder="****" type="password"/>

                        <p className={message == "" ? "hidden" : "block text-xs text-red-500"}>{message}</p>

                        <Button type="submit" className="w-full">
                            <p className="text-text-1 uppercase text-sm font-medium">Se connecter</p>
                        </Button>
                    </form>
                </div>
            </div>
        </Section>
    )
}