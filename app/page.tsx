"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Row, LogoMark } from "@/app/utility/index"

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFBFF] text-[#0F1A3D]">
      {/* Decorative gradient blobs echoing the logo palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #4F7CFF 0%, rgba(79,124,255,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #8B7CF6 0%, rgba(139,124,246,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #34D399 0%, rgba(52,211,153,0) 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#0F1A3D 1px, transparent 1px), linear-gradient(90deg, #0F1A3D 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-[#0F1A3D]">Pitch</span>
            <span className="text-[#4F7CFF]">In</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#0F1A3D]/70 md:flex">
          <a className="transition hover:text-[#0F1A3D]" href="#features">
            Features
          </a>
          <a className="transition hover:text-[#0F1A3D]" href="#how">
            How it works
          </a>
          <a className="transition hover:text-[#0F1A3D]" href="#faq">
            FAQ
          </a>
        </nav>
        <Link
          href="/login"
          className="rounded-full border border-[#0F1A3D]/10 bg-white/60 px-4 py-2 text-sm font-medium text-[#0F1A3D] backdrop-blur transition hover:border-[#0F1A3D]/20 hover:bg-white"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-16 pb-24 text-center md:pt-24">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0F1A3D]/10 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-wide text-[#0F1A3D]/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
          No more awkward IOUs
        </span>

        <h1 className="max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Welcome to{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[#0F1A3D]">Pitch</span>
            <span className="relative z-10 text-[#4F7CFF]">In</span>
            <span
              aria-hidden
              className="absolute bottom-1 left-0 right-0 -z-0 h-3 rounded-sm"
              style={{
                background:
                  "linear-gradient(90deg, #34D399 0%, #4F7CFF 50%, #8B7CF6 100%)",
                opacity: 0.25,
              }}
            />
          </span>
          !
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0F1A3D]/65 md:text-xl">
          PitchIn is a simple-to-use payment splitting platform that removes the
          headache of splitting the bill — so the only thing left to argue about
          is who gets the last fry.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={() => router.push("/login")}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#0F1A3D] px-8 py-4 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,26,61,0.6)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_40px_-12px_rgba(79,124,255,0.55)]"
          >
            <span className="relative z-10">Login</span>
            <svg
              className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
            <span
              aria-hidden
              className="absolute inset-0 -z-0 translate-x-[-100%] bg-gradient-to-r from-[#4F7CFF] via-[#8B7CF6] to-[#4F7CFF] transition-transform duration-500 group-hover:translate-x-0"
            />
          </button>

          <a
            href="#how"
            className="text-sm font-medium text-[#0F1A3D]/70 underline-offset-4 transition hover:text-[#0F1A3D] hover:underline"
          >
            See how it works ↓
          </a>
        </div>

        {/* Floating receipt card preview */}
        <div className="relative mt-20 w-full max-w-md">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(79,124,255,0.35), rgba(139,124,246,0.25), rgba(52,211,153,0.25))",
            }}
          />
          <div className="relative rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-6 text-left shadow-xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-dashed border-[#0F1A3D]/15 pb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
                Tonight's Tab
              </span>
              <span className="rounded-full bg-[#34D399]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0E9F6E]">
                Settled
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <Row name="Alex" amount="$24.50" color="#4F7CFF" />
              <Row name="Jordan" amount="$24.50" color="#8B7CF6" />
              <Row name="Sam" amount="$24.50" color="#34D399" />
              <Row name="Riley" amount="$24.50" color="#0F1A3D" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#0F1A3D]/15 pt-3">
              <span className="text-xs font-medium text-[#0F1A3D]/60">
                Total split 4 ways
              </span>
              <span className="text-base font-bold">$98.00</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-[#0F1A3D]/50">
        © {new Date().getFullYear()} PitchIn — split bills, not friendships.
      </footer>
    </main>
  );
}
