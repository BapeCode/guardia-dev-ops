import { House, Settings, User2, MessageCircle, LogOut} from "lucide-react";
import { useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useAuth} from "@/store/AuthContext.tsx";
import {API_URL} from "@/utils/app.ts";

interface NavigationsItems {
    name: string;
    label: string;
    href: string;
    icon: any;
}

export default function NavigationDashboard() {
    const [active, setActive] = useState<string>("fil")
    const { logout, user } = useAuth()

    const navigationItems: NavigationsItems[] = [
        {
            name: "fill",
            label: "Fil",
            href: "/dashboard#fil",
            icon: House
        },
        {
            name: "messages",
            label: "Messages",
            href: "/dashboard#messages",
            icon: MessageCircle
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
        <header className="flex flex-col items-center justify-start py-6 w-75 h-full animate-in slide-in-from-left-5 fade-in duration-500">
            <h1 className="uppercase font-bold text-2xl tracking-widest">Glint</h1>

            <aside className="flex flex-col justify-between items-center gap-4 mt-16 h-full w-full">
                <nav className="flex flex-col justify-start items-start gap-1 w-full">
                    {navigationItems.map((item) => {
                        const isActive = active === item.name
                        return (
                            <a
                                href={item.href}
                                key={item.name}
                                onClick={() => setActive(item.name)}
                                className={cn(
                                    "flex gap-2 items-center px-4 py-2 transition-all duration-300 w-full",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foregroun hover:text-primary"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <p className="text-md font-medium tracking-wider hidden sm:block">
                                    {item.label}
                                </p>
                            </a>
                        )
                    })}
                </nav>

                <div className="flex items-center justify-between gap-2 w-full">
                    {user?.avatar !== "" ? (
                        <Avatar className="border border-border cursor-pointer h-12 w-12" onClick={logout}>
                            <AvatarImage src={`${API_URL}${user?.avatar}`}/>
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="rounded-full flex items-center justify-center h-10 w-10 border border-border">
                            <p className="font-bold text-lg">{user.name.charAt(0)}</p>
                        </div>
                    )}
                    <div className="flex flex-col items-start gap-0">
                        <p className="text-text-1 font-bold text-sm">{user?.name}</p>
                        <p className="text-text-2/40 font-light text-xs">@{user?.username}</p>
                    </div>

                    <LogOut className="h-5 w-5 hover:text-red-900 cursor-pointer" onClick={logout}/>
                </div>
            </aside>
        </header>
    );
}

