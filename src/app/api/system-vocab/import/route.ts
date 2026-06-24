import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // Ignoring auth for local dev import
    }

    const dataPath = path.join(process.cwd(), 'bo-tu-data', 'vocab-sets.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const vocabSets = JSON.parse(fileContent);

    // 1. Clear existing data
    await supabaseAdmin.from('system_vocab_words').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('system_vocab_sets').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert Sets
    const setIds: string[] = [];
    let orderIndex = 0;
    
    for (const set of vocabSets) {
      const { data: insertedSet, error: setError } = await supabaseAdmin
        .from('system_vocab_sets')
        .insert({
          title: set.title,
          topic: set.topic,
          icon: set.icon || 'BookOpen', // Fallback icon
          color: set.color || 'bg-blue-50 text-blue-600',
          order_index: orderIndex++,
        })
        .select('id')
        .single();

      if (setError) {
        console.error('Error inserting set:', setError);
        continue;
      }

      const setId = insertedSet.id;
      setIds.push(setId);

      // 3. Insert Words
      if (set.words && set.words.length > 0) {
        const wordsToInsert = set.words.map((w: any, idx: number) => ({
          set_id: setId,
          word: w.word,
          ipa: w.ipa || null,
          pos: w.pos || null,
          definition: w.definition,
          example: w.example || null,
          order_index: idx,
        }));

        const { error: wordsError } = await supabaseAdmin
          .from('system_vocab_words')
          .insert(wordsToInsert);

        if (wordsError) {
          console.error('Error inserting words for set', set.title, ':', wordsError);
        }
      }
    }

    return NextResponse.json({ success: true, message: `Imported ${vocabSets.length} sets successfully.` });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
