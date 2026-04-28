import Link from "next/link";
import GoogleSignIn from "@/app/components/GoogleSignIn";
import LoginForm from "@/app/login/components/LoginForm";
import { LogoMark } from "@/app/login/utility/index";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFBFF] px-4 py-10 text-[#0F1A3D]">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #4F7CFF 0%, rgba(79,124,255,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #8B7CF6 0%, rgba(139,124,246,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-20 h-[300px] w-[300px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #34D399 0%, rgba(52,211,153,0) 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0F1A3D 1px, transparent 1px), linear-gradient(90deg, #0F1A3D 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Soft glow behind card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(79,124,255,0.25), rgba(139,124,246,0.18), rgba(52,211,153,0.18))",
          }}
        />

        <div className="relative rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-8 shadow-xl backdrop-blur-md">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1A3D] shadow-lg">
              <LogoMark />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[#0F1A3D]/60">
              Sign in to your{" "}
              <span className="font-semibold">
                <span className="text-[#0F1A3D]">Pitch</span>
                <span className="text-[#4F7CFF]">In</span>
              </span>{" "}
              account
            </p>
          </div>

          <LoginForm />

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#0F1A3D]/10" />
            <span className="text-xs font-medium uppercase tracking-wider text-[#0F1A3D]/40">
              or
            </span>
            <span className="h-px flex-1 bg-[#0F1A3D]/10" />
          </div>

          {/* Google OAuth */}
          <GoogleSignIn />

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-[#0F1A3D]/65">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#4F7CFF] underline-offset-4 transition hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-[#0F1A3D]/50 transition hover:text-[#0F1A3D]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
