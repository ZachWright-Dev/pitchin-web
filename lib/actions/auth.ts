"use server";
import {signIn, signOut} from "@/app/auth";


export const login = async () => {
    await signIn("google", {redirectTo: "/dashboard"});
}

export const logout = async () => {
    await signOut({ redirectTo: "/"});
}