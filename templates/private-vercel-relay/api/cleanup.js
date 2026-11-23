import { del } from '@vercel/blob';
import { json, requireRelaySecret } from './_relay.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Method not allowed' });
  if (!requireRelaySecret(request, response)) return;
  const { pathnames } = request.body || {};
  if (!Array.isArray(pathnames) || !pathnames.every(pathname => /^uploads\/[a-z0-9-]+\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(pathname))) return json(response, 400, { error: 'Invalid cleanup paths.' });
  try { await del(pathnames); json(response, 200, { deleted: pathnames.length }); }
  catch (error) { console.error('relay cleanup failed', error); json(response, 500, { error: 'Private relay cleanup failed.' }); }
}
