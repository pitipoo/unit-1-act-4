const SECRET = process.env.JWT_SECRET || 'UTCH-BIS-UNIT1-ACT4-DEMO-SECRET-CHANGE-IN-VERCEL';

function base64urlToUint8Array(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

async function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, payload, signature] = parts;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${payload}`));
    const expected = new Uint8Array(signed);
    const received = base64urlToUint8Array(signature);
    if (!timingSafeEqual(expected, received)) return false;

    const data = JSON.parse(new TextDecoder().decode(base64urlToUint8Array(payload)));
    return Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const valid = match ? await verifyToken(match[1]) : false;

  if (!valid) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('error', 'login_required');
    return Response.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard.html', '/practices/:path*']
};
