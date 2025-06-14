import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

// nanoid is a great way to create short, unique, URL-friendly IDs
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
);

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const file = request.body;
  const originalFilename = searchParams.get('filename');

  if (!originalFilename || !file) {
    return NextResponse.json({ error: 'No filename or file body provided.' }, { status: 400 });
  }

  // To prevent filename conflicts or issues with special characters,
  // it's a good practice to generate a unique filename.
  const fileExtension = originalFilename.split('.').pop() || 'tmp';
  const uniqueFilename = `${nanoid()}.${fileExtension}`;

  try {
    console.log(`Attempting to upload: ${originalFilename} as ${uniqueFilename}`);

    const blob = await put(uniqueFilename, file, {
      access: 'public',
      // You can add additional metadata if needed
      // addRandomSuffix: false, // We've created our own unique name
    });

    console.log('Upload successful. Blob object:', JSON.stringify(blob, null, 2));

    return NextResponse.json(blob);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during blob upload:', error);
      return NextResponse.json({ error: 'Failed to upload file.', details: error.message }, { status: 500 });
    }
    // Handle non-Error objects
    console.error('An unknown error occurred during blob upload:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}