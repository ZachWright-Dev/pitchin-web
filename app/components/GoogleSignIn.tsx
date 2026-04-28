"use client";
import { login } from "@/lib/actions/auth"

export default function GoogleSignIn() {
  const handleClick = () => {
    login();
    console.log("Initiate Google OAuth flow");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-[#0F1A3D]/12 bg-white px-4 py-3 text-sm font-medium text-[#0F1A3D] shadow-sm transition hover:border-[#0F1A3D]/25 hover:bg-[#FAFBFF] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/40"
    >
      <GoogleIcon />
      <span>{"Continue with Google"}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}