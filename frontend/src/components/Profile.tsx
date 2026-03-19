// src/components/Profile.tsx
import { useState } from "react";
import Section from "@/components/Section.tsx"; // Vérifie que ce chemin est bon
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Settings, Image as ImageIcon, Lock, MapPin, CalendarDays } from "lucide-react";

// --- Données factices pour tester ---
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
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState<"posts" | "memories">("posts");

    return (
        <div className="w-full max-w-5xl mx-auto pb-24 animate-in fade-in duration-500">
            {/* ─── EN-TÊTE DU PROFIL ─── */}
            <Section className="pt-12 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                    {/* Avatar */}
                    <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm">
                        <img src={MOCK_USER.avatarUrl} alt={MOCK_USER.fullName} className="h-full w-full object-cover"/>
                    </div>

                    {/* Infos */}
                    <div className="flex flex-1 flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">{MOCK_USER.fullName}</h1>
                                <p className="text-muted-foreground font-mono text-sm mt-1">{MOCK_USER.username}</p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full px-6">
                                <Settings className="h-4 w-4" /> 
                                <span className="text-xs uppercase tracking-widest font-medium">Éditer</span>
                            </Button>
                        </div>
                        <p className="text-foreground/90 leading-relaxed max-w-lg mb-6 text-sm md:text-base">{MOCK_USER.bio}</p>
                        
                        {/* Métadonnées (pas de followers) */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{MOCK_USER.location}</div>
                            <div className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Rejoint en {MOCK_USER.joinDate}</div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* ─── ONGLETS ─── */}
            <div className="w-full px-4 md:px-8 border-b border-border/40">
                <div className="flex items-center justify-center md:justify-start gap-8">
                    <button onClick={() => setActiveTab("posts")} className={cn("flex items-center gap-2 pb-4 text-sm font-medium transition-all relative", activeTab === "posts" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80")}>
                        <ImageIcon className={cn("h-4 w-4", activeTab === "posts" && "text-primary")} /> Publications
                        {activeTab === "posts" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-md" />}
                    </button>
                    <button onClick={() => setActiveTab("memories")} className={cn("flex items-center gap-2 pb-4 text-sm font-medium transition-all relative", activeTab === "memories" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80")}>
                        <Lock className={cn("h-4 w-4", activeTab === "memories" && "text-primary")} /> Cercle Intime
                        {activeTab === "memories" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-md" />}
                    </button>
                </div>
            </div>

            {/* ─── CONTENU ─── */}
            <Section className="pt-8">
                {activeTab === "posts" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
                        {MOCK_POSTS.map((post) => (
                            <div key={post.id} className="group relative aspect-square overflow-hidden bg-muted md:rounded-xl cursor-pointer">
                                <img src={post.imageUrl} alt={post.caption} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
                                    <p className="text-white text-sm font-medium line-clamp-2">{post.caption}</p>
                                    <p className="text-white/60 font-mono text-xs mt-1">{post.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Lock className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-serif mb-2">Espace Privé</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">Visible uniquement par vos 5 proches.</p>
                    </div>
                )}
            </Section>
        </div>
    );
}