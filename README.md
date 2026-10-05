# UTCH BIS — Unit 1 Activity 4

## What this project contains

This project integrates the previous Unit 1 practices behind a login:

- **Authentication:** JWT signed on the server and stored in an HttpOnly cookie.
- **Protected routes:** `/dashboard.html` and everything under `/practices/` require a valid JWT.
- **Tooltip:** The login page explains how JWT authentication works.
- **Practice integration:** Potato Search (Activity 3) and the Dyatlov Pass practice are available from the protected dashboard.
- **Vercel:** The project uses Vercel Functions in `/api` for login/logout and Routing Middleware for protected routes.

## Demo login

- Username: `student`
- Password: `unit1act4`

For a real deployment, set these environment variables in Vercel:

- `APP_USER`
- `APP_PASSWORD`
- `JWT_SECRET`

The code includes demo defaults so the project is easy to test for the class assignment.

## Deploy to Vercel

### Option A — GitHub + Vercel

1. Create a GitHub repository.
2. Upload all files from this folder.
3. In Vercel, create a new project and import the GitHub repository.
4. Keep the project as a plain/custom project; there is no frontend build command.
5. Add `JWT_SECRET`, `APP_USER`, and `APP_PASSWORD` under Project Settings → Environment Variables if desired.
6. Deploy.
7. Open the generated `.vercel.app` URL.

### Option B — Vercel CLI

From this project folder:

```bash
npm install -g vercel
vercel login
vercel
```

For production:

```bash
vercel --prod
```

## Test checklist

1. Open the public URL.
2. Try opening `/dashboard.html` before logging in. It should redirect to `/`.
3. Try opening `/practices/potato/` before logging in. It should redirect to `/`.
4. Log in with the demo credentials.
5. Open the dashboard.
6. Test Simple Search with `Yukon Gold`.
7. Test Autocomplete by typing `yuk`.
8. Test Faceted Search with the category checkboxes and sorting.
9. Open the Dyatlov practice.
10. Click Log out and verify that protected pages redirect to Login again.

## Troubleshooting the login

If the browser shows `Unexpected end of JSON input`, redeploy the latest version of the project. The login API now returns JSON for successful, invalid-credential, and server-error responses, and the browser safely handles non-JSON responses.

Demo credentials:
- Username: `student`
- Password: `unit1act4`
