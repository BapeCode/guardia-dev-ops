import * as React from "react";
import {cn} from "@/lib/utils.ts";

export default function Section(
    { children, className }: { children: React.ReactNode, className?: string }
) {
    return (
        <section className={cn(className, "max-w-7xl mx-auto")}>
            {children}
        </section>
    )
}