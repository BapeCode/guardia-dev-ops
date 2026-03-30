import {Search} from "lucide-react";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {useAuth, type User} from "@/store/AuthContext.tsx";
import Loading from "@/components/ui/loading.tsx";
import {API_URL} from "@/utils/app.ts";

export default function Suggestion() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { token } = useAuth()

    useEffect(() => {
        const get_users = async () => {
            try {
                const resp = await fetch("/api/users/suggest", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                })

                const data = await resp.json()
                if (resp.ok) {
                    setUsers(data.users)
                }
            } catch (error) {
                console.log("Une erreur est survenue : " + error)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            }
        }

        get_users()
    }, []);

    if (loading) return (
        <Loading/>
    )

    return (
        <section className="flex flex-col items-center justify-start py-6 w-75 gap-4 animate-in slide-in-from-right-5 fade-in duration-500">
            <div className="flex items-center gap-2 bg-card px-6 py-4 rounded-full border border-border w-full">
                <label htmlFor={"search"} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Search className="h-5 w-5"/>
                </label>
                <input id="search" className="focus:outline-none focus:ring-offset-0" placeholder="Rechercher"/>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-sm shadow-xs border border-border w-full mt-6 bg-glass">
                <p className="text-text-1 font-medium font-mono py-5 px-3 text-left w-full border-b border-border">Suggestion</p>

                <div className="flex flex-col items-center gap-4 p-4 w-full">
                    {users.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-1">
                                <Avatar className={"flex items-center justify-center"}>
                                    {item.avatar ? (
                                        <AvatarImage src={`${API_URL}${item.avatar}`} alt={item.name} className="grayscale"/>
                                    ): (
                                        <p className="text-xl text-text-1 font-bold">{item.name.charAt(0)}</p>
                                    )}
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-sm font-normal text-text-1">{item.name}</p>
                                    <p className="text-xs font-normal text-text-1/40">@{item.username}</p>
                                </div>
                            </div>

                            <Button variant={"outline"} className="hover:bg-primary cursor-pointer duration-300 transition-colors">Suivre</Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}