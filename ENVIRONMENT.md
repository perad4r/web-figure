# Backend Environment Variables

## App
- `PORT` (default: `3000`)
- `NODE_ENV` (`development` / `production`)
- `SESSION_SECRET` (required)

## Database (MySQL)
- `DB_HOST`
- `DB_PORT` (default: `3306`)
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

If using `docker-compose.yml`:
- `DB_ROOT_PASSWORD` (required for MySQL container)
- `DB_HOST_PORT` (optional, default `3406`) host port publish for MySQL (container port still `3306`)

## Docker (host ports)
- `APP_HOST_PORT` (optional, default `3000`) host port publish for the app (container port still `3000`)

## CSP (Cloudflare tunnel)
App uses Helmet CSP.
- Local/dev (no Cloudflare headers): CSP stays strict (no inline scripts).
- Behind Cloudflare (has `cf-ray` / `cf-connecting-ip` headers): CSP relaxes `script-src` to allow `unsafe-inline` so Cloudflare-injected scripts (Insights/Zaraz/worker blob) don't spam the console.

## Admin seed (optional)
Seed `001_admin_user.js` uses:
- `ADMIN_EMAIL` (default: `admin@example.com`)
- `ADMIN_PASSWORD` (default: `admin123`)

## PayOS (optional)
PayOS is disabled unless:
- `PAYOS_ENABLED=true`

Then required:
- `PAYOS_CLIENT_ID`
- `PAYOS_API_KEY`
- `PAYOS_CHECKSUM_KEY`
- `PAYOS_RETURN_URL`
- `PAYOS_CANCEL_URL`
