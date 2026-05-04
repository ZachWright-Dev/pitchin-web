"use client";

import Avatar from "@/app/components/Avatar";

export type StackMember = {
  initials: string;
  color: string;
  imageSrc: string | null;
};

export default function AvatarStack({ members }: { members: StackMember[] }) {
  const visible = members.slice(0, 4);
  const overflow = members.length - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((m, i) => (
        <div
          key={i}
          className="relative"
          style={{
            marginLeft: i === 0 ? 0 : -8,
            zIndex: visible.length - i,
          }}
        >
          <div className="rounded-full border-2 border-white">
            <Avatar
              initials={m.initials}
              color={m.color}
              size={28}
              imageSrc={m.imageSrc}
            />
          </div>
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#0F1A3D]/10 text-[10px] font-semibold text-[#0F1A3D]/60"
          style={{ marginLeft: -8 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}