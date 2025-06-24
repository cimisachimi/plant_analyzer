// Filename: components/AuthProvider.tsx

'use client'; // Sangat penting untuk menandainya sebagai Client Component

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Komponen ini hanya bertugas untuk merender SessionProvider agar bisa digunakan
  // di dalam Server Component (layout.tsx)
  return <SessionProvider>{children}</SessionProvider>;
}