import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const { payload } = await jwtVerify(token, secret);

        const role = payload.role as string;

        const { pathname } = req.nextUrl;

        // customer accessing driver routes
        if (pathname.startsWith("/driver") && role !== "driver") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Driver trying to access customer routes
        if (pathname.startsWith("/dashboard") && role !== "customer") {
            return NextResponse.redirect(new URL("/driver/dashboard", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("accessToken");
        return res;
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/driver/:path*"]
};