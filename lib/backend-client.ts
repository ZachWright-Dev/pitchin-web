import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { auth } from "@/app/auth";
import type {
    DashboardResponse,
    GroupImageResponse,
    UserImageResponse,
    PersonBalance,
    GroupBalance,
 } from "./types/types";

export type { DashboardResponse, GroupImageResponse, UserImageResponse, PersonBalance, GroupBalance };

const BACKEND_URL: string = process.env.BACKEND_URL || "http://localhost:5000";

// Get Next Token to make authenticated requests
async function getAuthToken() {
    const cookieStore = await cookies();
    const headerStore = await headers();

    return getToken({
        req: { cookies: cookieStore, headers: headerStore} as any,
        secret: process.env.AUTH_SECRET!,
        raw: true,
    });
}

/**
 * TODO: Call all server endpoints here and export them to the necessary
 * server components.
 */

async function backendPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const authToken = await getAuthToken();

    const res = await fetch(`${BACKEND_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(authToken ? {Authorization: `Bearer ${authToken}`} : {}),
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Backend error ${res.status}: ${res.statusText}`)
    }

    return res.json() as Promise<T>;
}

export async function getDashboard(): Promise<DashboardResponse> {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Session Error or Not Authorized");
    }
    const userId = session.user.id;
    
    return backendPost<DashboardResponse>("/dashboard", { user_id: userId });
}

export async function getUserImageById(userId: string): Promise<UserImageResponse> {
    return backendPost<UserImageResponse>("/user/image", { user_id: userId });
}

export async function getGroupImage(groupId: string): Promise<GroupImageResponse> {
    return backendPost<GroupImageResponse>("/group/image", { group_id: groupId });
}
