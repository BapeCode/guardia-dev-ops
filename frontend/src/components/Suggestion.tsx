import {Search} from "lucide-react";

export default function Suggestion() {

    return (
        <section className="flex flex-col items-center justify-start py-6 w-75 gap-2 animate-in slide-in-from-right-5 fade-in duration-500">
            <div className="flex items-center gap-2 bg-card px-6 py-4 rounded-full border border-border">
                <label htmlFor={"search"} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Search className="h-5 w-5"/>
                </label>
                <input id="search" className="focus:outline-none focus:ring-offset-0" placeholder="Rechercher"/>
            </div>
        </section>
    );
}