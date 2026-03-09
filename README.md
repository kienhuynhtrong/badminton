# Badminton Management App

Full-stack app for badminton club management with React (Vite) client and Node.js/Express server.

## Project structure

- client/ - React + TypeScript + Vite frontend
- server/ - Node.js + Express + MongoDB backend

## Requirements

- Node.js 18+ (recommended)
- npm 9+ (or pnpm/yarn)
- MongoDB (local or cloud)

## Getting started

### 1) Clone and install

```bash
# from project root
cd client
npm install

cd ../server
npm install
```

### 2) Environment variables (server)

Create a file at server/.env with the following values:

```bash
MONGODB_URI=mongodb://localhost:27017/badminton
PORT=3000
```

- PORT is optional (defaults to 3000).
- Replace MONGODB_URI with your MongoDB connection string.

### 3) Run in development

Open two terminals:

```bash
# terminal 1
cd server
npm run dev
```

```bash
# terminal 2
cd client
npm run dev
```

Frontend runs on the Vite default port (see terminal output). Backend runs at http://localhost:3000 by default.

## Scripts

### Client (client/)

- npm run dev - start Vite dev server
- npm run build - type-check and build
- npm run preview - preview build
- npm run lint - run ESLint

### Server (server/)

- npm run dev - start server with nodemon

## API

Base URL: http://localhost:3000/api

Root health check: GET / returns {"message": "Server is running"}

## Notes

- MongoDB connection is configured in server/src/config/database.js.
- All API routes are under /api (see server/src/routes).
