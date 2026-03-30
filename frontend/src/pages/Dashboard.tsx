import { useState, useEffect } from "react";
import NavigationDashboard from "@/components/Navigation.tsx";
import Profile from "@/components/Profile.tsx";
import Fill from "@/components/Fill.tsx";
import {useAuth} from "@/store/AuthContext";
import {Navigate} from "react-router-dom";
import Suggestion from "@/components/Suggestion.tsx";
import Edit from "@/components/Edit.tsx";
import Loading from "@/components/ui/loading.tsx";

export default function Dashboard() {
    const [currentHash, setCurrentHash] = useState(window.location.hash || "#fil");
    const { isAuthenticated, loading, token_valid } = useAuth()

    token_valid()

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "#fil");
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    if (loading) return (
        <Loading/>
    )
    if (!isAuthenticated) return <Navigate to={"/login"}/>

    const render = () => {
        switch (currentHash) {
            case '#fil':
                return <Fill/>
            case '#profil':
                return <Profile/>
            case "#profile#edit":
                return <Edit/>
             default:
                 return null
        }
    }

    return (
        <section className="h-screen max-w-7xl mx-auto grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="col-span-1"><NavigationDashboard/></div>
            <div className="col-span-2">{render()}</div>
            <div className="col-span-1"><Suggestion/></div>
        </section>
    )
}