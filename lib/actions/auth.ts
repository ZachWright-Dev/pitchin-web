"use server";
import {signIn, signOut} from "@/app/auth";


export const login = async () => {
    await signIn("google", {redirectTo: "/"});
}

export const logout = async () => {
    await signOut({ redirectTo: "/"});
}