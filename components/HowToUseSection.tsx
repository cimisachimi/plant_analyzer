// Filename: components/HowToUseSection.tsx

export default function HowToUseSection() {
  return (
<div className="w-full max-w-4xl mx-auto my-16 text-center">
  <h2 className="text-3xl font-bold text-gray-900 mb-2">Sangat Mudah Digunakan</h2>
  <p className="text-gray-600 mb-8">Hanya dalam 3 langkah sederhana.</p>
  <div className="grid md:grid-cols-3 gap-8">
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 text-green-600 font-bold text-2xl border-2 border-green-200">1</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">Ambil Foto</h3>
      <p className="text-sm text-gray-600">Gunakan kamera ponsel Anda atau pilih gambar daun dari galeri.</p>
    </div>
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 text-green-600 font-bold text-2xl border-2 border-green-200">2</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">Analisis Gambar</h3>
      <p className="text-sm text-gray-600">Klik tombol analisis dan biarkan AI kami bekerja menganalisis penyakitnya.</p>
    </div>
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 text-green-600 font-bold text-2xl border-2 border-green-200">3</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">Dapatkan Solusi</h3>
      <p className="text-sm text-gray-600">Dapatkan diagnosis dan rekomendasi perawatan dalam hitungan detik.</p>
    </div>
  </div>
</div>


  );
}