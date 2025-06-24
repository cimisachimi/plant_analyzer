import { useRef, useState } from 'react';

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function UploadForm({ onSubmit, isLoading }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload'>('upload');

  const handleButtonClick = (mode: 'camera' | 'upload') => {
    setCaptureMode(mode);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => handleButtonClick('camera')}
          className="w-1/2 px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
        >
          Ambil Foto
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick('upload')}
          className="w-1/2 px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition"
        >
          Unggah Gambar
        </button>
      </div>

      <input
        ref={fileInputRef}
        name="file"
        type="file"
        accept="image/*"
        capture={captureMode === 'camera' ? 'environment' : undefined}
        required
        className="hidden"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 px-4 py-3 text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Menganalisis...' : 'Analisis Gambar'}
      </button>
    </form>
  );
}
