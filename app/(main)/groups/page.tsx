import Link from "next/link";
import AvatarStack, { type StackMember } from "@/app/(main)/groups/components/AvatarStack";
import { resolveUserImageSrc } from "../dashboard/utility";
import {
  getGroupOverview,
  getGroupImage,
  getUserImageById,
  type GroupImageResponse,
  type UserImageResponse,
} from "@/lib/backend-client";

// ── Helpers ────────────────────────────────────────────────────────────

const COLORS = ["#4F7CFF", "#8B7CF6", "#34D399", "#F59E0B", "#EF4444", "#06B6D4"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function assignColor(index: number): string {
  return COLORS[index % COLORS.length];
}

// ── Enriched types ─────────────────────────────────────────────────────

type EnrichedGroup = {
  id: string;
  name: string;
  balance: number;
  emoji: string | null;
  groupImage: string | null;
  groupImageType: string | null;
  members: StackMember[];
};

// ── Page ───────────────────────────────────────────────────────────────

export default async function GroupsPage() {
  const data = await getGroupOverview();

  // Collect all unique member IDs across all groups for deduplication
  const uniqueMemberIds = new Set<string>();
  for (const group of data.groups) {
    for (const member of group.members) {
      uniqueMemberIds.add(member.id);
    }
  }

  // Fetch all unique member images in parallel
  const memberIds = Array.from(uniqueMemberIds);
  const memberImageResults = await Promise.all(
    memberIds.map((id) =>
      getUserImageById(id).catch((): UserImageResponse => ({
        oauth_image: null,
        image: null,
        imageType: null,
      }))
    )
  );

  // Build a lookup map: memberId -> resolved image src
  const memberImageMap = new Map<string, string | null>();
  memberIds.forEach((id, i) => {
    memberImageMap.set(id, resolveUserImageSrc(memberImageResults[i]));
  });

  // Fetch all group images in parallel
  const groupImageResults = await Promise.all(
    data.groups.map((g) =>
      getGroupImage(g.id).catch((): GroupImageResponse => ({
        emoji: null,
        groupImage: null,
        groupImageType: null,
      }))
    )
  );

  // Enrich groups with image data and resolved member avatars
  const groups: EnrichedGroup[] = data.groups.map((g, gi) => ({
    id: g.id,
    name: g.name,
    balance: g.balance,
    emoji: groupImageResults[gi].emoji,
    groupImage: groupImageResults[gi].groupImage,
    groupImageType: groupImageResults[gi].groupImageType,
    members: g.members.map((m, mi) => ({
      initials: getInitials(m.name),
      color: assignColor(mi),
      imageSrc: memberImageMap.get(m.id) ?? null,
    })),
  }));

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            Groups
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            Your Groups
          </h1>
        </div>
        <Link
          href="/groups/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1A3D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4F7CFF]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Group
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
        {groups.map((group, i) => (
          <GroupRow
            key={group.id}
            group={group}
            isLast={i === groups.length - 1}
          />
        ))}
      </div>
    </>
  );
}

// ── Components ─────────────────────────────────────────────────────────

function GroupRow({
  group,
  isLast,
}: {
  group: EnrichedGroup;
  isLast: boolean;
}) {
  const positive = group.balance >= 0;

  const renderGroupIcon = () => {
    if (group.groupImage && group.groupImageType) {
      return (
        <img
          src={`data:${group.groupImageType};base64,${group.groupImage}`}
          alt={group.name}
          className="h-full w-full rounded-2xl object-cover"
        />
      );
    }
    return <span className="text-2xl">{group.emoji ?? "👥"}</span>;
  };

  return (
    <Link
      href={`/groups/${group.id}`}
      className={`group flex items-center gap-5 px-6 py-5 transition hover:bg-[#FAFBFF] ${
        isLast ? "" : "border-b border-[#0F1A3D]/8"
      }`}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-2xl"
        style={{ background: group.groupImage ? undefined : "rgba(15,26,61,0.05)" }}
      >
        {renderGroupIcon()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold">{group.name}</p>
        <div className="mt-2 flex items-center">
          <AvatarStack members={group.members} />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F1A3D]/45">
          Balance
        </p>
        <p
          className={`font-mono text-xl font-bold ${
            positive ? "text-[#0E9F6E]" : "text-[#E5484D]"
          }`}
        >
          {positive ? "+" : "−"}${Math.abs(group.balance).toFixed(0)}
        </p>
      </div>

      <svg
        className="h-4 w-4 shrink-0 text-[#0F1A3D]/25 transition group-hover:translate-x-0.5 group-hover:text-[#4F7CFF]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}