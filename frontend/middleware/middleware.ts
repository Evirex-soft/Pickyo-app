import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;

    const protectedRoutes = ["/dashboard", "/profile", "/orders"];

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/orders/:path*"],
};