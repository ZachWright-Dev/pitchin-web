"use client";

import Modal from "./Modal";
import Avatar from "./Avatar";

export type Friend = {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
};

export default function FriendModal({
  friend,
  open,
  onClose,
  onRemove,
}: {
  friend: Friend | null;
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  if (!friend) return null;

  const handleRemove = () => {
    onRemove(friend.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Friend details" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Header: avatar + name */}
        <div className="flex items-center gap-4">
          <Avatar initials={friend.initials} color={friend.color} size={72} />
          <div className="min-w-0">
            <h3 className="truncate text-2xl font-extrabold tracking-tight">
              {friend.name}
            </h3>
            <p className="text-xs text-[#0F1A3D]/55">Friend</p>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <InfoRow
            label="Number"
            value={friend.phone}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            }
          />
          <InfoRow
            label="Email"
            value={friend.email}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="w-full rounded-xl border border-[#E5484D]/30 bg-white px-4 py-3 text-sm font-semibold text-[#E5484D] transition hover:bg-[#E5484D] hover:text-white"
        >
          Remove Friend
        </button>
      </div>
    </Modal>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#0F1A3D]/8 bg-white px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4F7CFF]/10 text-[#4F7CFF]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0F1A3D]/50">
          {label}
        </p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}