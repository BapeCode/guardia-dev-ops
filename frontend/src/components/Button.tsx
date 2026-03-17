interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default function Button({ onClick, children, className, type = "button" }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-primary text-white rounded-xs px-4 py-2 transition-colors hover:bg-primary/80 cursor-pointer ${className}`}
        >
            {children}
        </button>
    )
}