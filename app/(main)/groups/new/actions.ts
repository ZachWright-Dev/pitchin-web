"use server";

import { getParsedReceipt, createGroup } from "@/lib/backend-client";
import type { ParseReceiptResponse, CreateGroupRequest, CreateGroupResponse } from "@/lib/types/types";

export async function parseReceiptAction(
  base64Image: string,
  mimeType: string
): Promise<ParseReceiptResponse> {
  return getParsedReceipt(base64Image, mimeType);
}

export async function createGroupAction(
  request: CreateGroupRequest
): Promise<CreateGroupResponse> {
  return createGroup(request);
}