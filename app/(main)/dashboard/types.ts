import { PersonBalance, GroupBalance } from "@/lib/types/types";

export type PersonWithColor = PersonBalance & {
  initials: string;
  color: string;
  imageSrc: string | null;
};
 
export type GroupWithImage = GroupBalance & {
  emoji: string | null;
  groupImage: string | null;
  groupImageType: string | null;
  accent: string;
};
