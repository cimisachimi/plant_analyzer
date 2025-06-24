// Filename: components/UploadForm.tsx

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
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Menganalisis...' : 'Analisis Gambar'}
      </button>
    </form>
  );
}