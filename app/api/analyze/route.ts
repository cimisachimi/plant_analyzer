// Filename: /api/analyze.ts

import { NextResponse } from 'next/server';
import { Client } from '@gradio/client';

// Mendefinisikan struktur hasil analisis akhir
interface AnalysisResult {
  name: string;
  care: string;
  score: number;
}

// --- UPDATED: Pemetaan data di sisi server untuk semua penyakit dalam Bahasa Indonesia ---
const getAnalysisDetails = (label: string, confidence: number): AnalysisResult => {
  // 'label' dari model Anda sekarang adalah string lengkap, misal, "A tomato leaf with Late Blight"
  
  const diseaseData: { [key: string]: { name: string; care: string } } = {
    'A tomato leaf with Early Blight': {
      name: 'Bercak Kering (Early Blight)',
      care: 'Buang dan musnahkan daun bagian bawah yang terinfeksi. Pastikan sirkulasi udara baik dan hindari penyiraman dari atas. Gunakan fungisida berbahan dasar tembaga atau klorotalonil.',
    },
    'A tomato leaf with Late Blight': {
      name: 'Busuk Daun (Late Blight)',
      care: 'Penyakit ini menyebar cepat. Segera cabut dan musnahkan tanaman yang terinfeksi. Pastikan jarak tanam cukup untuk sirkulasi udara. Fungisida (berbahan tembaga atau sistemik) diperlukan untuk pengendalian, terutama dalam kondisi basah dan sejuk.',
    },
    'A tomato leaf with Leaf Mold': {
      name: 'Embun Tepung (Leaf Mold)',
      care: 'Perbaiki sirkulasi udara dengan pemangkasan dan pengaturan jarak tanam. Kurangi kelembapan jika memungkinkan dan hindari membasahi daun. Varietas yang tahan adalah pertahanan terbaik. Gunakan fungisida jika parah.',
    },
    'A tomato leaf with Septoria Leaf Spot': {
      name: 'Bercak Daun Septoria',
      care: 'Buang dan musnahkan daun yang terinfeksi. Beri mulsa di sekitar pangkal tanaman untuk mencegah percikan tanah. Lakukan rotasi tanaman dan gunakan fungisida yang mengandung klorotalonil atau mankozeb.',
    },
    'A tomato leaf with Bacterial Spot': {
        name: 'Bercak Bakteri',
        care: 'Hindari penyiraman dari atas untuk mencegah penyebaran. Buang daun atau tanaman yang terinfeksi. Bakterisida berbahan dasar tembaga dapat memperlambat penyakit tetapi mungkin не bisa menghilangkannya. Jangan menyentuh tanaman saat basah.',
    },
    'A tomato leaf with Target Spot': {
        name: 'Bercak Target',
        care: 'Pangkas daun yang terinfeksi untuk meningkatkan sirkulasi udara. Siram di pangkal tanaman. Fungisida yang digunakan untuk Bercak Kering juga efektif untuk Bercak Target. Pastikan nutrisi tanaman tercukupi.',
    },
    'A tomato leaf with Tomato Yellow Leaf Curl Virus': {
      name: 'Virus Keriting Daun Kuning Tomat',
      care: 'Ini adalah infeksi virus yang disebarkan oleh kutu kebul. Tidak ada obatnya. Segera cabut dan musnahkan tanaman yang terinfeksi untuk mencegah penyebaran. Kendalikan populasi kutu kebul dengan mulsa reflektif atau insektisida.',
    },
    'A tomato leaf with Tomato Mosaic Virus': {
        name: 'Virus Mosaik Tomat',
        care: 'Tidak ada obat untuk virus ini. Cabut dan musnahkan tanaman yang terinfeksi untuk mencegah penyebarannya. Desinfeksi alat dan cuci tangan setelah menangani tanaman yang terinfeksi. Kendalikan populasi kutu daun karena mereka dapat menularkan virus.',
    },
    'A tomato leaf with Spider Mites Two-spotted Spider Mite': {
        name: 'Tungau Laba-laba (Two-spotted)',
        care: 'Ini adalah hama, bukan penyakit. Semprot daun dengan air bertekanan kuat, terutama di bagian bawah, untuk menjatuhkannya. Gunakan sabun insektisida atau minyak nimba untuk serangan yang lebih berat. Undang predator alami seperti kepik.',
    },
    'A healthy tomato leaf': {
      name: 'Daun Sehat',
      care: 'Daun tampak sehat. Lanjutkan praktik penyiraman yang baik, pastikan sinar matahari cukup, dan pantau terus tanda-tanda stres atau penyakit.',
    },
  };

  // 'label' itu sendiri sekarang menjadi kunci pencarian
  const details = diseaseData[label] || {
    name: label, // Jika tidak ditemukan, gunakan label aslinya
    care: 'Rekomendasi perawatan spesifik tidak ditemukan. Silakan berkonsultasi dengan ahli perkebunan setempat.',
  };

  return { ...details, score: confidence };
};


export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image from URL.' }, { status: 500 });
    }
    const imageBlob = await imageResponse.blob();

    const client = await Client.connect('chimithecat/plant_analyzer');
    const result = await client.predict('/predict', { image: imageBlob });

    if (Array.isArray(result.data) && result.data.length > 0) {
      const rawPrediction = result.data[0];
      const label = rawPrediction.label; // String lengkap, misal, "A tomato leaf with Late Blight"
      
      const confidenceObject = rawPrediction.confidences?.find(
          (c: { label: string; }) => c.label === label
      );
      const score = confidenceObject?.confidence ?? 0.95; 

      const finalResult = getAnalysisDetails(label, score);
      
      return NextResponse.json(finalResult);

    } else {
      throw new Error('Invalid prediction response from API.');
    }
  } catch (err) {
    console.error('Error in /api/analyze route:', err);
    return NextResponse.json(
      { error: 'Failed to get prediction.', details: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500 }
    );
  }
}