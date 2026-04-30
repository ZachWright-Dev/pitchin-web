import type { Friend } from "@/app/components/FriendModal";

export const FRIENDS: Friend[] = [
  {
    id: "f1",
    name: "Sam M.",
    initials: "SM",
    color: "#34D399",
    email: "sam.m@example.com",
    phone: "555-201-3344",
  },
  {
    id: "f2",
    name: "Alex K.",
    initials: "AK",
    color: "#8B7CF6",
    email: "alex.k@example.com",
    phone: "555-708-1290",
  },
  {
    id: "f3",
    name: "Maya C.",
    initials: "MC",
    color: "#4F7CFF",
    email: "maya.c@example.com",
    phone: "555-114-7785",
  },
  {
    id: "f4",
    name: "Devon H.",
    initials: "DH",
    color: "#0F1A3D",
    email: "devon.h@example.com",
    phone: "555-993-2014",
  },
  {
    id: "f5",
    name: "Riley B.",
    initials: "RB",
    color: "#F59E0B",
    email: "riley.b@example.com",
    phone: "555-447-8821",
  },
];

export type PendingRequest = {
  id: string;
  name: string;
  initials: string;
  color: string;
  direction: "incoming" | "outgoing";
};

export const PENDING_REQUESTS: PendingRequest[] = [
  {
    id: "p1",
    name: "Jordan T.",
    initials: "JT",
    color: "#4F7CFF",
    direction: "incoming",
  },
  {
    id: "p2",
    name: "Taylor R.",
    initials: "TR",
    color: "#8B7CF6",
    direction: "incoming",
  },
  {
    id: "p3",
    name: "Casey W.",
    initials: "CW",
    color: "#34D399",
    direction: "outgoing",
  },
];

// Pretend "all users in the database" pool — for the add-friend search to query against
export const SEARCHABLE_USERS = [
  { id: "u1", name: "Morgan P.", initials: "MP", color: "#4F7CFF" },
  { id: "u2", name: "Jamie L.", initials: "JL", color: "#8B7CF6" },
  { id: "u3", name: "Quinn S.", initials: "QS", color: "#34D399" },
  { id: "u4", name: "Avery G.", initials: "AG", color: "#F59E0B" },
  { id: "u5", name: "Reese D.", initials: "RD", color: "#0F1A3D" },
  { id: "u6", name: "Skyler F.", initials: "SF", color: "#4F7CFF" },
  { id: "u7", name: "Robin V.", initials: "RV", color: "#8B7CF6" },
];