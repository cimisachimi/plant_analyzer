import { headers } from 'next/headers';
import { auth } from "@/auth";
import { SignIn, SignOut } from "./AuthButtons";
import Link from 'next/link';

export default async function Header() {
  const session = await auth();
  
  const headersList = headers();
  const pathname = (await headersList).get('x-next-pathname') || '';

  const isHistoryActive = pathname === '/dashboard/history';
  
  return (
    <header className="bg-green-500 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">🍅</span>
          {/* Changed text color for better contrast on green */}
          <span className="text-white">Plant Analyzer</span>
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-green-100 hidden sm:block">
                {session.user.email}
              </p>
              
              {/* --- Button Style Applied Here --- */}
              <Link 
                href="/dashboard/history" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all shadow-sm ${
                  isHistoryActive 
                    ? 'bg-gray-200 text-green-700' // Active button style
                    : 'bg-white text-green-600 hover:bg-gray-100' // Default button style
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