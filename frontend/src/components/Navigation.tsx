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
            name: "fill",
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
        <header className="sticky top-0 z-50 flex justify-center items-center w-full bg-card/95 backdrop-blur border-b border-border shadow-sm">
            <nav className="flex justify-between items-center max-w-7xl mx-auto w-full px-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 bg-muted border border-border px-3 py-2 rounded-md w-2/3">
                        <Search className="text-muted-foreground h-4 w-4"/>
                        <input
                            placeholder="Rechercher"
                            type="text"
                            className="bg-transparent focus:outline-none text-foreground text-sm font-mono w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-center items-center gap-1 flex-1">
                    {navigationItems.map((item) => {
                        const isActive = active === item.name;
                        
                        return (
                            <a 
                                href={item.href} 
                                key={item.name} 
                                onClick={() => setActive(item.name)}
                                className={cn(
                                    "flex flex-col gap-1 items-center px-4 py-2 transition-all duration-300",
                                    isActive 
                                        ? "bg-primary text-primary-foreground shadow-sm scale-105" 
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground" 
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <p className="text-[10px] uppercase font-medium tracking-wider hidden sm:block">
                                    {item.label}
                                </p>
                            </a>
                        )
                    })}
                </div>

                <div className="flex items-center justify-end gap-2 flex-1">
                    <Avatar className="border border-border">
                        <AvatarImage src={"https://github.com/shadcn.png"}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </nav>
        </header>
    );
}