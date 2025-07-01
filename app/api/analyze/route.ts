// Filename: app/api/analyze/route.ts (Versi Final untuk Deployment)

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';
import { Client } from '@gradio/client';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AnalysisResult {
  name: string;
  care: string;
  score: number;
}

const CONFIDENCE_THRESHOLD = 0.5;

const getAnalysisDetails = (label: string, confidence: number): AnalysisResult => {
  const diseaseData: { [key: string]: { name: string; care: string } } = {
    'A tomato leaf with Early Blight': {
      name: 'Bercak Kering (Early Blight)',
      care: 'Segera buang daun bagian bawah yang terinfeksi. Pastikan sirkulasi udara baik dengan memangkas cabang yang tidak perlu. Hindari penyiraman dari atas daun, siram langsung ke tanah. Untuk pengendalian, gunakan fungisida berbahan dasar tembaga (organik) atau klorotalonil.'
    },
    'A tomato leaf with Late Blight': {
      name: 'Busuk Daun (Late Blight)',
      care: 'Penyakit ini sangat berbahaya dan menyebar cepat. Segera cabut dan musnahkan (bakar) seluruh tanaman yang terinfeksi untuk mencegah penyebaran. Untuk perlindungan, semprot tanaman sehat di sekitarnya dengan fungisida sistemik atau yang mengandung tembaga, terutama saat cuaca lembab dan sejuk.'
    },
    'A tomato leaf with Leaf Mold': {
      name: 'Embun Tepung (Leaf Mold)',
      care: 'Penyakit ini menyukai kelembapan tinggi. Perbaiki sirkulasi udara secara drastis dengan pemangkasan. Turunkan kelembapan (jika di dalam greenhouse) dan hindari membasahi daun. Gunakan fungisida jika serangan sudah parah. Menanam varietas yang tahan adalah pencegahan terbaik.'
    },
    'A tomato leaf with Septoria Leaf Spot': {
      name: 'Bercak Daun Septoria',
      care: 'Buang dan hancurkan semua daun yang terinfeksi. Beri mulsa jerami di sekitar pangkal tanaman untuk mengurangi percikan spora jamur dari tanah. Lakukan rotasi tanaman setiap tahun. Gunakan fungisida yang mengandung klorotalonil atau mankozeb.'
    },
    'A tomato leaf with Bacterial Spot': {
      name: 'Bercak Bakteri',
      care: 'Penyakit bakteri sulit diobati. Hindari penyiraman dari atas. Jangan menyentuh atau bekerja di kebun saat tanaman basah untuk mencegah penyebaran. Semprotan bakterisida berbasis tembaga dapat membantu memperlambat, tetapi tidak akan menyembuhkan infeksi.'
    },
    'A tomato leaf with Target Spot': {
      name: 'Bercak Target',
      care: 'Mirip dengan Bercak Kering. Pangkas daun yang terinfeksi untuk meningkatkan sirkulasi udara dan mengurangi sumber spora. Pastikan nutrisi tanaman, terutama kalium, tercukupi. Gunakan fungisida yang sama seperti untuk Bercak Kering jika diperlukan.'
    },
    'A tomato leaf with Tomato Yellow Leaf Curl Virus': {
      name: 'Virus Keriting Daun Kuning Tomat',
      care: 'Tidak ada obat untuk virus ini. Tanaman yang terinfeksi harus segera dicabut dan dimusnahkan untuk mencegah penyebaran. Fokus utama adalah pada pencegahan dengan mengendalikan serangga vektornya, yaitu kutu kebul (whitefly), menggunakan insektisida atau perangkap lengket.'
    },
    'A tomato leaf with Tomato Mosaic Virus': {
      name: 'Virus Mosaik Tomat',
      care: 'Tidak ada obat. Segera musnahkan tanaman yang terinfeksi. Virus ini sangat mudah menular melalui sentuhan, jadi selalu desinfeksi alat (gunting, sarung tangan) dan cuci tangan setelah memegang tanaman sakit. Kendalikan kutu daun yang bisa menjadi vektor.'
    },
    'A tomato leaf with Spider Mites Two-spotted Spider Mite': {
      name: 'Tungau Laba-laba (Hama)',
      care: 'Ini adalah hama, bukan penyakit. Periksa bagian bawah daun untuk jaring halus. Semprot dengan air bertekanan kuat untuk menjatuhkan mereka. Jika parah, gunakan sabun insektisida atau minyak nimba (neem oil). Mendorong predator alami seperti kepik juga sangat membantu.'
    },
    'A healthy tomato leaf': {
      name: 'Daun Sehat',
      care: 'Kondisi tanaman Anda tampak prima. Lanjutkan praktik perawatan yang baik seperti penyiraman yang konsisten di pangkal tanaman, pemupukan seimbang, dan pastikan mendapat sinar matahari yang cukup. Tetap waspada terhadap gejala awal penyakit.'
    },
  };

  const details = diseaseData[label] || {
    name: label,
    care: 'Rekomendasi tidak ditemukan. Konsultasikan dengan ahli tanaman.'
  };

  return { ...details, score: confidence };
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = cookies();

  // LANGKAH 1: PEMERIKSAAN IZIN UNTUK PENGGUNA TAMU
  if (!userId) {
    const usage = parseInt((await cookieStore).get('anonymous_submissions')?.value || '0');
    if (usage >= 3) {
      return NextResponse.json(
        { error: 'Batas penggunaan untuk pengguna anonim tercapai. Silakan login untuk lanjut.' },
        { status: 403 }
      );
    }
  }

  // LANGKAH 2: PROSES UTAMA
  try {
    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Gagal mengunduh gambar dari URL.' }, { status: 500 });
    }
    const imageBlob = await imageResponse.blob();

    const client = await Client.connect('chimithecat/plant_analyzer');
    const prediction = await client.predict('/predict', { image: imageBlob });

    if (Array.isArray(prediction.data) && prediction.data.length > 0) {
      const label = prediction.data[0].label;
      const confidence = prediction.data[0].confidences?.find(
        (c: { label: string }) => c.label === label
      )?.confidence ?? 0;

      let finalResult = getAnalysisDetails(label, confidence);

      // CEK CONFIDENCE < 50%
      if (confidence < CONFIDENCE_THRESHOLD) {
        finalResult = {
          name: 'Bukan gambar daun',
          care: 'Bukan gambar daun tomat silahkan upload lagi',
          score: confidence,
        };
      }

      const response = NextResponse.json(finalResult);

      // LANGKAH 3: SIMPAN KE DATABASE JIKA LOGIN
      if (userId) {
        await supabase.from('analysis_history').insert({
          user_id: userId,
          image_url: imageUrl,
          disease_name: finalResult.name,
          score: finalResult.score,
          care_instructions: finalResult.care,
        });
      } else {
        const currentUsage = parseInt((await cookieStore).get('anonymous_submissions')?.value || '0');
        response.cookies.set('anonymous_submissions', String(currentUsage + 1), {
          maxAge: 60 * 60 * 24 * 7, // 7 hari
        });
      }

      return response;
    } else {
      throw new Error('Model tidak mengembalikan hasil.');
    }
  } catch (err) {
    console.error('Error in analyze route:', err);
    return NextResponse.json(
      {
        error: 'Gagal mendapatkan analisis.',
        details: err instanceof Error ? err.message : JSON.stringify(err),
      },
      { status: 500 }
    );
  }
}
