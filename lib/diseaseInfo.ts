// Filename: lib/diseaseInfo.ts

// Definisikan struktur data agar bisa digunakan di tempat lain
export interface AnalysisResult {
  name: string;
  care: string;
  score: number;
}

// Fungsi ini dan datanya sekarang berada di file terpisah
export const getAnalysisDetails = (label: string, confidence: number): AnalysisResult => {
  const diseaseData: { [key: string]: { name: string; care: string } } = {
    'A tomato leaf with Early Blight': { name: 'Bercak Kering (Early Blight)', care: 'Buang dan musnahkan daun bagian bawah yang terinfeksi. Pastikan sirkulasi udara baik dan hindari penyiraman dari atas. Gunakan fungisida berbahan dasar tembaga atau klorotalonil.' },
    'A tomato leaf with Late Blight': { name: 'Busuk Daun (Late Blight)', care: 'Penyakit ini menyebar cepat. Segera cabut dan musnahkan tanaman yang terinfeksi. Pastikan jarak tanam cukup untuk sirkulasi udara. Gunakan fungisida berbahan tembaga atau sistemik.' },
    'A tomato leaf with Leaf Mold': { name: 'Embun Tepung (Leaf Mold)', care: 'Perbaiki sirkulasi udara dan hindari kelembapan berlebih. Gunakan fungisida jika parah.' },
    'A tomato leaf with Septoria Leaf Spot': { name: 'Bercak Daun Septoria', care: 'Buang daun terinfeksi, beri mulsa, dan gunakan fungisida seperti klorotalonil atau mankozeb.' },
    'A tomato leaf with Bacterial Spot': { name: 'Bercak Bakteri', care: 'Hindari penyiraman dari atas dan gunakan bakterisida berbasis tembaga.' },
    'A tomato leaf with Target Spot': { name: 'Bercak Target', care: 'Pangkas daun terinfeksi dan gunakan fungisida yang sesuai.' },
    'A tomato leaf with Tomato Yellow Leaf Curl Virus': { name: 'Virus Keriting Daun Kuning Tomat', care: 'Tidak ada obat. Cabut tanaman dan kendalikan kutu kebul.' },
    'A tomato leaf with Tomato Mosaic Virus': { name: 'Virus Mosaik Tomat', care: 'Musnahkan tanaman, desinfeksi alat, dan kendalikan kutu daun.' },
    'A tomato leaf with Spider Mites Two-spotted Spider Mite': { name: 'Tungau Laba-laba', care: 'Gunakan semprotan air, sabun insektisida, atau minyak nimba.' },
    'A healthy tomato leaf': { name: 'Daun Sehat', care: 'Lanjutkan praktik perawatan tanaman yang baik.' },
  };
  const details = diseaseData[label] || { name: label, care: 'Rekomendasi tidak ditemukan. Konsultasikan dengan ahli tanaman.' };
  return { ...details, score: confidence };
};