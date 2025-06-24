// Filename: components/Header.tsx
import { auth } from "@/auth"
import { SignIn, SignOut } from "./AuthButtons"

export default async function Header() {
  const session = await auth()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-lg font-bold">
          Tomato Analyzer
        </h1>
        <nav>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600 hidden sm:block">{session.user.email}</p>
              <SignOut />
            </div>
          ) : (
            <SignIn />
          )}
        </nav>
      </div>
    </header>
  )
}