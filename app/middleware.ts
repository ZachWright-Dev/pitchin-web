import {NextResponse} from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from "@/app/auth";

// Future routes, Dashboard, Friends, Groups etc.
const protectedRoutes: string[] = [];
export default async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;
    const isProtected: boolean = protectedRoutes.some((route) => {
        return pathname.startsWith(route)
    });

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/api/auth/signin", request.url))
    }

    return NextResponse.next();
}