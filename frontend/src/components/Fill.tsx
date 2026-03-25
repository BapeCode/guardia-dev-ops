import Input from "@/components/Input.tsx";
import {useAuth, type User} from "@/store/AuthContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FileImage, Heart, MessageCircle, Repeat2} from "lucide-react";
import {API_URL} from "@/utils/app.ts";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {useEffect, useState} from "react";

interface Post {
    id: number
    title: string
    content: string
    author_id: number
    created_at: Date
    updated_at: Date
    author: User,
    like_count: number
    repost_count: number
    comment_count: number
    is_liked: boolean
    is_repost: boolean
}


export default function Fill() {
    const { user, token } = useAuth()
    const [post, setPost] = useState<Post[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const getPost = async () => {
            try {
                const resp = await fetch("/api/posts", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                })

                const data = await resp.json()
                if (resp.ok) {
                    setPost(data.post)
                }
            } catch (error) {
                console.log("Une erreur de réseau est survenue : " + error)
            }
        }

        getPost().then()
    }, []);

    const handlePost = async (e: React.ChangeEvent<HTMLFormElement>) => {
        const formData = new FormData(e.target);
        const content = formData.get("post_content")

        if (!content) {
            setError("Une erreur sur la saisie du contenu est survenue")
            return
        }

        try {
            const resp = await fetch("/api/posts/create", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    "content": content
                })
            })

            const data = await resp.json()
            if (resp.ok) {
                if (data.error) {
                    setError(data.error)
                    return
                }
                setPost(data.post)
                console.log(data.post)
            }
        } catch (error) {
            setError("Une erreur est survenue : " + error)
        }
    }

    const handleLike = async (post_id: number)=> {
        try {
            const resp = await fetch(`/api/posts/${post_id}/like`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            const data = await resp.json()
            if (resp.ok) {
                if (data.error) {
                    setError(data.error)
                    return
                }
                setPost(prev => prev.map(p =>
                    p.id === post_id
                        ? {...p, like_count: data.like_count, is_liked: data.is_liked}
                        : p
                ))
            }
        } catch (error) {
            console.log("Une erreur est survneu " + error)
        }
    }

    const handleRepost = async (post_id: number) => {
        try {
            const resp = await fetch(`/api/posts/${post_id}/repost`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/type"
                }
            })

            const data = await resp.json()
            if (resp.ok) {
                if (data.error) {
                    setError(data.error)
                }
                setPost(prev => prev.map(p =>
                    p.id === post_id
                        ? {...p, repost_count: data.repost_count, is_repost: data.is_repost}
                        : p
                ))
            }
        } catch (error) {
            console.log("Une erreur est survenue : " + error)
        }
    }

    const formatedDate = (date: Date) => {
        const newDate = new Date(date)
        return newDate.toLocaleDateString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    return (
        <section className="flex flex-col items-center justify-start py-6 border-x border-border w-full bg-glass min-h-full overflow-auto">

            <div className="flex items-start justify-between gap-4 w-full px-2 border-b border-border py-4">
                <div className="rounded-full flex items-center justify-center h-12 w-12">
                    {user?.avatar ? (
                        <Avatar className="border border-border cursor-pointer w-full h-full">
                            <AvatarImage src={`${API_URL}${user?.avatar}`}/>
                        </Avatar>
                    ): (
                        <p className="font-bold text-xl">{user?.name.charAt(0)}</p>
                    )}
                </div>

                <form onSubmit={handlePost} className="flex flex-col items-end justify-center w-full gap-4">
                    <Input required={true} placeholder={"Quoi de neuf ?"} name="post_content" className="w-full shadow-none pb-6 border-b border-border outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
                    <p className={`text-destructive text-sm font-medium ${error ? 'block' : 'hidden'}`}>{error}</p>
                    <div className="flex items-center justify-between w-full">
                        <FileImage className="h-5 w-5 text-primary hover:text-text-1 transition-all duration-300 cursor-pointer"/>
                        <Button type={"submit"} className="rounded-sm px-6 py-4 text-sm bg-text-1 text-card hover:bg-primary/50 transition-all duration-300 cursor-pointer">
                            Publier
                        </Button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col items-center gap-4 w-full mt-4 px-4">
                {post.length < 1 ? (
                    <p className="">Aucun post n'est disponible actuellement</p>
                ): (
                    post.map((item) => (
                        <div key={item.id} className="flex flex-col justify-center items-start w-full p-8 border border-border rounded-sm shadow-xs">
                            <div className="flex items-center justify-center gap-2">
                                {item.author.avatar ? (
                                    <Avatar className="border border-border cursor-pointer h-10 w-10">
                                        <AvatarImage src={`${API_URL}${item.author.avatar}`}/>
                                    </Avatar>
                                ) : (
                                    <p className="text-2xl">{item.author.name.charAt(0)}</p>
                                )}
                                <p className="text-text-1 font-medium tracking-tight text-sm">{item.author.name}</p>
                                <p className="text-text-1/40 font-medium tracking-tight text-xs">@{item.author.username}</p>
                            </div>
                            <p className="my-4 text-text-2 font-normal text-md">{item.content}</p>
                            <p className="text-xs font-light text-text-1/60">{formatedDate(item.created_at)}</p>
                            <div className="flex items-center gap-4 border-t border-border mt-2 w-full py-2">
                                <div className="flex items-center gap-2" onClick={() => handleLike(item.id)}>
                                    <Heart className={`h-4 w-4 hover:text-primary duration-200 transition-colors cursor-pointer ${item.is_liked ? "fill-primary text-primary" : "text-text-1/60 "}`}/>
                                    <p className="text-text-1 font-medium text-sm">{item.like_count}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageCircle className={`h-4 w-4 hover:text-primary duration-200 transition-colors cursor-pointer text-text-1/60`}/>
                                    <p className="text-text-1 font-medium text-sm">{item.comment_count}</p>
                                </div>
                                <div className="flex items-center gap-2" onClick={() => handleRepost(item.id)}>
                                    <Repeat2 className={`h-4 w-4 hover:text-primary duration-200 transition-colors cursor-pointer ${item.is_repost ? "text-primary" : "text-text-1/60 "}`}/>
                                    <p className="text-text-1 font-medium text-sm">{item.repost_count}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}