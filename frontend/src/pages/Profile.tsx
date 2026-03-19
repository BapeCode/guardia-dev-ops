import { useState } from "react";
import Section from "@/components/Section.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Settings, Image as ImageIcon, Lock, MapPin, CalendarDays } from "lucide-react";

// --- Données factices ---
const MOCK_USER = {
    fullName: "Léa Dubois",
    username: "@lea.db",
    bio: "Capturer l'éphémère. Café noir et matins calmes. ☕️🌿",
    location: "Lyon, France",
    joinDate: "Mars 2026",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
};

const MOCK_POSTS = [
    { id: 1, imageUrl: "https://picsum.photos/id/10/800/800", caption: "Matin tranquille dans les Alpes.", date: "Il y a 2 heures" },
    { id: 2, imageUrl: "https://picsum.photos/id/11/800/800", caption: "Balade en forêt.", date: "Il y a 3 jours" },
    { id: 3, imageUrl: "https://picsum.photos/id/20/800/800", caption: "Nouveau bureau, nouvelles idées 💻", date: "Il y a 1 semaine" },
    { id: 4, imageUrl: "https://picsum.photos/id/29/800/800", caption: "Lecture du moment.", date: "Il y a 2 semaines" },
    { id: 5, imageUrl: "https://picsum.photos/id/42/800/800", caption: "Pause café obligatoire.", date: "Il y a 1 mois" },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState<"posts" | "memories">("posts");

    return (
        <div className="w-full max-w-5xl mx-auto pb-24 animate-in fade-in duration-700">
            
            {/* ─── EN-TÊTE DU PROFIL (Identité) ─── */}
            <Section className="pt-16 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                    
                    {/* Avatar stylisé */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/50 to-primary/10 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-full border-2 border-background shadow-sm">
                            <img 
                                src={MOCK_USER.avatarUrl} 
                                alt={MOCK_USER.fullName} 
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="flex flex-1 flex-col items-center md:items-start text-center md:text-left pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">
                                    {MOCK_USER.fullName}
                                </h1>
                                <p className="text-muted-foreground font-mono text-sm mt-1">
                                    {MOCK_USER.username}
                                </p>
                            </div>
                            
                            <Button variant="outline" size="sm" className="gap-2 rounded-full px-6">
                                <Settings className="h-4 w-4" /> 
                                <span className="text-xs uppercase tracking-widest font-medium">Éditer</span>
                            </Button>
                        </div>

                        <p className="text-foreground/90 leading-relaxed max-w-lg mb-6 text-sm md:text-base">
                            {MOCK_USER.bio}
                        </p>

                        {/* Méta-données discrètes (Remplace les compteurs de followers) */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {MOCK_USER.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Rejoint en {MOCK_USER.joinDate}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* ─── SÉPARATEUR & ONGLETS ─── */}
            <div className="w-full px-4 md:px-8">
                <div className="flex items-center justify-center md:justify-start gap-8 border-b border-border/40">
                    <button 
                        onClick={() => setActiveTab("posts")}
                        className={cn(
                            "group flex items-center gap-2 pb-4 text-sm font-medium transition-all duration-300 relative",
                            activeTab === "posts" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                        )}
                    >
                        <ImageIcon className={cn("h-4 w-4 transition-transform", activeTab === "posts" && "scale-110 text-primary")} />
                        Publications
                        {/* Barre de soulignement animée */}
                        {activeTab === "posts" && (
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-md animate-in slide-in-from-left-2" />
                        )}
                    </button>

                    <button 
                        onClick={() => setActiveTab("memories")}
                        className={cn(
                            "group flex items-center gap-2 pb-4 text-sm font-medium transition-all duration-300 relative",
                            activeTab === "memories" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                        )}
                    >
                        <Lock className={cn("h-4 w-4 transition-transform", activeTab === "memories" && "scale-110 text-primary")} />
                        Cercle Intime
                        {activeTab === "memories" && (
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-md animate-in slide-in-from-right-2" />
                        )}
                    </button>
                </div>
            </div>

            {/* ─── CONTENU (GRILLE) ─── */}
            <Section className="pt-8">
                {activeTab === "posts" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 px-2 md:px-0">
                        {MOCK_POSTS.map((post) => (
                            <div 
                                key={post.id} 
                                className="group relative aspect-square overflow-hidden bg-muted md:rounded-xl cursor-pointer"
                            >
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.caption} 
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Effet de survol élégant (sans likes) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4 md:p-6">
                                    <p className="text-white text-sm md:text-base font-medium line-clamp-2 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                        {post.caption}
                                    </p>
                                    <p className="text-white/60 font-mono text-xs mt-2 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                                        {post.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Onglet "Cercle Intime" (Souvenirs protégés) */
                    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                            <div className="relative bg-background border border-border/50 rounded-full p-6 shadow-sm">
                                <Lock className="h-8 w-8 text-primary/80" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif tracking-tight mb-2">Un espace juste pour vous</h3>
                        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                            Ce que vous publiez ici n'est visible que par vos <span className="text-foreground font-medium">5 proches de confiance</span>. Pas de regards extérieurs, juste de vrais souvenirs.
                        </p>
                        <Button className="mt-8 rounded-full px-8" variant="outline">
                            Ajouter un souvenir privé
                        </Button>
                    </div>
                )}
            </Section>
        </div>
    );
}