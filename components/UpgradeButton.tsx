// Filename: components/UpgradeButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsLoading(true);
    // Kita akan membuat API route ini di langkah berikutnya
    await fetch('/api/user/activate-premium', { method: 'POST' });
    setIsLoading(false);
    // Refresh halaman untuk melihat status baru
    router.refresh();
  };

  return (
    <button onClick={handleUpgrade} disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
      {isLoading ? 'Memproses...' : 'Aktifkan Uji Coba Premium'}
    </button>
  );
}