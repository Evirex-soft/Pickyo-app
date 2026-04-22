"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { RootState } from "@/store/store";
import { setCredentials } from "@/store/authSlice";
import { getProfile } from "@/services/user.service";

export default function AuthIntializer() {
    const dispatch = useDispatch();
    const pathname = usePathname();

    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        // Skip on login
        if (pathname === "/login") return;

        if (user) return;

        const initAuth = async () => {
            try {
                const res = await getProfile();
                dispatch(setCredentials(res.user))
            } catch (error) {

            }
        };
        initAuth();
    }, [dispatch]);

    return null;
}