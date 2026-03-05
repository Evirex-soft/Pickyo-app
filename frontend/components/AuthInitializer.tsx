"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { getProfile } from "@/services/user.service";

export default function AuthIntializer() {
    const dispath = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await getProfile();
                dispath(setCredentials(res.user))
            } catch (error) {

            }
        };
        initAuth();
    }, [dispath]);

    return null;
}