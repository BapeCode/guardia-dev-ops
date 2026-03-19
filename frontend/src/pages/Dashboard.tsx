import { useState, useEffect } from "react";
import Section from "@/components/Section.tsx";
import NavigationDashboard from "@/components/Navigation.tsx";
import Profile from "@/components/Profile.tsx";

export default function Dashboard() {
    // 1. On crée un état pour stocker le bout de l'URL actuel (le hash)
    const [currentHash, setCurrentHash] = useState(window.location.hash || "#fil");

    // 2. On écoute les changements dans l'URL (quand on clique sur la navigation)
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "#fil");
        };
        
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return (
        <>
            {/* Ton header reste intact et toujours visible */}
            <NavigationDashboard/>

            {/* 3. La condition : si l'URL est #profil, on affiche Profile */}
            {(currentHash === "#profil" || currentHash === "#profile") ? (
                <Profile />
            ) : (
                /* Sinon (par défaut ou sur #fil), on affiche EXACTEMENT ton code d'origine */
                <Section className="flex flex-col items-center">
                    <p>Dashboard</p>
                </Section>
            )}
        </>
    )
}