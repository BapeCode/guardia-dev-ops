import { useState, useEffect } from "react";
import NavigationDashboard from "@/components/Navigation.tsx";
import Profile from "@/components/Profile.tsx";
import Fill from "@/components/Fill.tsx";
import {useAuth} from "@/store/AuthContext";
import {Navigate} from "react-router-dom";

export default function Dashboard() {
    const [currentHash, setCurrentHash] = useState(window.location.hash || "#fil");
    const { isAuthenticated, loading } = useAuth()

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "#fil");
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    if (loading) return <div>Chargement...</div>
    if (!isAuthenticated) return <Navigate to={"/login"}/>

    const render = () => {
        switch (currentHash) {
            case '#fil':
                return <Fill/>
            case '#profil':
                return <Profile/>
             default:
                 return <Fill/>
        }
    }

    return (
        <>
            <NavigationDashboard/>
            {render()}
        </>
    )
}