import * as React from "react";

export default function Section(
    { children, className }: { children: React.ReactNode, className?: string }
) {
    return (
        <section className={`max-w-7xl mx-auto ${className}`}>
            {children}
        </section>
    )
}