'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PutBlobResult } from '@vercel/blob';

// Define the structure of our analysis result
interface AnalysisResult {
  name: string;
  care: string;
  score: number;
}

export default function AvatarUploadPage() {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const file = (event.currentTarget.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Upload the file to Vercel Blob - now with encoding
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        },
      );

      // CRITICAL FIX: Check if the upload was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file.');
      }

      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);

      // 2. Call our analysis API with the new blob's URL
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newBlob.url }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.details || 'Failed to get analysis from the server.');
      }

      const analysisResult = await analysisResponse.json();
      setResult(analysisResult);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-green-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Tomato Disease Analyzer 🍅
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Upload an image of a tomato leaf to identify potential diseases and get care tips.
        </p>

        <form onSubmit={handleSubmit}>
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
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </form>

        {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md text-center">Error: {error}</div>}

        {isLoading && (
          <div className="mt-4 text-center">
            <p className="text-gray-700">Analyzing your image... 🤖</p>
            <div className="mt-2 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mx-auto"></div>
          </div>
        )}
        
        {result && blob && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Result</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Image
                src={blob.url}
                alt="Uploaded tomato leaf"
                width={200}
                height={200}
                className="object-contain rounded-md shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-700">{result.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Confidence:</strong> {(result.score * 100).toFixed(2)}%
                </p>
                <p className="text-gray-600">
                  <strong>Recommended Care:</strong> {result.care}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}