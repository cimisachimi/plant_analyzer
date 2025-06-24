// Filename: components/GuestLimitIndicator.tsx

import Link from 'next/link'; // <-- LANGKAH 1: Impor Link

interface Props {
  remainingUses: number;
  limit: number;
}

export default function GuestLimitIndicator({ remainingUses, limit }: Props) {
  return (
    <div className="text-center text-sm text-gray-600 bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
      Sisa analisis gratis Anda: <strong>{remainingUses > 0 ? remainingUses : 0}/{limit}</strong>.
      {/* LANGKAH 2: Ganti <a> menjadi <Link> */}
      <Link href="/api/auth/signin" className="font-bold text-green-700 ml-1 hover:underline">
        Login
      </Link> untuk analisis tanpa batas.
    </div>
  );
}