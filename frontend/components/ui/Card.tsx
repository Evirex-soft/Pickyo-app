import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-zinc-900/60",
                className
            )}
        >
            {children}
        </div>
    );
}