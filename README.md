# UY-DOKON (Local MVP)

Stack: Node.js + Express + local JSON DB (lowdb) + React (Vite) + Electron

## Demo login
- username: `admin`
- password: `0000`

## Run in dev
```bash
npm run install:all
npm run dev
```

This runs:
- Backend API: `http://localhost:4000`
- Frontend: `http://localhost:5173`
- Electron desktop app

## Build desktop installer
```bash
npm --prefix frontend run build
npm --prefix desktop run dist
```

Installer output is in `desktop/dist`.

## Current API
- `POST /api/auth/login`
- `GET /api/admin/overview` (Bearer token)