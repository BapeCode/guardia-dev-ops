import type {User} from "@/store/AuthContext.tsx";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {API_URL} from "@/utils/app.ts";
import {formatedDate} from "@/lib/utils.ts";
import {Heart, MessageCircle, Repeat2, Trash} from "lucide-react";
import {deletePost, handleAction} from "@/lib/posts.ts";
import type {Dispatch, SetStateAction} from "react";

export interface Post {
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
    is_reposted: boolean
}

export interface PostsProps {
    item: Post,
    setPost: Dispatch<SetStateAction<Post[]>>,
    setError: Dispatch<SetStateAction<string | null>>,
    token: string | null,
    user: User | null
}

export default function Posts_card({item, setPost, setError, token, user}: PostsProps) {
    return (
        <div className="flex flex-col justify-center items-start w-full p-8 border border-border rounded-sm shadow-xs">
            <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
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

                {item.author.id === user?.id && (
                   <div className="flex items-center gap-2">
                       <Trash onClick={() => deletePost(item.id, setPost, setError)} className="w-4 h-4 text-text-1/40 hover:text-primary duration-300 transition-colors cursor-pointer"/>
                   </div>
                )}
            </div>
            <p className="my-4 text-text-2 font-normal text-md">{item.content}</p>
            <p className="text-xs font-light text-text-1/60">{formatedDate(item.created_at)}</p>
            <div className="flex items-center gap-4 border-t border-border mt-2 w-full py-2">
                <div className="flex items-center gap-2" onClick={() => handleAction(item.id, "like", setPost, setError, token)}>
                    <Heart className={`h-4 w-4 hover:text-primary duration-200 transition-colors cursor-pointer ${item.is_liked ? "fill-primary text-primary" : "text-text-1/60 "}`}/>
                        <p className="text-text-1 font-medium text-sm">{item.like_count}</p>
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle className={`h-4 w-4 hover:text-primary duration-200 transition-colors cursor-pointer text-text-1/60`}/>
                    <p className="text-text-1 font-medium text-sm">{item.comment_count}</p>
                </div>
                <div className="flex items-center gap-2" onClick={() => handleAction(item.id, "repost", setPost, setError, token)}>
                    <Repeat2 className={`h-4 w-4 hover:text-primary duration-200 transition-colors cursor-pointer ${item.is_reposted ? "text-primary" : "text-text-1/60 "}`}/>
                    <p className="text-text-1 font-medium text-sm">{item.repost_count}</p>
                </div>
            </div>
        </div>
    )
}