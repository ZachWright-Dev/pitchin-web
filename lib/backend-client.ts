import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import type {
    DashboardResponse,
    GroupImageResponse,
    UserImageResponse,
    PersonBalance,
    GroupBalance,
    GroupOverviewResponse,
    ParseReceiptResponse,
    CreateGroupRequest,
    CreateGroupResponse,
    GetReceiptDataResponse,
    GetGroupMembersResponse,
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

async function backendPost<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    const authToken = await getAuthToken();

    const res = await fetch(`${BACKEND_URL}${path}`, {
        method: "POST",
        headers: {
            ...(body ? {"Content-Type": "application/json"} : {}),
            ...(authToken ? {Authorization: `Bearer ${authToken}`} : {}),
        },
        ...(body ? {body: JSON.stringify(body)} : {}),
    });

    if (!res.ok) {
        throw new Error(`Backend error ${res.status}: ${res.statusText}`)
    }

    return res.json() as Promise<T>;
}

export async function getDashboard(): Promise<DashboardResponse> {
    return backendPost<DashboardResponse>("/dashboard");
}

export async function getUserImageById(userId: string): Promise<UserImageResponse> {
    return backendPost<UserImageResponse>("/user/image", { user_id: userId });
}

export async function getGroupImage(groupId: string): Promise<GroupImageResponse> {
    return backendPost<GroupImageResponse>("/group/image", { group_id: groupId });
}

export async function getGroupOverview(): Promise<GroupOverviewResponse> {
    return backendPost<GroupOverviewResponse>("/user/group-overview");
}

export async function getParsedReceipt(base64Image: string, mimeType: string): Promise<ParseReceiptResponse> {
    return backendPost<ParseReceiptResponse>("/group/receipt-parse", { base64Image, mimeType });
}

export async function createGroup(newGroup: CreateGroupRequest): Promise<CreateGroupResponse> {
    return backendPost<CreateGroupResponse>("/group", { ...newGroup }); 
}

export async function getReceiptData(groupId: string): Promise<GetReceiptDataResponse> {
    return backendPost<GetReceiptDataResponse>('/group/receipt-data', { group_id: groupId });
}

export async function getGroupMembers(groupId: string): Promise<GetGroupMembersResponse> {
    return backendPost<GetGroupMembersResponse>('/group/members', { group_id: groupId });
}
