import { useState, useEffect } from "react";
import Section from "@/components/Section";
import NavigationDashboard from "@/components/Navigation";
import Profile from "@/components/Profile";
import Edit from "@/components/Edit"; // Nouvel import pour le formulaire
import Fill from "@/components/Fill.tsx";

export default function Dashboard() {
    const [currentHash, setCurrentHash] = useState(window.location.hash || "#fil");

    // 2. On écoute les changements dans l'URL (quand on clique sur la navigation ou un bouton)
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "#fil");
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    // 3. Fonction pour gérer le rendu conditionnel en fonction du hash
    const renderContent = () => {
        if (currentHash === "#profile#edit") {
            return <Edit />; // Affiche le formulaire d'édition
        } 
        else if (currentHash === "#profil" || currentHash === "#profile") {
            return <Profile />; // Affiche le profil
        } 
        else {
            // Vue par défaut (#fil)
            return (
                <Section className="flex flex-col items-center">
                    <p>Dashboard (Fil d'actualité)</p>
                </Section>
            );
        }
    };

    return (
        <>
            

            {/* Contenu dynamique basé sur l'URL */}
            {renderContent()}
            <NavigationDashboard/>
            {(currentHash == "#fill" || currentHash === "#fills")} && (
                <Fill/>
            )
            {(currentHash === "#profil" || currentHash === "#profile") && (
                <Profile />
            )}
        </>
    );
}