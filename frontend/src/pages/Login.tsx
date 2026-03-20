import Section from "../components/Section.tsx";
import Input from "../components/Input.tsx";
import {Button} from "../components/ui/button.tsx";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "@/store/AuthContext.tsx";

export default function Login() {
    const [message, setMessage] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: FormData) => {
        const email = e.get('user_email')
        const password = e.get('user_password')

        try {
            const resp = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                })
            });

            const data = await resp.json();
            if (resp.ok) {
                setMessage(data.message)
                login(data.user, data.token)
                navigate("/dashboard#fil")
            } else {
                setMessage(data.message || 'Erreur de connexion')
            }
        } catch (error) {
            setMessage('Une erreur réseau est survenu : ' + error)
        }
    }

    return (
        <Section>
            <div className="flex flex-col justify-center items-center gap-6 h-screen">
                <div className="w-1/3">
                    <h2 className="text-text-1 font-serif text-2xl">Glint</h2>
                    <p className="text-text-1/40 font-serif text-sm ">Rejoingnez une communauté où le raffinement rencontre l'authenticité</p>
                </div>

                <div className="bg-card border-border rounded-xs shadow-sm p-6 w-1/3">
                    <div className="flex flex-col items-start justify-center gap-1">
                        <h1 className="tracking-widest font-light text-text-1 font-serif text-lg">Connexion</h1>
                        <p className="font-extralight text-text-1/40 font-mono text-sm">Entrez vos identifiants pour accéder à votre compte</p>
                    </div>

                    <form className="flex flex-col items-start justify-center mt-8 w-full gap-4" action={handleSubmit}>
                        <Input required={true} label="Adresse mail" placeholder="votre@email.fr" type="email" name={"user_email"}/>
                        <Input required={true} label="Mot de passe" placeholder="****" type="password" name={"user_password"}/>

                        <p className={message == "" ? "hidden" : "block text-xs text-red-500"}>{message}</p>

                        <Button size="lg" type="submit" className="w-full">
                            <p className="text-text-1 uppercase text-sm font-medium">Se connecter</p>
                        </Button>
                    </form>
                    <div className="flex justify-center items-center mt-6">
                        <p className="font-extralight text-text-1/60 text-sm">
                            <Link to="/" className="text-text-1 font-medium hover:underline">
                                Retour à l'accueil
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    )
}