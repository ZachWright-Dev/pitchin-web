import { PersonWithColor } from "../types";
import Avatar from "@/app/components/Avatar";

export default function PersonRow({
  person,
  isLast,
}: {
  person: PersonWithColor;
  isLast: boolean;
}) {
  const owesYou = person.balance > 0;
  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAFBFF] ${
        isLast ? "" : "border-b border-[#0F1A3D]/8"
      }`}
    >
      <Avatar initials={person.initials} color={person.color} size={44} imageSrc={person.imageSrc} />
 
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