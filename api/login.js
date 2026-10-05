const crypto = require('crypto');

const SECRET = process.env.JWT_SECRET || 'UTCH-BIS-UNIT1-ACT4-DEMO-SECRET-CHANGE-IN-VERCEL';
const USERNAME = process.env.APP_USER || 'student';
const PASSWORD = process.env.APP_PASSWORD || 'unit1act4';

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function signToken(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return {};
}

module.exports = (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: 'Method not allowed.' });
    }

    const { username, password } = getBody(req);

    if (username !== USERNAME || password !== PASSWORD) {
      return res.status(401).json({ ok: false, message: 'Invalid username or password.' });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = signToken({ sub: username, iat: now, exp: now + 60 * 60 * 2 });

    res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=7200`);
    return res.status(200).json({ ok: true, message: 'Login successful.' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ ok: false, message: 'Server error while processing login.' });
  }
};
