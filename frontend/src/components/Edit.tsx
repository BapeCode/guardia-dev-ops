import Section from "./Section";
import { Save, ArrowLeft, User } from "lucide-react";
import {useAuth} from "@/store/AuthContext.tsx";
import Input from "@/components/Input"

export default function Edit() {
    const { user, update_user } = useAuth()

    const handleBack = () => {
        window.location.hash = "#profil";
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const user_name = formData.get('user_name') || user?.name
        const user_locate = formData.get('user_locate') || user?.location
        const user_bio = formData.get("user_bio") || user?.bio

        try {
            const resp = await fetch("/api/update", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: user_name,
                    locate: user_locate,
                    bio: user_bio,
                    id: user?.id
                })
            })

            const data = await resp.json()
            if (resp.ok) {
                update_user(data.user_update)
                window.location.hash = "#profil";
            }
        } catch (error) {
            console.log("Une erreur de réseau est survenue : " + error)
        }
    };

    return (
        <section className="flex flex-col items-center gap-4 py-6 w-full h-full bg-glass border-x border-border animate-in slide-in-from-right-8 fade-in duration-500">

            <Section className="border-b border-border/40 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-mono font-light tracking-tight text-foreground">
                            Éditer le profil
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Gérez vos informations publiques et vos paramètres de sécurité.
                        </p>
                    </div>
                </div>
            </Section>

            <Section>
                <form onSubmit={handleSave} className="space-y-12">
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-medium tracking-tight">Profile Publique</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-sm border border-border">
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-center h-24 w-24 overflow-hidden rounded-full border-2 border-background shadow-sm">
                                    {user?.avatar ? (
                                        <img src={user?.avatar} alt="Avatar" className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-50" />
                                    ): (
                                        <p className="text-3xl font-bold">{user?.name.charAt(0)}</p>
                                    )}
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-sm font-medium mb-1">Photo de profil</h3>
                                <p className="text-xs text-muted-foreground mb-3 max-w-xs">
                                    Recommandé : image carrée (JPG, PNG) d'au moins 256x256px.
                                </p>
                                <button type="button" className="text-xs border border-border px-3 py-1.5 rounded-full hover:bg-muted transition-colors">
                                    Changer l'image
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            <Input
                                label="Nom complet"
                                placeholder={user?.name || "John Doe"}
                                name={"user_name"}
                                className="border border-border"
                            />
                        </div>

                        <div className="w-full">
                            <Input
                                label="Localisation"
                                placeholder={user?.location || "New York"}
                                name={"user_locate"}
                                className="border border-border"
                            />
                        </div>

                        <div className="w-full">
                            <Input
                                label="Biographie"
                                placeholder={user?.bio || "Biographie..."}
                                name={"user_bio"}
                                className="border border-border"
                            />
                        </div>
                    </div>

                    <div className="border-t border-border/40 flex items-center justify-between gap-4 p-4 w-full">
                        <button type="button" onClick={handleBack} className="px-6 py-2 text-sm font-medium rounded-full hover:bg-destructive/50 duration-300 transition-colors cursor-pointer">
                            Annuler
                        </button>
                        <button type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2 text-sm font-normal rounded-full shadow-md hover:opacity-90 transition-opacity">
                            <Save className="h-4 w-4" />
                            Enregistrer
                        </button>
                    </div>

                </form>
            </Section>
        </section>
    );
}