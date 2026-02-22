# LinkSpace

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

**LinkSpace** is a full-stack social linking platform that lets users create, share, and discover curated link collections. It consists of a REST API backend and a React web client.

---

## Tech Stack

### Backend
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL 16
- **Auth:** JWT (access + refresh tokens)

### Web
- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 16+](https://www.postgresql.org/) (or Docker)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) (optional, for containerised setup)

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env          # copy example env file
# fill in the required variables (see Environment Variables section)
npm install
npx prisma migrate dev        # run database migrations
npm run dev                   # start dev server on http://localhost:5000
```

### 2. Web

```bash
cd web
cp .env.example .env          # copy example env file
npm install
npm run dev                   # start dev server on http://localhost:3000
```

---

## Docker

Spin up the full backend + database stack with a single command:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:5000` and PostgreSQL at `localhost:5432`.

To stop and remove containers:

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

---

## API Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:-------------:|
| `POST` | `/auth/signup` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive tokens | No |
| `POST` | `/auth/refresh` | Refresh access token | No |
| `POST` | `/auth/logout` | Invalidate refresh token | Yes |
| `GET` | `/user/:username` | Get user profile | No |
| `POST` | `/user/follow/:id` | Follow / unfollow a user | Yes |
| `GET` | `/bookmarks` | List bookmarks | No |
| `POST` | `/bookmarks` | Create a new bookmark | Yes |
| `GET` | `/bookmarks/:id` | Get a single bookmark | No |
| `PUT` | `/bookmarks/:id` | Update a bookmark | Yes |
| `DELETE` | `/bookmarks/:id` | Delete a bookmark | Yes |
| `POST` | `/bookmarks/:id/like` | Toggle like on a bookmark | Yes |
| `GET` | `/bookmarks/:id/comments` | Get comments on a bookmark | No |
| `POST` | `/bookmarks/:id/comments` | Add a comment | Yes |
| `GET` | `/collections` | List collections | Yes |
| `POST` | `/collections` | Create a collection | Yes |
| `GET` | `/collections/:id` | Get a single collection | Yes |
| `PUT` | `/collections/:id` | Update a collection | Yes |
| `DELETE` | `/collections/:id` | Delete a collection | Yes |
| `GET` | `/feed/trending` | Trending bookmarks | No |
| `GET` | `/feed/following` | Following feed | Yes |
| `GET` | `/tags` | List / search tags | No |
| `POST` | `/ai/summarize` | Summarize a URL via AI | Yes |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/linkspace` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | `your-access-secret` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | `your-refresh-secret` |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `PORT` | Port for the HTTP server | `5000` |
| `NODE_ENV` | Runtime environment | `development` |

### Web (`web/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## Deployment

### Backend — [Render](https://render.com) or [Fly.io](https://fly.io)

**Render (recommended for quick deploys):**
1. Create a new **Web Service** and connect your repository.
2. Set the root directory to `backend`.
3. Build command: `npm ci && npx prisma generate && npm run build`
4. Start command: `npx prisma migrate deploy && node dist/server.js`
5. Add all required environment variables in the Render dashboard.

**Fly.io:**
```bash
cd backend
fly launch          # follow prompts, Dockerfile is auto-detected
fly secrets set JWT_ACCESS_SECRET=... JWT_REFRESH_SECRET=...
fly deploy
```

### Web — [Vercel](https://vercel.com)

1. Import the repository into Vercel.
2. Set the **Root Directory** to `web`.
3. Framework preset: **Next.js**.
4. Add `NEXT_PUBLIC_API_URL` in the Vercel environment variables settings.
5. Deploy — Vercel handles the rest.

---

## License

[MIT](LICENSE)
