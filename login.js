const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = 'Signing in...';
  message.className = 'form-message';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const raw = await response.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (_) {
      throw new Error(`The server returned an invalid response (HTTP ${response.status}). Check the Vercel deployment.`);
    }

    if (!response.ok) {
      throw new Error(data.message || `Login failed (HTTP ${response.status}).`);
    }

    window.location.replace('/dashboard.html');
  } catch (error) {
    console.error(error);
    message.textContent = error.message || 'Unable to connect to the login server.';
    message.className = 'form-message error';
  }
});
