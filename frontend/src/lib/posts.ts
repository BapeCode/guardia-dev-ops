import type {Post} from "@/components/ui/posts_card.tsx";
import type {Dispatch, SetStateAction} from "react";
import axios from "axios";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
})

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

export const get_post_action = async (
    type: 'like' | 'repost',
    setPost: Dispatch<SetStateAction<Post[]>>,
    token: string | null
)=> {
    try {
        const resp = await fetch(`/api/posts/${type}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })

        const data = await resp.json()
        if (resp.ok) {
            setPost(data.posts)
        }
    } catch (error) {
        console.log("Une erreur est survenue : " + error)
    }
}

export const getPost = async (callback: (post: Post[], error: string | null) => void) => {
    try {
        const { data } = await axios.get("/api/posts",
            {headers: authHeaders()}
        )
        callback(data.post, data.error)
    } catch (error) {
        console.log("[GET_POST] => " + error)
        callback([], "Une erreur est survenue lors de la récupération des posts")
    }
}

export const createPost = async (
    formData: FormData,
    setPosts: Dispatch<SetStateAction<Post[]>>,
    setError: Dispatch<SetStateAction<string | null>>
) => {
    const content = formData.get("post_content")?.toString().trim()

    if (!content) {
        setError("Le contenu ne peut pas être vide")
        return
    }

    try {
        const {data} = await axios.post("/api/posts/create", {
            content
        }, {
            headers: authHeaders()
        })
        setPosts(prev => [data.post, ...prev])
        setError(null)
    } catch (error) {
        setError("Impossible de publier le post")
        console.log("[CREATE_POST] => ", error)
    }
}

export const deletePost = async (
    post_id: number,
    setPost: Dispatch<SetStateAction<Post[]>>,
    setError: Dispatch<SetStateAction<string | null>>
) => {
    try {
        const {data} = await axios.post("/api/posts/delete", {post_id: post_id}, {headers: authHeaders()})

        if (data.is_deleted) {
            setPost(prev => prev.filter(post => post.id !== post_id))
        } else {
            setError("Impossible de supprimé !")
        }
    } catch (error) {
        console.log("[DELETE_POST] => ", error)
    }
}