import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL  || '';
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const SUPABASE_READY = Boolean(url && key && url !== 'https://YOUR_PROJECT_ID.supabase.co');

export const supabase = SUPABASE_READY
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

// ── Storage helpers ────────────────────────────────────────────────────────────
const BUCKET = 'velora-media';

/**
 * Upload a file to Supabase Storage and return its public URL.
 * @param {File}   file
 * @param {string} folder  e.g. 'products' | 'logos'
 * @returns {Promise<string|null>}
 */
export async function uploadFile(file, folder = 'products') {
  if (!supabase) return null;
  const ext  = file.name.split('.').pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) { console.error('uploadFile:', error); return null; }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

/** Delete a file by its public URL */
export async function deleteFile(publicUrl) {
  if (!supabase || !publicUrl) return;
  const path = publicUrl.split(`${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
