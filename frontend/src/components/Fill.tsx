import Input from "@/components/Input.tsx";
import {useAuth} from "@/store/AuthContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FileImage} from "lucide-react";
import {API_URL} from "@/utils/app.ts";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {useEffect, useState} from "react";
import Posts_card, {type Post} from "@/components/ui/posts_card.tsx";
import {submit_post} from "@/utils/posts.ts";
import Loading from "@/components/ui/loading.tsx";


export default function Fill() {
    const { user, token } = useAuth()
    const [post, setPost] = useState<Post[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

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
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            }
        }

        getPost().then()
    }, []);

    if (loading) return (
        <Loading/>
    )

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

                <form onSubmit={(e) => submit_post(e, setError, setPost, token)} className="flex flex-col items-end justify-center w-full gap-4">
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
                        <Posts_card key={item.id} item={item} setPost={setPost} setError={setError} token={token}/>
                    ))
                )}
            </div>
        </section>
    )
}