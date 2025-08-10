# Posyandu Digital - Environment Setup

## Backend Environment (.env)
Buat file `.env` di folder `posyandu-server/` dengan isi:

```
PORT=3001
JWT_SECRET=posyandu_secret_key_2024_super_secure
NODE_ENV=development
```

## Frontend Environment (opsional)
Buat file `.env` di folder `login-signup-page/` dengan isi:

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=Posyandu Digital
```

## Database Setup
Database SQLite akan dibuat otomatis saat server pertama kali dijalankan.
Default user akan dibuat dengan:
- Username: posyandu22
- Password: poltek23

## Quick Start
1. Clone repository
2. Jalankan `npm run install-all` untuk install semua dependencies
3. Setup environment variables
4. Jalankan `npm run dev` untuk start kedua server sekaligus
