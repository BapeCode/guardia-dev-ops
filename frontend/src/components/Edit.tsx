import { useState } from "react";
import Section from "./Section"; // Chemin relatif correct
import { cn } from "../lib/utils"; // Chemin relatif corrigé (remonte d'un dossier puis va dans lib)
import { Camera, Save, ArrowLeft, User, MapPin, AlignLeft } from "lucide-react";

const INITIAL_DATA = {
    firstName: "Léa", 
    lastName: "Dubois", 
    bio: "Capturer l'éphémère...", 
    location: "Lyon, France",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
};

export default function Edit() {
    const [formData, setFormData] = useState(INITIAL_DATA);

    // Fonction pour revenir au profil
    const handleBack = () => {
        window.location.hash = "#profile";
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sauvegardé :", formData);
        window.location.hash = "#profile"; // Retour après sauvegarde
    };

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
    const labelClass = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block";

    return (
        <div className="w-full max-w-3xl mx-auto pb-24 animate-in slide-in-from-right-8 fade-in duration-500">
            
            {/* ─── EN-TÊTE ─── */}
            <Section className="pt-12 pb-6 border-b border-border/40">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">
                            Éditer le profil
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Gérez vos informations publiques et vos paramètres de sécurité.
                        </p>
                    </div>
                </div>
            </Section>

            {/* ─── FORMULAIRE ─── */}
            <Section className="pt-8 px-4 md:px-0">
                <form onSubmit={handleSave} className="space-y-12">
                    
                    {/* --- PROFIL PUBLIC --- */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-medium tracking-tight">Profil Public</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-muted/50 border border-border/50">
                            <div className="relative group cursor-pointer">
                                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-background shadow-sm">
                                    <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-50" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Camera className="h-6 w-6 text-foreground drop-shadow-md" />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Prénom</label>
                                <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className={inputClass} placeholder="Léa" />
                            </div>
                            <div>
                                <label className={labelClass}>Nom</label>
                                <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className={inputClass} placeholder="Dubois" />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Localisation</span>
                            </label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={inputClass} placeholder="ex: Lyon, France" />
                        </div>

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><AlignLeft className="h-4 w-4 text-muted-foreground" /> Biographie</span>
                            </label>
                            <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className={cn(inputClass, "min-h-[120px] resize-none pt-3")} placeholder="Parlez-nous un peu de vous..." maxLength={160} />
                            <p className="text-xs text-muted-foreground mt-2 text-right">{formData.bio.length} / 160</p>
                        </div>
                    </div>

                    <hr className="border-border/40" />

                    {/* --- ACTIONS DE SAUVEGARDE --- */}
                    <div className="pt-6 border-t border-border/40 flex items-center justify-end gap-4 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-xl shadow-sm border">
                        <button type="button" onClick={handleBack} className="px-6 py-2 text-sm font-medium rounded-full hover:bg-muted transition-colors">
                            Annuler
                        </button>
                        <button type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2 text-sm font-medium rounded-full shadow-md hover:opacity-90 transition-opacity">
                            <Save className="h-4 w-4" />
                            Enregistrer
                        </button>
                    </div>

                </form>
            </Section>
        </div>
    );
}