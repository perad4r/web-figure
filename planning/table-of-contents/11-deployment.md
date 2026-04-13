# Chapter 11 — Deployment

## Development

```bash
# Start with auto-reload
npx nodemon src/server.js

# Run migrations
npx knex migrate:latest

# Run seeds
npx knex seed:run
```

---

## Docker Setup

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: ./backend
    ports:
      - "3000:3000"
    env_file: ./.env
    depends_on:
      - db
    volumes:
      - uploads:/app/public/uploads

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
  uploads:
```

---

## PM2 (Production)

```bash
npm install -g pm2

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'web-figure',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    }
  }]
};
```

---

## Environment Variables (`.env.example`)

```env
# App
APP_ENV=local
APP_DEBUG=true
PORT=3000
NODE_ENV=development
SESSION_SECRET=change-me-in-production

# should be necessary for payos callbacks?
# APP_URL=https://figurevn.test

# Database (MySQL)
DB_CONNECTION=mysql
# DB_HOST=192.168.1.99
DB_HOST=127.0.0.1
DB_PORT=3306
# this database is initially empty, unless you already ran the project
DB_DATABASE=figurevn
DB_USERNAME=app
DB_PASSWORD=change-me
DB_ROOT_PASSWORD=change-me-root

# PayOS
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx
PAYOS_RETURN_URL=http://localhost:3000/thanh-toan/payos/return
PAYOS_CANCEL_URL=http://localhost:3000/thanh-toan/payos/cancel
```

> **Note**: If using a remote MySQL over Tailscale, set `DB_HOST` to your Tailscale IP/DNS name.
> The `figurevn` database starts empty — migrations will create all tables.

---

## Nginx Reverse Proxy (Production)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /app/public/uploads/;
        expires 30d;
    }
}
```
