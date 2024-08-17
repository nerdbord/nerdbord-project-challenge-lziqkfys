"use client";
import CogIcon from "@/components/icons/CogIcon";
import ForwardIcon from "@/components/icons/ForwardIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ClerkProvider,
  RedirectToUserProfile,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { auth, User } from "@clerk/nextjs/server";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

export default function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [redirect, setRedirect] = useState(false)
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="mr-8">
        <div className="flex flex-row my-10 ml-6 gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
            <AvatarFallback>{user?.username || ""}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl mb-2">
              {user?.firstName} {user?.lastName?.slice(0, 1)}
            </h2>
            <h3>{user?.primaryEmailAddress?.emailAddress || ""}</h3>
          </div>
        </div>
        <div className="ml-6 mt-6">
          <h4 className=" font-semibold mb-4">Panel użytkownika</h4>
          <Button className="rounded-none gap-2 w-full flex flex-row justify-start">
            <ForwardIcon />
            Zapisane formularze
          </Button>
            <Button
              variant="outline"
              className="rounded-none gap-2 w-full flex flex-row justify-start"
              onClick={() => {setRedirect(true)}}
            >
              <CogIcon />
              Ustawienia konta
              {redirect && <RedirectToUserProfile/>}
            </Button>
          <SignOutButton>
            <Button
              variant="outline"
              className="rounded-none gap-2 w-full flex flex-row justify-start"
            >
              <LogoutIcon />
              Wyloguj się
            </Button>
          </SignOutButton>
        </div>
      </div>
      {children}
    </div>
  );
}
