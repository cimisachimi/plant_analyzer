import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export function SignIn() {
  return (
    <form action={async () => { "use server"; await signIn("google"); }}>
      <button 
        type="submit" 
        className="px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors bg-white text-green-600 hover:bg-gray-100"
      >
        Masuk dengan Google
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        revalidatePath("/");
        await signOut({ redirectTo: "/" });
      }}
    >
      {/* --- Updated with a subtle red on hover --- */}
      <button 
        type="submit" 
        className="px-3 py-2 rounded-md text-sm font-medium transition-all shadow-sm bg-white text-red-600 hover:bg-red-600 hover:text-white border border-red-200"
      >
        Keluar
      </button>
    </form>
  );
}