// Filename: app/dashboard/history/page.tsx (Versi Lengkap dan Final)

import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Inisialisasi Supabase client. Sebaiknya gunakan Service Role Key di sini
// karena halaman ini adalah Server Component dan tidak akan terekspos ke klien.
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function HistoryPage() {
  // 1. Pemeriksaan Sesi: Pastikan pengguna sudah login
  const session = await auth();
  if (!session?.user?.id) {
    // Jika belum login, arahkan ke halaman login
    redirect('/api/auth/signin');
  }

  // 2. Pemeriksaan Status Premium: Ambil profil pengguna dari database
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', session.user.id)
    .single();

  // Jika pengguna bukan 'premium', arahkan mereka ke halaman profil untuk upgrade
  if (profile?.subscription_status !== 'premium') {
    redirect('/dashboard/profile');
  }
  
  // 3. Pengambilan Data Riwayat: Kode ini hanya akan berjalan jika pengguna adalah premium
  const { data: history, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('user_id', session.user.id) // Ambil data hanya untuk pengguna ini
    .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

  // Tampilkan pesan error jika pengambilan data gagal
  if (error) {
    return <p className="container mx-auto p-8 text-red-500">Gagal memuat riwayat: {error.message}</p>;
  }

  // 4. Tampilkan Hasil (JSX)
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Riwayat Analisis Anda</h1>
        <Link href="/" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
          Analisis Baru
        </Link>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Anda belum memiliki riwayat analisis.</p>
          <p className="text-sm text-gray-400 mt-2">Setiap analisis yang Anda lakukan akan tersimpan di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <Image 
                src={item.image_url} 
                alt={item.disease_name} 
                width={80} 
                height={80} 
                className="rounded-md object-cover bg-gray-100" 
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.disease_name}</h2>
                <p className="text-sm text-gray-600">
                  Keyakinan: <span className="font-medium">{(item.score * 100).toFixed(2)}%</span>
                </p>
              </div>
              <p className="text-xs text-gray-400 self-start">
                {new Date(item.created_at).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}