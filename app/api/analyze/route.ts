// app/api/analyze/route.ts

import { NextResponse } from 'next/server';
import { diseaseData, DiseaseInfo } from '@/lib/disease-info';

const MODEL_API_URL = 'https://api-inference.huggingface.co/wellCh4n/tomato-leaf-disease-classification-resnet50';

interface Prediction {
  label: string;
  score: number;
}

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
    }

    // 1. Fetch the image data from the public Vercel Blob URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
       throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }
    const imageBlob = await imageResponse.blob();

    // 2. Send the image to the Hugging Face API
    const hfResponse = await fetch(MODEL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': imageBlob.type,
      },
      body: imageBlob,
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('Hugging Face API Error:', errorText);
      return NextResponse.json({ error: 'Failed to analyze image.', details: errorText }, { status: 500 });
    }

    const predictions: Prediction[] = await hfResponse.json();

    if (!predictions || predictions.length === 0) {
      throw new Error('Received invalid prediction data from model.');
    }

    // 3. Find the prediction with the highest score
    const bestPrediction = predictions.reduce((prev, current) => (prev.score > current.score) ? prev : current);

    // 4. Get the corresponding disease information
    const result: DiseaseInfo = diseaseData[bestPrediction.label] || {
      name: 'Unknown Condition',
      care: 'Could not identify the condition from the image. Please try a clearer picture or consult a local expert.',
    };

    // 5. Return the result along with the top prediction score
    return NextResponse.json({ ...result, score: bestPrediction.score });

  } catch (error: unknown) {
    console.error('Analysis API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An internal server error occurred.' }, { status: 500 });
  }
}