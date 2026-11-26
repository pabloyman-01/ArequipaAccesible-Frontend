import { writeFileSync } from 'node:fs';

const {
  API_BASE_URL,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: supabasePublishableKey,
} = process.env;

const api = new URL(API_BASE_URL ?? '');
const supabase = new URL(SUPABASE_URL ?? '');

if (
  api.protocol !== 'https:' ||
  api.username ||
  api.password ||
  api.search ||
  api.hash ||
  !/\/api\/?$/.test(api.pathname)
) {
  throw new Error('API_BASE_URL must be an HTTPS URL ending in /api.');
}

if (
  supabase.protocol !== 'https:' ||
  supabase.username ||
  supabase.password ||
  supabase.search ||
  supabase.hash ||
  supabase.pathname !== '/' ||
  !supabasePublishableKey?.startsWith('sb_publishable_')
) {
  throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
}

writeFileSync(
  new URL('../public/config.json', import.meta.url),
  JSON.stringify({
    apiBaseUrl: api.href.replace(/\/$/, ''),
    supabaseUrl: supabase.origin,
    supabasePublishableKey,
  }),
);
