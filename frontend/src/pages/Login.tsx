import Section from "../components/Section.tsx";
import Input from "../components/Input.tsx";

export default function Login() {
    return (
        <Section>
            <div className="flex justify-center items-center gap-6 h-screen">
                <div className="bg-card border-border rounded-xs shadow-sm p-6">
                    <div className="flex flex-col items-start justify-center gap-1">
                        <h1 className="tracking-widest font-light text-text-1 font-serif text-lg">Connexion</h1>
                        <p className="font-extralight text-text-1/40 font-mono text-sm">Entrez vos identifiants pour accéder à votre compte</p>
                    </div>

                    <form className="flex flex-col items-start justify-center mt-8 w-full">
                        <Input label="Adresse mail" placeholder="votre@email.fr" type="email"/>
                    </form>
                </div>
            </div>
        </Section>
    )
}