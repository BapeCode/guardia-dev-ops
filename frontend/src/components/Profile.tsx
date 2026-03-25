import { Button } from "@/components/ui/button";
import {Settings, Pin, Calendar} from "lucide-react";
import {useAuth} from "@/store/AuthContext.tsx";
import {useState} from "react";
import {API_URL} from "@/utils/app.ts";

const TABS = ["Posts", "Réponses", "Reposts", "Likes"];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("Posts");
    const { user } = useAuth()

    const handleEditProfile = () => {
        window.location.hash = "#profile#edit";
    };

    return (
        <section className="flex flex-col items-center justify-start py-6 border-x border-border w-full bg-glass h-full overflow-auto animate-in slide-in-from-bottom-5 fade-in duration-500">
            {user?.banner && (
                <div className="relative w-full h-48 md:h-64 lg:h-72 bg-muted overflow-hidden group mb-6">
                    <img
                        src={`${API_URL}${user.banner}`}
                        alt="Bannière de profil"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20" />
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start px-4 md:px-8 w-full">
                <div className="flex items-center justify-start w-full">
                    <div className="relative flex justify-center items-center h-14 w-14 md:h-20 md:w-20 overflow-hidden rounded-full border-4 border-background bg-background shadow-sm">
                            {user?.avatar ? (
                                <img
                                    src={`${API_URL}${user.avatar}`}
                                    alt={user.name}
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                                />
                            ) : (
                                <p className="text-2xl">{user?.name.charAt(0)}</p>
                            )}
                    </div>
                </div>

                <div className="w-full flex justify-center md:justify-end">
                        <Button onClick={handleEditProfile} variant="outline" size="sm" className="gap-2 rounded-full px-6">
                            <Settings className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-widest font-medium">Éditer le profil</span>
                        </Button>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full border-b border-border pb-4">
                <div className="px-4">
                    <h1 className="text-xl font-sans font-light tracking-tight text-foreground">
                        {user?.name}
                    </h1>
                    <p className="text-text-2/50 font-mono text-sm mt-1 mb-4">
                        @{user?.username}
                    </p>
                    <p className="text-foreground/90 leading-relaxed max-w-lg mb-4 text-sm md:text-base">
                        {user?.bio === "" ? "Aucune bio pour le moment..." : user?.bio}
                    </p>

                    <div className="flex flex-row items-center justify-start gap-4">
                        <div className="flex items-center gap-2">
                            <Pin className="h-3 w-3"/>
                            <p className="text-xs font-light text-text-1/80">{user?.location === "" ? "Aucune localisation" : user?.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3"/>
                            <p className="text-xs font-light text-text-1/80">Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "Date inconnue"}</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-start gap-4 mt-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 cursor-pointer group">
                            <span className="text-lg md:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                {user?.followers}
                            </span>
                            <span className="text-sm text-muted-foreground">suivis</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 cursor-pointer group">
                            <span className="text-lg md:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                {user?.following}
                            </span>
                            <span className="text-sm text-muted-foreground">abonnés</span>
                        </div>
                    </div>
                </div>


            </div>

            <div className="flex w-full border-b border-border mt-5">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative flex-1 py-3.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${activeTab === tab
                            ? "text-primary"
                            : "text-text-3 hover:text-text-1"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-1/2 -translate-1/2 w-10 h-0.75 rounded-full bg-primary"/>
                        )}
                    </button>
                ))}
            </div>

        </section>
    );
}