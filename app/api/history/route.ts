// Filename: app/api/history/route.ts (Tidak Perlu Diubah)

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';

// Gunakan Service Role Key karena ini adalah backend yang aman
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
  }

  try {
    const { data: history, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(history);

  } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  console.error('Error fetching history:', err);
  return NextResponse.json(
    { error: 'Gagal mengambil data riwayat.', details: errorMessage },
    { status: 500 }
  );
  }

}