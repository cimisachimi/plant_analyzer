// Filename: auth.ts (Versi Final yang Diperbaiki)

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"
import type { NextAuthConfig } from "next-auth"

// Inisialisasi Supabase Client tetap sama
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Callback 'jwt' sekarang menjadi otak dari logika database kita
    async jwt({ token, user, account }) {
      // Bagian ini hanya berjalan saat pertama kali user login dengan Google
      if (account && user) {
        try {
          // Mencari atau membuat user di tabel 'users' kita
          const { data: dbUser, error: userError } = await supabase
            .from('users')
            .upsert({
              name: user.name,
              email: user.email,
              image: user.image,
            }, { onConflict: 'email' })
            .select('id') // Ambil ID dari database
            .single();

          if (userError) throw userError;
          if (!dbUser) throw new Error("Gagal membuat atau menemukan pengguna di database.");

          // Mencari atau membuat akun tertaut di tabel 'accounts'
          await supabase
            .from('accounts')
            .upsert({
              userId: dbUser.id, // Gunakan ID dari database
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
            });
          
          // --- INI BAGIAN KUNCI ---
          // Masukkan ID dari database Supabase (UUID) ke dalam token sesi
          token.id = dbUser.id;
          
        } catch (error) {
          console.error("Error selama sinkronisasi database di callback JWT:", error);
          // Mengembalikan token tanpa ID jika terjadi error agar login tetap gagal
          return {}; 
        }
      }
      
      // Untuk permintaan selanjutnya, token sudah berisi ID yang benar
      return token;
    },
    
    // Callback 'session' tidak perlu diubah, tugasnya hanya menyalin data dari token
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)