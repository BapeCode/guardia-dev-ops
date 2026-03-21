import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import * as api from "../api";
import {
    Camera, Settings, Pin, Calendar, LinkIcon, Shuffle,
    ExternalLink, MessageCircle, Heart, Repeat2, Loader2, UserPlus, UserCheck
} from "lucide-react";

interface Post {
    id: number;
    title: string;
    content: string;
    author: { id: number; name: string; username: string; avatar: string };
    like_count: number;
    comment_count: number;
    repost_count: number;
    is_liked: boolean;
    is_reposted: boolean;
    created_at: string;
}

interface ProfileUser {
    id: number;
    name: string;
    username: string;
    email: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    created_at: string;
    avatar: string;
    banner: string;
}

const TABS = ["Posts", "Réponses", "Reposts", "Likes"];

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
}

export default function ProfilePage({ username }: { username?: string }) {
    const { user: authUser, token } = useAuth();

    // If no username prop, show own profile
    const profileUsername = username || authUser?.username;

    const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("Posts");
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // ── Fetch profile ──
    useEffect(() => {
        if (!profileUsername) return;

        setLoading(true);
        api.getProfile(profileUsername)
            .then((data) => {
                setProfileUser(data.user);
                setIsOwnProfile(data.is_own_profile);
                setIsFollowing(data.is_following);
            })
            .catch((err) => console.error("Erreur profil:", err))
            .finally(() => setLoading(false));
    }, [profileUsername]);

    // ── Fetch posts ──
    const fetchPosts = useCallback((pageNum: number, reset = false) => {
        if (!profileUsername) return;

        setPostsLoading(true);
        api.getUserPosts(profileUsername, pageNum)
            .then((data) => {
                setPosts((prev) => reset ? data.posts : [...prev, ...data.posts]);
                setHasMore(pageNum < data.pages);
            })
            .catch((err) => console.error("Erreur posts:", err))
            .finally(() => setPostsLoading(false));
    }, [profileUsername]);

    useEffect(() => {
        setPage(1);
        fetchPosts(1, true);
    }, [profileUsername, fetchPosts]);

    // ── Actions ──
    const handleFollow = async () => {
        if (!profileUsername) return;
        try {
            const data = await api.toggleFollow(profileUsername);
            setIsFollowing(data.is_following);
            setProfileUser((prev) =>
                prev ? { ...prev, followers: data.followers_count } : prev
            );
        } catch (err) {
            console.error("Erreur follow:", err);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            const data = await api.toggleLike(postId);
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? { ...p, is_liked: data.is_liked, like_count: data.like_count }
                        : p
                )
            );
        } catch (err) {
            console.error("Erreur like:", err);
        }
    };

    const handleRepost = async (postId: number) => {
        try {
            const data = await api.toggleRepost(postId);
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? { ...p, is_reposted: data.is_reposted, repost_count: data.repost_count }
                        : p
                )
            );
        } catch (err) {
            console.error("Erreur repost:", err);
        }
    };

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchPosts(next);
    };

    const handleEditProfile = () => {
        window.location.hash = "#profile#edit";
    };

    // ── Loading state ──
    if (loading) {
        return (
            <section className="flex items-center justify-center border-x border-zinc-200 dark:border-zinc-800 w-full bg-white dark:bg-zinc-950 h-full">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </section>
        );
    }

    if (!profileUser) {
        return (
            <section className="flex items-center justify-center border-x border-zinc-200 dark:border-zinc-800 w-full bg-white dark:bg-zinc-950 h-full">
                <p className="text-zinc-500">Utilisateur introuvable</p>
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center justify-start border-x border-zinc-200 dark:border-zinc-800 w-full bg-white dark:bg-zinc-950 h-full overflow-auto">

            {/* ── Banner ── */}
            <div className="relative w-full h-48 md:h-64 lg:h-72 bg-zinc-100 dark:bg-zinc-900 overflow-hidden group">
                {profileUser.banner ? (
                    <>
                        <img
                            src={profileUser.banner}
                            alt="Bannière de profil"
                            onLoad={() => setBannerLoaded(true)}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${bannerLoaded ? "opacity-100" : "opacity-0"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-zinc-950/80 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
                )}

                {isOwnProfile && (
                    <button className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                        <Camera className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* ── Avatar + Actions ── */}
            <div className="flex items-end justify-between px-5 md:px-8 w-full -mt-10 md:-mt-12 relative z-10">
                <div className="relative group cursor-pointer">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        {profileUser.avatar ? (
                            <img src={profileUser.avatar} alt={profileUser.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                                <span className="text-2xl md:text-3xl font-semibold text-white select-none">
                                    {profileUser.name?.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 pb-1">
                    {isOwnProfile ? (
                        <button
                            onClick={handleEditProfile}
                            className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                        >
                            <Settings className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline text-xs uppercase tracking-wider">Éditer le profil</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                isFollowing
                                    ? "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-red-300 hover:text-red-500 dark:hover:border-red-800 dark:hover:text-red-400"
                                    : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
                            }`}
                        >
                            {isFollowing ? (
                                <>
                                    <UserCheck className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline text-xs uppercase tracking-wider">Abonné</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline text-xs uppercase tracking-wider">Suivre</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* ── User info ── */}
            <div className="flex flex-col w-full px-5 md:px-8 mt-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {profileUser.name}
                    </h1>
                    <p className="text-zinc-400 dark:text-zinc-500 font-mono text-sm mt-0.5">
                        @{profileUser.username}
                    </p>
                </div>

                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mt-3 text-[15px] max-w-lg">
                    {profileUser.bio || "Aucune bio pour le moment..."}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                    {profileUser.location && (
                        <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                            <Pin className="h-3.5 w-3.5" />
                            <span className="text-xs">{profileUser.location}</span>
                        </div>
                    )}
                    {profileUser.created_at && (
                        <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-xs">
                                Membre depuis{" "}
                                {new Date(profileUser.created_at).toLocaleDateString("fr-FR", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5 mt-4">
                    <button className="group flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {profileUser.following}
                        </span>
                        <span className="text-sm text-zinc-400 dark:text-zinc-500">abonnements</span>
                    </button>
                    <button className="group flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {profileUser.followers}
                        </span>
                        <span className="text-sm text-zinc-400 dark:text-zinc-500">abonnés</span>
                    </button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex w-full border-b border-zinc-200 dark:border-zinc-800 mt-5">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative flex-1 py-3.5 text-sm font-medium transition-colors duration-200 ${
                            activeTab === tab
                                ? "text-zinc-900 dark:text-zinc-50"
                                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-amber-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Posts feed ── */}
            <div className="w-full">
                {postsLoading && posts.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                        <p className="text-sm">Aucun post pour le moment</p>
                    </div>
                ) : (
                    <>
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="w-full px-5 md:px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors duration-150 cursor-pointer"
                            >
                                {/* Post header */}
                                <div className="flex items-center gap-2.5">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 overflow-hidden">
                                        {post.author.avatar ? (
                                            <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-semibold text-white">{post.author.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-2 min-w-0">
                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                            {post.author.name}
                                        </span>
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono truncate">
                                            @{post.author.username}
                                        </span>
                                        <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                        <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                                            {timeAgo(post.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Post content */}
                                <div className="ml-[46px] mt-1.5">
                                    <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                                        {post.title}
                                    </h3>
                                    <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-0.5">
                                        {post.content}
                                    </p>

                                    {/* Post actions */}
                                    <div className="flex items-center gap-8 mt-3">
                                        <button className="group flex items-center gap-1.5 text-zinc-400 hover:text-sky-500 transition-colors">
                                            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs">{post.comment_count}</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRepost(post.id); }}
                                            className={`group flex items-center gap-1.5 transition-colors ${
                                                post.is_reposted ? "text-emerald-500" : "text-zinc-400 hover:text-emerald-500"
                                            }`}
                                        >
                                            <Repeat2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs">{post.repost_count}</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                            className={`group flex items-center gap-1.5 transition-colors ${
                                                post.is_liked ? "text-rose-500" : "text-zinc-400 hover:text-rose-500"
                                            }`}
                                        >
                                            <Heart className={`h-4 w-4 group-hover:scale-110 transition-transform ${post.is_liked ? "fill-current" : ""}`} />
                                            <span className="text-xs">{post.like_count}</span>
                                        </button>
                                        <button className="group flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                                            <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {/* Load more */}
                        {hasMore && (
                            <div className="flex justify-center py-6">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={postsLoading}
                                    className="px-6 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
                                >
                                    {postsLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Charger plus"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}