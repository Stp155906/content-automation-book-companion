import { put } from '@vercel/blob';
import { Readable } from 'node:stream';
import sharp from 'sharp';
import { assertImageUpload, json, requireRelaySecret, signedMediaUrl } from './_relay.js';

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Method not allowed' });
  if (!requireRelaySecret(request, response)) return;
  const upload = assertImageUpload(request, response);
  if (!upload) return;
  try {
    let pathname = upload.pathname;
    let contentType = upload.contentType;
    let body = Readable.toWeb(request);
    if (contentType === 'image/png') {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      body = await sharp(Buffer.concat(chunks)).jpeg({ quality: 92 }).toBuffer();
      pathname = pathname.replace(/\.png$/i, '.jpg');
      contentType = 'image/jpeg';
    }
    const blob = await put(pathname, body, { access: 'private', contentType, addRandomSuffix: false, cacheControlMaxAge: 60 });
    json(response, 201, { pathname: blob.pathname, mediaUrl: signedMediaUrl(request, blob.pathname, request.headers['x-relay-ttl']) });
  } catch (error) {
    console.error('relay upload failed', error);
    json(response, 500, { error: 'Private relay upload failed.' });
  }
}
