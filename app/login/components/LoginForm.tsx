"use client";

import { useState } from "react";
import { Eye, EyeOff, Field } from "../utility";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hook up to real auth here.
    console.log("Sign in attempt", { username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <Field
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(v) => setUsername(v)}
        placeholder="yourname"
        autoComplete="username"
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/60"
          >
            Password
          </label>
          <a
            href="#"
            className="text-xs font-medium text-[#4F7CFF] underline-offset-4 transition hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-xl border border-[#0F1A3D]/12 bg-white px-4 py-3 pr-11 text-sm text-[#0F1A3D] placeholder:text-[#0F1A3D]/35 transition focus:border-[#4F7CFF] focus:outline-none focus:ring-4 focus:ring-[#4F7CFF]/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#0F1A3D]/50 transition hover:text-[#0F1A3D]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#0F1A3D] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,26,61,0.6)] transition hover:translate-y-[-1px] hover:shadow-[0_14px_30px_-12px_rgba(79,124,255,0.55)]"
      >
        <span className="relative z-10">Sign in</span>
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-x-[-100%] bg-gradient-to-r from-[#4F7CFF] via-[#8B7CF6] to-[#4F7CFF] transition-transform duration-500 group-hover:translate-x-0"
        />
      </button>
    </form>
  );
}
