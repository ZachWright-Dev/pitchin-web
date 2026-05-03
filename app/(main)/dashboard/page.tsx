import Link from "next/link";
import Avatar from "@/app/components/Avatar";

type Balance = {
  id: string;
  name: string;
  initials: string;
  balance: number;
  color: string;
};

type Group = {
  id: string;
  name: string;
  balance: number;
  image?: string;
  accent: string;
};

const USER = {
  name: "Zach Wright",
  plan: "Pro Plan",
  initials: "ZW",
};

const SUMMARY = {
  overall: 7.54,
  owed: 60.75,
  owe: 53.21,
  groupCount: 2,
};

const PEOPLE: Balance[] = [
  { id: "1", name: "Alex K.", initials: "AK", balance: 73.42, color: "#4F7CFF" },
  { id: "2", name: "Sam M.", initials: "SM", balance: -48.2, color: "#8B7CF6" },
  { id: "3", name: "Maya C.", initials: "MC", balance: 12.55, color: "#34D399" },
  { id: "4", name: "Devon H.", initials: "DH", balance: -5.01, color: "#0F1A3D" },
];

const GROUPS: Group[] = [
  { id: "1", name: "Nobu Dinner", balance: 60.75, image: "🍣", accent: "#4F7CFF" },
  { id: "2", name: "Ski Trip", balance: -5.01, image: "⛷️", accent: "#8B7CF6" },
  { id: "3", name: "Roommates", balance: -48.2, image: "🏠", accent: "#34D399" },
];

export default async function DashboardPage() {
  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            Hey, {USER.name.split(" ")[0]} 👋
          </h1>
        </div>
      </div>

      <BalanceSummary />

      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight">
            Balances by person
          </h2>
          <span className="text-xs font-medium text-[#0F1A3D]/50">
            {PEOPLE.length} people
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
          {PEOPLE.map((person, i) => (
            <PersonRow
              key={person.id}
              person={person}
              isLast={i === PEOPLE.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight">Your Groups</h2>
          <Link
            href="/groups"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#4F7CFF] transition hover:text-[#0F1A3D]"
          >
            View all Groups
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>
    </>
  );
}

function BalanceSummary() {
  const positive = SUMMARY.overall >= 0;
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-3xl opacity-50 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(79,124,255,0.2), rgba(139,124,246,0.15), rgba(52,211,153,0.15))",
        }}
      />
      <div className="relative grid grid-cols-1 gap-6 rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-3 md:gap-8 md:p-8">
        <div className="md:border-r md:border-[#0F1A3D]/10 md:pr-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            Your overall balance
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className={`text-4xl font-extrabold tracking-tight md:text-5xl ${
                positive ? "text-[#0E9F6E]" : "text-[#E5484D]"
              }`}
            >
              {positive ? "+" : "−"}${Math.abs(SUMMARY.overall).toFixed(2)}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0F1A3D]/55">
            {positive ? "You're owed" : "You owe"} money across{" "}
            {SUMMARY.groupCount} groups
          </p>
        </div>

        <div className="flex flex-col justify-center md:border-r md:border-[#0F1A3D]/10 md:pr-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
              You're owed
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0E9F6E] md:text-3xl">
            ${SUMMARY.owed.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5484D]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
              You owe
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E5484D] md:text-3xl">
            ${SUMMARY.owe.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PersonRow({ person, isLast }: { person: Balance; isLast: boolean }) {
  const owesYou = person.balance > 0;
  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAFBFF] ${
        isLast ? "" : "border-b border-[#0F1A3D]/8"
      }`}
    >
      <Avatar initials={person.initials} color={person.color} size={44} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{person.name}</p>
        <p className="text-xs text-[#0F1A3D]/55">
          {owesYou ? "owes you" : "you owe"}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`font-mono text-sm font-bold ${
            owesYou ? "text-[#0E9F6E]" : "text-[#E5484D]"
          }`}
        >
          {owesYou ? "+" : "−"}${Math.abs(person.balance).toFixed(2)}
        </p>
      </div>

      <button
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
          owesYou
            ? "border border-[#0F1A3D]/15 bg-white text-[#0F1A3D] hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
            : "bg-[#0F1A3D] text-white shadow-sm hover:bg-[#4F7CFF]"
        }`}
      >
        {owesYou ? "Remind" : "Pay"}
      </button>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const positive = group.balance >= 0;
  return (
    <button className="group relative overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition hover:translate-y-[-2px] hover:border-[#0F1A3D]/20 hover:shadow-md">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: group.accent }}
      />

      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: `${group.accent}18` }}
        >
          {group.image ?? "👥"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{group.name}</p>
          <p className="mt-0.5 text-xs text-[#0F1A3D]/50">
            {positive ? "You're owed" : "You owe"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span
          className={`font-mono text-xl font-bold ${
            positive ? "text-[#0E9F6E]" : "text-[#E5484D]"
          }`}
        >
          {positive ? "+" : "−"}${Math.abs(group.balance).toFixed(2)}
        </span>
        <svg
          className="h-4 w-4 text-[#0F1A3D]/30 transition group-hover:translate-x-0.5 group-hover:text-[#4F7CFF]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
