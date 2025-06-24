import { useRef } from 'react';

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function UploadForm({ onSubmit, isLoading }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleOpenCamera = () => {
    cameraInputRef.current?.click();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Original file input (visible and preserved) */}
      <input
        name="file"
        type="file"
        required
        accept="image/*"
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors cursor-pointer"
      />

      {/* Hidden input specifically for opening the camera */}
      <input
        ref={cameraInputRef}
        type="file"
        name="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          // Auto-submit form when photo is taken
          if (e.target.files?.[0]) {
            e.target.form?.requestSubmit();
          }
        }}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Menganalisis...' : 'Unggah dari Galeri'}
        </button>

        <button
          type="button"
          onClick={handleOpenCamera}
          disabled={isLoading}
          className="w-full px-4 py-3 text-base font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Membuka Kamera...' : 'Ambil Foto'}
        </button>
      </div>
    </form>
  );
}
