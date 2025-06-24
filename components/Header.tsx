// Filename: components/Header.tsx

import { headers } from 'next/headers'; // <-- 1. Impor fungsi 'headers'
import { auth } from "@/auth";
import { SignIn, SignOut } from "./AuthButtons";
import Link from 'next/link';

export default async function Header() {
  const session = await auth();
  
  // 2. Dapatkan path URL saat ini dari headers
  const headersList = headers();
  const pathname = (await headersList).get('x-next-pathname') || '';

  // 3. Cek apakah kita sedang berada di halaman riwayat
  const isHistoryActive = pathname === '/dashboard/history';
  
  return (
    <header className="bg-green-500 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">🍅</span>
          <span className="text-foreground">Plant Analyzer</span>
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground hidden sm:block">
                {session.user.email}
              </p>
              
              {/* 4. Terapkan class secara kondisional */}
              <Link 
                href="/dashboard/history" 
                className={`text-sm font-medium transition-colors ${
                  isHistoryActive 
                    ? 'text-primary' // Style jika aktif
                    : 'text-muted-foreground hover:text-primary' // Style jika tidak aktif
                }`}
              >
                Riwayat
              </Link>
              
              <SignOut />
            </div>
          ) : (
            <SignIn />
          )}
        </nav>
      </div>
    </header>
  );
}