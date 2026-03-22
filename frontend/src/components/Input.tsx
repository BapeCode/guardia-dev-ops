import {cn} from "@/lib/utils.ts";

interface InputProps {
    label?: string;
    type?: string;
    placeholder?: string;
    name?: string;
    required?: boolean
    className?: string
}

export default function Input({label, type = "text", placeholder, name, required, className}: InputProps) {
    return (
        <div className="flex flex-col items-start gap-2 w-full">
            {label && (
                <label className="text-xs font-light text-text-1/40 uppercase tracking-widest">{label}</label>
            )}
            <input
                required={required || false}
                name={name}
                type={type}
                placeholder={placeholder}
                className={cn(
                    "w-full px-2.5 py-3 shadow-sm border-border focus:outline-none focus:ring-1 focus:ring-border-gold focus:ring-offset-2",
                    className
                )} />
        </div>
    )
}