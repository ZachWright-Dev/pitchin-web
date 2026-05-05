"use server";

import { getParsedReceipt } from "@/lib/backend-client";
import type { ParseReceiptResponse } from "@/lib/types/types";

export async function parseReceiptAction(
  base64Image: string,
  mimeType: string
): Promise<ParseReceiptResponse> {
  return getParsedReceipt(base64Image, mimeType);
}