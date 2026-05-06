export interface DashboardResponse {
  summary: {
    overall_balance: number;
    amount_owed: number;
    amount_owe: number;
    num_groups_owed: number;
  };
  people: PersonBalance[];
  groups: GroupBalance[];
}
 
export interface PersonBalance {
  id: string;
  name: string;
  balance: number;
}
 
export interface GroupBalance {
  id: string;
  name: string;
  balance: number;
}
 
export interface GroupImageResponse {
  emoji: string | null;
  groupImage: string | null;
  groupImageType: string | null;
}
 
export interface UserImageResponse {
  oauth_image: string | null;
  image: string | null;
  imageType: string | null;
}

export interface GroupOverviewResponse {
  groups: GroupOverviewGroup[];
}
export interface GroupOverviewGroup {
  id: string;
  name: string;
  balance: number;
  members: GroupMember[];
}
export interface GroupMember {
  id: string;
  name: string;
}
interface ReceiptItem {
  name: string
  price: number
  quantity: number
}

interface ReceiptSuccessSchema {
  success: true
  items: ReceiptItem[]
  subTotal: number
  tax: number
  total: number
}

interface ReceiptErrorSchema {
  success: false
  error: string
}

export type ParseReceiptResponse = ReceiptSuccessSchema | ReceiptErrorSchema;

interface RequestReceiptItem {
  name: string
  quantity: number
  unitPrice: number
}

interface ResponseReceiptItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

interface RequestReceipt {
  image: string | null
  items: RequestReceiptItem[]
  taxAmount: number
  tipAmount: number
}

interface ResponseReceipt {
  id: string
  subtotal: number
  taxAmount: number
  tipAmount: number
  grandTotal: number
  items: ResponseReceiptItem[]
}

export interface CreateGroupRequest {
  name: string
  emoji: string | null
  groupImage: string | null
  groupImageType: string | null
  receipt: RequestReceipt
}

export interface CreateGroupResponse {
  id: string
  name: string
  emoji: string | null
  inviteToken: string
  createdAt: string
  receipt: ResponseReceipt
}
