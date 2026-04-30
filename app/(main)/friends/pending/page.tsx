"use client";

import Link from "next/link";
import { useState } from "react";
import Avatar from "@/app/components/Avatar";
import { PENDING_REQUESTS, PendingRequest } from "@/lib/friendData";

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>(PENDING_REQUESTS);

  const accept = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    // TODO: API call to accept request
  };

  const decline = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    // TODO: API call to decline / cancel request
  };

  const incoming = requests.filter((r) => r.direction === "incoming");
  const outgoing = requests.filter((r) => r.direction === "outgoing");

  return (
    <>
      {/* Back link */}
      <Link
        href="/friends"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0F1A3D]/60 transition hover:text-[#0F1A3D]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Friends
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
          People
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
          Pending Requests
        </h1>
        <p className="mt-2 text-sm text-[#0F1A3D]/60">
          {requests.length} {requests.length === 1 ? "request" : "requests"} waiting
        </p>
      </div>

      {/* Incoming */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-bold tracking-wide">
          Incoming{" "}
          <span className="ml-1 text-xs font-medium text-[#0F1A3D]/45">
            ({incoming.length})
          </span>
        </h2>
        {incoming.length === 0 ? (
          <EmptyState message="No incoming requests." />
        ) : (
          <div className="space-y-2">
            {incoming.map((req) => (
              <RequestRow
                key={req.id}
                request={req}
                onAccept={() => accept(req.id)}
                onDecline={() => decline(req.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Outgoing */}
      <section>
        <h2 className="mb-3 text-sm font-bold tracking-wide">
          Sent by you{" "}
          <span className="ml-1 text-xs font-medium text-[#0F1A3D]/45">
            ({outgoing.length})
          </span>
        </h2>
        {outgoing.length === 0 ? (
          <EmptyState message="You haven't sent any requests." />
        ) : (
          <div className="space-y-2">
            {outgoing.map((req) => (
              <RequestRow
                key={req.id}
                request={req}
                outgoing
                onDecline={() => decline(req.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function RequestRow({
  request,
  outgoing,
  onAccept,
  onDecline,
}: {
  request: PendingRequest;
  outgoing?: boolean;
  onAccept?: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#0F1A3D]/10 bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
      <Avatar initials={request.initials} color={request.color} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{request.name}</p>
        <p className="text-xs text-[#0F1A3D]/55">
          {outgoing ? "Awaiting response" : "Wants to be your friend"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {!outgoing && onAccept && (
          <button
            onClick={onAccept}
            aria-label="Accept request"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#34D399]/15 text-[#0E9F6E] transition hover:bg-[#34D399] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
        <button
          onClick={onDecline}
          aria-label={outgoing ? "Cancel request" : "Decline request"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition hover:bg-[#E5484D] hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#0F1A3D]/15 bg-white/60 px-6 py-8 text-center text-sm text-[#0F1A3D]/55">
      {message}
    </div>
  );
}