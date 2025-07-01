// Filename: components/PhotoTipsSection.tsx

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
);

export default function PhotoTipsSection() {
    return (
<div className="w-full max-w-2xl mx-auto my-16 p-8 bg-white border rounded-xl shadow-sm">
  <h2 className="text-2xl font-bold text-black text-center mb-6">Tips untuk Hasil Terbaik</h2>
  <ul className="space-y-4">
    <li className="flex items-start gap-4">
      <CheckIcon />
      <p className="text-sm text-black">
        <strong>Fokus pada Daun:</strong> Pastikan daun yang memiliki gejala paling jelas menjadi fokus utama foto dan tidak buram.
      </p>
    </li>
    <li className="flex items-start gap-4">
      <CheckIcon />
      <p className="text-sm text-black">
        <strong>Pencahayaan Cukup:</strong> Ambil foto di tempat yang terang, hindari bayangan yang menutupi daun.
      </p>
    </li>
    <li className="flex items-start gap-4">
      <CheckIcon />
      <p className="text-sm text-black">
        <strong>Satu Daun per Foto:</strong> Untuk hasil paling akurat, fokuskan analisis pada satu daun dalam satu waktu.
      </p>
    </li>
  </ul>
</div>

    );
}