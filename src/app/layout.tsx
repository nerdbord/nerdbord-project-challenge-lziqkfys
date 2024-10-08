import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { DynamicFormProvider } from "@/context/DynamicFormContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Formatrix",
  description: "Create your fantastical forms with AI!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Container>
            <DynamicFormProvider>
              <header className="sticky top-0 flex h-16 items-center justify-between gap-4 bg-background px-4 md:px-6 border-b z-10">
                <Button variant="outline">
                  <a href="/">Formatrix</a>
                </Button>
                <SignedOut>
                  <div className="flex gap-4">
                    <Button className="min-w-36">
                      <SignInButton>Zaloguj</SignInButton>
                    </Button>
                    <Button variant="outline" className="min-w-36">
                      <SignUpButton>Zarejestruj się</SignUpButton>
                    </Button>
                  </div>
                </SignedOut>
                <SignedIn>
                  <Button variant="outline">
                    <a href="/forms">Panel użytkownika</a>
                  </Button>
                </SignedIn>
              </header>
              <Toaster />
              <main className="flex justify-center">
                <div className="max-w-[1440px]">{children}</div>
              </main>
            </DynamicFormProvider>
            <Footer />
          </Container>
        </body>
      </html>
    </ClerkProvider>
  );
}
