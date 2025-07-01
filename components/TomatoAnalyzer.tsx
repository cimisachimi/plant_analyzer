// Filename: components/TomatoAnalyzer.tsx (Versi Modular)

'use client';

import { useState, useEffect } from 'react'; 
import type { PutBlobResult } from '@vercel/blob';
import { useSession } from 'next-auth/react';

// Impor komponen-komponen baru kita
import UploadForm from './UploadForm';
import AnalysisResultCard from './AnalysisResultCard';
import GuestLimitIndicator from './GuestLimitIndicator';
import HowToUseSection from './HowToUseSection';

// Definisikan tipe data hasil analisis
interface AnalysisResult { name: string; care: string; score: number; }

// Komponen Loading dan Error bisa kita definisikan di sini agar simpel
const LoadingIndicator = () => (
  <div className="mt-4 text-center">
    <p className="text-gray-700">Menganalisis gambar Anda... 🤖</p>
    <div className="mt-2 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mx-auto"></div>
  </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md text-center">
    {error}
  </div>
);


export default function TomatoAnalyzer() {
  // Semua state dan logika tetap berada di sini
  const { status } = useSession();
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const GUEST_LIMIT = 3;
  const [remainingUses, setRemainingUses] = useState(GUEST_LIMIT);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const usageCount = parseInt(localStorage.getItem('guestUsageCount') || '0');
      setRemainingUses(GUEST_LIMIT - usageCount);
    }
  }, [status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === 'unauthenticated' && remainingUses <= 0) {
      setError(`Anda telah mencapai batas analisis gratis. Silakan login untuk melanjutkan.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const file = (event.currentTarget.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      // Proses upload dan analisis tetap sama persis
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Gagal mengunggah file.');

      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);

      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newBlob.url }),
      });

      if (!analysisResponse.ok) throw new Error((await analysisResponse.json()).details || 'Gagal mendapatkan analisis dari server.');
      
      const analysisResult = await analysisResponse.json();
      setResult(analysisResult);

      if (status === 'unauthenticated') {
        const currentCount = parseInt(localStorage.getItem('guestUsageCount') || '0');
        const newCount = currentCount + 1;
        localStorage.setItem('guestUsageCount', newCount.toString());
        setRemainingUses(GUEST_LIMIT - newCount);
      }

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Terjadi kesalahan yang tidak terduga.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Bagian return sekarang menjadi sangat bersih dan mudah dibaca
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-green-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Tomato Disease Analyzer 🍅
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Unggah gambar daun tomat untuk mengidentifikasi potensi penyakit dan mendapatkan tips perawatan.
        </p>
        

        {status === 'unauthenticated' && (
          <GuestLimitIndicator remainingUses={remainingUses} limit={GUEST_LIMIT} />
        )}
        
        <UploadForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        {error && <ErrorDisplay error={error} />}
        {isLoading && <LoadingIndicator />}
        {result && blob && <AnalysisResultCard imageUrl={blob.url} result={result} />}
      </div>
      
      <HowToUseSection/>
      <footer className="w-full text-center p-8 mt-16 border-t">
        <p className="text-sm text-black">
          © {new Date().getFullYear()} Plant Analyzer. Dibuat sebagai Proyek Akhir.
        </p>
      </footer>
    </main>
  );
}