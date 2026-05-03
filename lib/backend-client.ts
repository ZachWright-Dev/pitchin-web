import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";

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