// next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    userId: string; // Add userId to the session type
  }

  interface User {
    id: string; // Ensure User has an id property
  }
}
