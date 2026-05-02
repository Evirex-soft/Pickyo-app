import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    const { pathname } = req.nextUrl;


    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        if (accessToken) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(accessToken, secret);

            const role = payload.role as string;

            // customer trying to access driver dashboard
            if (pathname.startsWith("/driver") && role !== "driver") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // driver trying to access customer dashboard
            if (pathname.startsWith("/dashboard") && !pathname.startsWith("/driver") && role !== "customer") {
                return NextResponse.redirect(new URL("/driver/dashboard", req.url));
            }
            return NextResponse.next();
        }

        if (refreshToken) {
            return NextResponse.next();
        }

    } catch (error: any) {

        if (error.code === 'ERR_JWT_EXPIRED' && refreshToken) {
            return NextResponse.next();
        }

        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
    }

    return NextResponse.next();


}

export const config = {
    matcher: ["/dashboard/:path*", "/driver/:path*"]
};