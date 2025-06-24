// Filename: components/UploadForm.tsx

// Kita tidak perlu mengimpor apa pun di sini karena kita menggunakan JSX standar

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function UploadForm({ onSubmit, isLoading }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <input
        name="file"
        type="file"
        required
        accept="image/*"
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors cursor-pointer"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 px-4 py-3 text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Menganalisis...' : 'Analisis Gambar'}
      </button>
    </form>
  );
}