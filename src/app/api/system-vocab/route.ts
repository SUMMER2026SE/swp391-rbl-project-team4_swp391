import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all sets, ordered by order_index
    const { data: sets, error: setsError } = await supabaseAdmin
      .from('system_vocab_sets')
      .select('*')
      .order('order_index', { ascending: true });

    if (setsError) {
      return NextResponse.json({ error: setsError.message }, { status: 500 });
    }

    // Fetch all words with pagination to bypass PostgREST max_rows limit
    let allWords: any[] = [];
    let hasMore = true;
    let page = 0;
    while (hasMore) {
      const { data: wordsPage, error: wordsError } = await supabaseAdmin
        .from('system_vocab_words')
        .select('*')
        .order('order_index', { ascending: true })
        .range(page * 1000, (page + 1) * 1000 - 1);

      if (wordsError) {
        return NextResponse.json({ error: wordsError.message }, { status: 500 });
      }

      if (wordsPage) {
        allWords = [...allWords, ...wordsPage];
        if (wordsPage.length < 1000) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }

    // Group words by set_id
    const setsWithWords = sets.map((set) => {
      return {
        ...set,
        words: allWords.filter((w) => w.set_id === set.id),
      };
    });

    return NextResponse.json({ success: true, data: setsWithWords });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
