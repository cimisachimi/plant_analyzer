// Filename: components/AuthButtons.tsx
import { signIn, signOut } from "@/auth"
import { revalidatePath } from "next/cache"; // <-- 1. Impor di sini

export function SignIn() {
  return (
    <form action={async () => { "use server"; await signIn("google") }}>
      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Masuk dengan Google
      </button>
    </form>
  )
}

export function SignOut() {
  return (
        <form
      action={async () => {
        "use server";
        
        // 2. Perintahkan untuk membersihkan cache halaman utama ('/')
        revalidatePath("/");
        
        // 3. Lanjutkan dengan logout dan redirect
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
        Keluar
      </button>
    </form>
  )
}