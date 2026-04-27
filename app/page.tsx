"use server"
import { auth } from "@/app/auth";
import { SignInButton } from "@/app/components/sign-in-button";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <p> You are not signed In</p>
      <SignInButton/>
    </div>
  );
}
