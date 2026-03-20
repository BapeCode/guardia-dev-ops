import { useState, useEffect } from "react";
import NavigationDashboard from "@/components/Navigation.tsx";
import Profile from "@/components/Profile.tsx";
import Fill from "@/components/Fill.tsx";

export default function Dashboard() {
    const [currentHash, setCurrentHash] = useState(window.location.hash || "#fil");

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "#fil");
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return (
        <>
            <NavigationDashboard/>
            {(currentHash == "#fill" || currentHash === "#fills")} && (
                <Fill/>
            )
            {(currentHash === "#profil" || currentHash === "#profile") && (
                <Profile />
            )}
        </>
    )
}