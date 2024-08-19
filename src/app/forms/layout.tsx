"use client";
import CogIcon from "@/components/icons/CogIcon";
import ForwardIcon from "@/components/icons/ForwardIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RedirectToUserProfile, SignOutButton, useUser } from "@clerk/nextjs";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

export default function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [redirect, setRedirect] = useState(false);
  return (
    <div className="relative min-h-screen w-full md:flex lg:flex">
      {/* Sidebar */}
      <div className="fixed top-8 left-0 z-5 h-screen w-64 border-r bg-white p-6 md:w-80 lg:w-96">
        <div className="flex flex-row my-10 gap-4">
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
        <div>
          <h4 className="font-semibold mb-4">Panel użytkownika</h4>
          <Button className="rounded-none gap-2 w-full flex flex-row justify-start">
            <ForwardIcon />
            Zapisane formularze
          </Button>
          <Button
            variant="outline"
            className="rounded-none gap-2 w-full flex flex-row justify-start mt-4"
            onClick={() => {
              setRedirect(true);
            }}
          >
            <CogIcon />
            Ustawienia konta
            {redirect && <RedirectToUserProfile />}
          </Button>
          <SignOutButton>
            <Button
              variant="outline"
              className="rounded-none gap-2 w-full flex flex-row justify-start mt-4"
            >
              <LogoutIcon />
              Wyloguj się
            </Button>
          </SignOutButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 md:ml-80 lg:ml-96 p-6 flex-1">
        {children}
      </div>
    </div>
  );
}


{/* <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] z-40">
<div className="pr-8 border-r ">
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
      onClick={() => {
        setRedirect(true);
      }}
    >
      <CogIcon />
      Ustawienia konta
      {redirect && <RedirectToUserProfile />}
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
</div> */}