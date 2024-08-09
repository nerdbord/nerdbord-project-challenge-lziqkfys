

import { ClerkLoading } from '@clerk/nextjs';
import { generateObject } from 'ai'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"><main>
    Hello, we will be testing Clerk and Drizzle ORM.
    <div>
      <ClerkLoading>
        <div>Loading......</div>
      </ClerkLoading>
    </div>
  </main></main>
  );
}
