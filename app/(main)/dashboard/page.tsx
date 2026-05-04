"use server"

import Link from "next/link";
import GroupCard from "./components/GroupCard";
import BalanceSummary from "./components/BalanceSummary";
import PersonRow from "./components/PersonRow";
import { PersonWithColor, GroupWithImage } from "./types";
import { resolveUserImageSrc } from "./utility";
import { auth } from "@/app/auth";
import {
  getDashboard,
  getGroupImage,
  getUserImageById,
  type DashboardResponse,
  type GroupImageResponse,
  type UserImageResponse,
} from "@/lib/backend-client";

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

function getFirstName(fullName: string): string {
  const name = fullName.split(' ');
  return name[0];
}
 
function assignColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name;

  const data: DashboardResponse = await getDashboard();
 
  // Fetch person images and group images in parallel
  const [personImages, groupImages] = await Promise.all([
    Promise.all(
      data.people.map((p) =>
        getUserImageById(p.id).catch((): UserImageResponse => ({
          oauth_image: null,
          image: null,
          imageType: null,
        }))
      )
    ),
    Promise.all(
      data.groups.map((g) =>
        getGroupImage(g.id).catch((): GroupImageResponse => ({
          emoji: null,
          groupImage: null,
          groupImageType: null,
        }))
      )
    ),
  ]);
 
  // Enrich people with initials, colors, and resolved image src
  const people: PersonWithColor[] = data.people.map((p, i) => ({
    ...p,
    initials: getInitials(p.name),
    color: assignColor(i),
    imageSrc: resolveUserImageSrc(personImages[i]),
  }));
 
  const groups: GroupWithImage[] = data.groups.map((g, i) => ({
    ...g,
    emoji: groupImages[i].emoji,
    groupImage: groupImages[i].groupImage,
    groupImageType: groupImages[i].groupImageType,
    accent: assignColor(i),
  }));
  
  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            Hey {userName ? getFirstName(userName) : "there"} 👋
          </h1>
        </div>
      </div>
 
      <BalanceSummary summary={data.summary} />
 
      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight">
            Balances by person
          </h2>
          <span className="text-xs font-medium text-[#0F1A3D]/50">
            {people.length} {people.length === 1 ? "person" : "people"}
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
          {people.map((person, i) => (
            <PersonRow
              key={person.id}
              person={person}
              isLast={i === people.length - 1}
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
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>
    </>
  );
}


