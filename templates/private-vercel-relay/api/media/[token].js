import { get } from '@vercel/blob';
import { Readable } from 'node:stream';
import { mediaToken } from '../_relay.js';

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.setHeader('Allow', 'GET, HEAD'); return response.status(405).end(); }
  const signed = mediaToken(request.query.token);
  if (!signed) return response.status(404).end();
  try {
    const result = await get(signed.pathname, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return response.status(404).end();
    response.status(200);
    response.setHeader('Content-Type', result.blob.contentType);
    response.setHeader('Content-Length', result.blob.size);
    response.setHeader('Content-Disposition', 'inline');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'public, max-age=1800');
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (request.method === 'HEAD') return response.end();
    Readable.fromWeb(result.stream).pipe(response);
  } catch (error) { console.error('signed media fetch failed', error); response.status(404).end(); }
}
