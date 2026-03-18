import {Bookmark, House, Search, Settings, User2} from "lucide-react";
import { useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

interface NavigationsItems {
    name: string;
    label: string;
    href: string;
    icon: any;
}

export default function NavigationDashboard() {
    const [active, setActive] = useState<string>("fil")

    const navigationItems: NavigationsItems[] = [
        {
            name: "fil",
            label: "Fil",
            href: "/dashboard#fil",
            icon: House
        },
        {
            name: "favoris",
            label: "Favoris",
            href: "/dashboard#favoris",
            icon: Bookmark
        },
        {
            name: "profil",
            label: "Profil",
            href: "/dashboard#profil",
            icon: User2
        },
        {
            name: "settings",
            label: "Réglages",
            href: "/dashboard#settings",
            icon: Settings
        }
    ]

    return (
        <header className="flex justify-center items-center w-full bg-card border-b border-border">
            <nav className="flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex-1">
                    <div className="flex items-center gap-3 bg-card border border-border px-2 py-2 rounded-sm w-2/3">
                        <Search className="text-text-1 h-5 w-5"/>
                        <input
                            placeholder="Rechercher"
                            type="text"
                            className="bg-card rounded-xs focus:outline-none text-primary text-sm font-mono"
                        />
                    </div>
                </div>

                <div className="flex justify-center items-center gap-2 flex-1">
                    {navigationItems.map((item) => (
                        <a className={cn(
                            "flex flex-col gap-2 items-center",
                            active == item.name ? "text-primary" : "text-text-1/40",
                            "hover:bg-primary hover:text-white transition-all duration-300 p-3"
                        )} href={item.href} key={item.name} onClick={() => setActive(item.name)}>
                            <item.icon/>
                            <p className="text-sm font-light font-mono">{item.label}</p>
                        </a>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-2 flex-1">
                    <Avatar>
                        <AvatarImage src={"https://github.com/shadcn.png"}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </nav>
        </header>
    )
}