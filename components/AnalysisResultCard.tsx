// Filename: components/AnalysisResultCard.tsx

import Image from 'next/image';

interface AnalysisResult {
  name: string;
  care: string;
  score: number;
}

interface Props {
  imageUrl: string;
  result: AnalysisResult;
}

export default function AnalysisResultCard({ imageUrl, result }: Props) {
  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hasil Analisis</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Image
          src={imageUrl}
          alt="Uploaded tomato leaf"
          width={200}
          height={200}
          className="object-contain rounded-md shadow-md"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-700">{result.name}</h3>
          <p className="text-sm text-gray-500 mb-2">
            <strong>Keyakinan:</strong> {(result.score * 100).toFixed(2)}%
          </p>
          <p className="text-gray-600">
            <strong>Rekomendasi Perawatan:</strong> {result.care}
          </p>
        </div>
      </div>
    </div>
  );
}