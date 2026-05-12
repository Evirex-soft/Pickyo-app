"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const disableSmoothScroll =
        pathname.startsWith("/admin")

    if (disableSmoothScroll) {
        return <>{children}</>;
    }

    return <SmoothScroll>{children}</SmoothScroll>;
}