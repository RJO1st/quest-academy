import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // NO "NEXT_PUBLIC" HERE

    if (!url || !key) {
      console.error("Missing Env Vars");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { code } = await request.json();
    
    // Initialize Admin Client (Bypasses Row Level Security)
    const supabaseAdmin = createClient(url, key);

    const { data, error } = await supabaseAdmin
      .from('scholars')
      .select('id, name, year, total_xp')
      .eq('access_code', code)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Scholar code not found' }, { status: 404 });
    }

    return NextResponse.json({ scholar: data }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}