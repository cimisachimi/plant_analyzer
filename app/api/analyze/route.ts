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

interface AnalysisResult { name: string; care: string; score: number; }
const getAnalysisDetails = (label: string, confidence: number): AnalysisResult => {
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

  // LANGKAH 2: PROSES UTAMA (semua logika ada di sini)
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
      const confidence = prediction.data[0].confidences?.find((c: { label: string }) => c.label === label)?.confidence ?? 0;
      const finalResult = getAnalysisDetails(label, confidence);

      // LANGKAH 3: BUAT RESPONS DAN TAMBAHKAN LOGIKA SETELAH ANALISIS
      
      // Buat respons JSON terlebih dahulu
      const response = NextResponse.json(finalResult);

      // Jika pengguna login, simpan ke riwayat
      if (userId) {
        await supabase.from('analysis_history').insert({
          user_id: userId, image_url: imageUrl, disease_name: finalResult.name,
          score: finalResult.score, care_instructions: finalResult.care,
        });
      } 
      // Jika pengguna adalah tamu, perbarui cookie mereka
      else {
        const currentUsage = parseInt((await cookieStore).get('anonymous_submissions')?.value || '0');
        response.cookies.set('anonymous_submissions', String(currentUsage + 1), {
          maxAge: 60 * 60 * 24 * 7, // Cookie berlaku selama 7 hari
        });
      }
      
      // Kembalikan satu respons tunggal yang sudah lengkap
      return response;

    } else {
      throw new Error('Model tidak mengembalikan hasil.');
    }
  } catch (err) {
    console.error('Error in analyze route:', err);
    return NextResponse.json(
      { error: 'Gagal mendapatkan analisis.', details: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500 }
    );
  }
}