// ============================================================================
// Shared dummy data for the group pages.
// Replace with API calls when the backend is ready.
// ============================================================================

export type Member = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type ClaimShare = {
  memberId: string;
  percent: number; // 0-100
};

export type ReceiptItem = {
  id: string;
  name: string;
  price: number;
  claims: ClaimShare[]; // sum of percent should be <= 100
};

export type Group = {
  id: string;
  name: string;
  photoEmoji: string;
  createdAt: string;
  receiptPhotoUrl?: string; // would come from API
  taxRate: number; // 0.08 = 8%
  serviceRate: number; // 0.18 = 18%
  members: Member[];
  items: ReceiptItem[];
};

// Logged in user — would come from auth/session
export const CURRENT_USER_ID = "jd";

export const CURRENT_USER = {
  name: "Zach Wright",
  plan: "Pro Plan",
  initials: "ZW",
};

export const GROUP: Group = {
  id: "1",
  name: "Nobu Dinner",
  photoEmoji: "🍣",
  createdAt: "Apr 22, 2026",
  taxRate: 0.08,
  serviceRate: 0.18,
  members: [
    { id: "jd", name: "Jamie D.", initials: "JD", color: "#4F7CFF" },
    { id: "ak", name: "Alex K.", initials: "AK", color: "#8B7CF6" },
    { id: "sm", name: "Sam M.", initials: "SM", color: "#34D399" },
    { id: "rb", name: "Riley B.", initials: "RB", color: "#F59E0B" },
  ],
  items: [
    {
      id: "i1",
      name: "Black cod miso",
      price: 38.0,
      claims: [
        { memberId: "jd", percent: 50 },
        { memberId: "sm", percent: 50 },
      ],
    },
    {
      id: "i2",
      name: "Edamame",
      price: 9.0,
      claims: [
        { memberId: "ak", percent: 25 },
        { memberId: "sm", percent: 25 },
        { memberId: "rb", percent: 25 },
        { memberId: "jd", percent: 25 },
      ],
    },
    {
      id: "i3",
      name: "Rock shrimp tempura",
      price: 24.0,
      claims: [
        { memberId: "sm", percent: 50 },
        { memberId: "rb", percent: 50 },
      ],
    },
    {
      id: "i4",
      name: "Yellowtail jalapeño",
      price: 22.0,
      claims: [{ memberId: "ak", percent: 100 }],
    },
    {
      id: "i5",
      name: "Sake flight",
      price: 28.0,
      claims: [
        { memberId: "jd", percent: 25 },
        { memberId: "ak", percent: 25 },
        { memberId: "sm", percent: 25 },
        { memberId: "rb", percent: 25 },
      ],
    },
    {
      id: "i6",
      name: "Miso soup ×2",
      price: 8.0,
      claims: [
        { memberId: "ak", percent: 50 },
        { memberId: "sm", percent: 50 },
      ],
    },
    {
      id: "i7",
      name: "Dessert platter",
      price: 18.0,
      claims: [
        { memberId: "ak", percent: 50 },
        { memberId: "rb", percent: 50 },
      ],
    },
  ],
};

// Settlements: who's paid what upfront so far. Liability is computed.
export const PAID_UPFRONT: Record<string, number> = {
  jd: 160.0,
  ak: 93.26,
  sm: 0,
  rb: 0,
};

// Helpers
export function subtotal(items: ReceiptItem[]) {
  return items.reduce((s, i) => s + i.price, 0);
}

export function grandTotal(g: Group) {
  const sub = subtotal(g.items);
  return sub + sub * g.taxRate + sub * g.serviceRate;
}

export function claimedPercent(item: ReceiptItem) {
  return item.claims.reduce((s, c) => s + c.percent, 0);
}

export function memberById(g: Group, id: string) {
  return g.members.find((m) => m.id === id);
}

// Member liability based on their claimed shares (incl. tax + service).
export function memberLiability(g: Group, memberId: string) {
  const itemsTotal = g.items.reduce((sum, item) => {
    const share =
      item.claims.find((c) => c.memberId === memberId)?.percent ?? 0;
    return sum + (item.price * share) / 100;
  }, 0);
  const multiplier = 1 + g.taxRate + g.serviceRate;
  return itemsTotal * multiplier;
}

// Optimal settlements via greedy algorithm — pair largest creditor with largest debtor.
export type Settlement = {
  fromId: string;
  toId: string;
  amount: number;
  status: "pending" | "paid";
};

export function computeSettlements(g: Group): Settlement[] {
  const balances = g.members.map((m) => ({
    id: m.id,
    net: (PAID_UPFRONT[m.id] ?? 0) - memberLiability(g, m.id),
  }));

  const creditors = balances
    .filter((b) => b.net > 0.01)
    .sort((a, b) => b.net - a.net)
    .map((b) => ({ ...b }));
  const debtors = balances
    .filter((b) => b.net < -0.01)
    .sort((a, b) => a.net - b.net)
    .map((b) => ({ ...b }));

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.net, creditor.net);
    settlements.push({
      fromId: debtor.id,
      toId: creditor.id,
      amount,
      status: "pending",
    });
    debtor.net += amount;
    creditor.net -= amount;
    if (Math.abs(debtor.net) < 0.01) i++;
    if (Math.abs(creditor.net) < 0.01) j++;
  }
  return settlements;
}