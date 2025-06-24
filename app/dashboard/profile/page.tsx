// Filename: app/dashboard/profile/page.tsx

import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import UpgradeButton from '@/components/UpgradeButton'; // Komponen baru yang akan kita buat

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  // Ambil data profil dari database, termasuk status langganan
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
      <p className="mb-4">Email: {session.user.email}</p>
      <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300">
        <p className="font-semibold">Status Akun Anda: 
          <span className="font-bold uppercase text-yellow-800"> {profile?.subscription_status || 'Gratis'}</span>
        </p>
        {profile?.subscription_status !== 'premium' && (
          <div className="mt-4">
            <p className="mb-2">Upgrade ke Premium untuk menyimpan riwayat analisis tanpa batas!</p>
            <UpgradeButton />
          </div>
        )}
      </div>
    </div>
  );
}