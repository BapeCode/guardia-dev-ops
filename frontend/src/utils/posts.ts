import type {Post} from "@/components/ui/posts_card.tsx";
import type {Dispatch, SetStateAction} from "react";

export const submit_post = async (
    e: React.ChangeEvent<HTMLFormElement>,
    setError: (error: string) => void,
    setPost: (data: Post[]) => void,
    token: string | null
) => {
    const formData = new FormData(e.target)
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
        }
    } catch (error) {
        setError("Une erreur est survenue : " + error)
    }
}

export const handleAction = async (
    post_id: number,
    type: 'like' | 'repost',
    setPost: Dispatch<SetStateAction<Post[]>>,
    setError: Dispatch<SetStateAction<string | null>>,
    token: string | null
)=> {
    try {
         const resp = await fetch(`/api/posts/${post_id}/${type}`, {
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
            if (type === "like") {
                    setPost(prev => prev.map(p =>
                        p.id === post_id
                            ? {...p, like_count: data.like_count, is_liked: data.is_liked}
                            : p
                    ))
                } else if (type === "repost") {
                    setPost(prev => prev.map(p =>
                        p.id === post_id
                            ? {...p, repost_count: data.repost_count, is_repost: data.is_repost}
                            : p
                    ))
                } else {
                console.log("Une erreur de type d'action est survenue !")
            }
        }
    } catch (error) {
        console.log("Une erreur est survenu " + error)
    }
}
