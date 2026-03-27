import {Loader} from "lucide-react";

export default function Loading() {
    return (
        <div className="flex items-center gap-2 h-screen w-full justify-center">
            <Loader className="h-10 w-10 animate-spin"/>
            Chargement...
        </div>
    )
}