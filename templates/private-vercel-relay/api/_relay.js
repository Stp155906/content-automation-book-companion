import crypto from 'node:crypto';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_LINK_TTL_SECONDS = 30 * 60;

export function json(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(body));
}

export function requireRelaySecret(request, response) {
  const expected = process.env.RELAY_SHARED_SECRET;
  const supplied = request.headers['x-relay-secret'];
  if (!expected || typeof supplied !== 'string') { json(response, 401, { error: 'Unauthorized' }); return false; }
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) { json(response, 401, { error: 'Unauthorized' }); return false; }
  return true;
}

export function assertImageUpload(request, response) {
  const contentType = String(request.headers['content-type'] || '').split(';', 1)[0].toLowerCase();
  const size = Number(request.headers['content-length'] || 0);
  const pathname = String(request.headers['x-relay-path'] || '');
  if (!IMAGE_TYPES.has(contentType)) { json(response, 415, { error: 'Only JPEG, PNG, and WEBP images are allowed.' }); return null; }
  if (!/^uploads\/[a-z0-9-]+\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(pathname)) { json(response, 400, { error: 'Invalid upload path.' }); return null; }
  if (!Number.isFinite(size) || size < 1 || size > MAX_UPLOAD_BYTES) { json(response, 413, { error: 'Each image must be 4 MB or smaller.' }); return null; }
  return { contentType, pathname };
}

export function signedMediaUrl(request, pathname, ttlSeconds) {
  const ttl = Math.max(60, Math.min(Number(ttlSeconds) || 900, MAX_LINK_TTL_SECONDS));
  const expires = Math.floor(Date.now() / 1000) + ttl;
  const signature = crypto.createHmac('sha256', process.env.RELAY_SHARED_SECRET).update(`${pathname}:${expires}`).digest('base64url');
  const token = Buffer.from(JSON.stringify({ pathname, expires, signature })).toString('base64url');
  return `https://${request.headers.host}/api/media/${token}.jpg`;
}

export function mediaToken(token) {
  try {
    const raw = String(token || '').replace(/\.jpg$/i, '');
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    return validMediaSignature(parsed.pathname, parsed.expires, parsed.signature) ? parsed : null;
  } catch (_) { return null; }
}

export function validMediaSignature(pathname, expires, signature) {
  if (!/^uploads\/[a-z0-9-]+\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(pathname || '')) return false;
  if (!/^\d+$/.test(String(expires)) || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  if (Number(expires) > Math.floor(Date.now() / 1000) + MAX_LINK_TTL_SECONDS) return false;
  const expected = crypto.createHmac('sha256', process.env.RELAY_SHARED_SECRET).update(`${pathname}:${expires}`).digest('base64url');
  const left = Buffer.from(expected);
  const right = Buffer.from(String(signature || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
