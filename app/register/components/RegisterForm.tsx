"use client";

import { useState } from "react";
import { Eye, EyeOff } from "@/app/login/utility";
import { Field } from "@/app/login/utility";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register attempt", { firstName, lastName, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field
          id="firstName"
          label="First Name"
          type="text"
          value={firstName}
          onChange={setFirstName}
          placeholder="Jane"
          autoComplete="given-name"
        />
        <Field
          id="lastName"
          label="Last Name"
          type="text"
          value={lastName}
          onChange={setLastName}
          placeholder="Doe"
          autoComplete="family-name"
        />
      </div>

      <Field
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="jane@example.com"
        autoComplete="email"
      />

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/60"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
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
        <span className="relative z-10">Create account</span>
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-x-[-100%] bg-gradient-to-r from-[#4F7CFF] via-[#8B7CF6] to-[#4F7CFF] transition-transform duration-500 group-hover:translate-x-0"
        />
      </button>
    </form>
  );
}
