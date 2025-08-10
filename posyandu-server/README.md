# Posyandu Digital System - Backend API

Backend server untuk sistem digital Posyandu dengan fitur lengkap untuk manajemen data bayi, pengukuran, dan petugas.

## 🚀 Fitur

- **Autentikasi JWT** - Login/logout dengan token keamanan
- **Manajemen Petugas** - CRUD data petugas posyandu
- **Manajemen Data Bayi** - CRUD data bayi dan orang tua
- **Pengukuran Real-time** - Recording berat dan tinggi badan
- **Statistik Dashboard** - Data analytics dan reporting
- **Database SQLite** - Database lokal dengan schema terstruktur
- **API Security** - Rate limiting, helmet, CORS protection

## 🛠️ Teknologi

- **Node.js** + **Express.js** - Server framework
- **SQLite3** - Database engine
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin requests

## 📦 Instalasi

1. Install dependencies:
```bash
npm install
```

2. Initialize database:
```bash
npm run init-db
```

3. Start server:
```bash
npm start
```

Atau untuk development:
```bash
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user

### Users/Petugas
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Babies
- `GET /api/babies` - Get all babies
- `POST /api/babies` - Add new baby
- `PUT /api/babies/:id` - Update baby data
- `DELETE /api/babies/:id` - Delete baby (soft delete)

### Measurements
- `GET /api/babies/:babyId/measurements` - Get baby measurements
- `POST /api/measurements` - Add new measurement

### Statistics
- `GET /api/statistics` - Get dashboard statistics

### Health Check
- `GET /api/health` - Server health status

## 🔐 Default Login

**Username:** `posyandu22`  
**Password:** `poltek23`

## 📊 Database Schema

### users
- id, username, password, nama, email, noTelp
- jabatan, alamat, status, tanggalBergabung, lastLogin

### babies  
- id, nama, tanggalLahir, jenisKelamin, alamat
- namaOrtu, noTelp, status, createdAt, updatedAt

### measurements
- id, babyId, userId, berat, tinggi, tanggalUkur
- catatan, status, createdAt

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Sample API Usage

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"posyandu22","password":"poltek23"}'
```

### Get Babies (with auth token)
```bash
curl -X GET http://localhost:5000/api/babies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Measurement
```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"babyId":1,"berat":8.5,"tinggi":70.0,"catatan":"Sehat"}'
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests/15 minutes)
- CORS protection
- Input validation
- SQL injection prevention
- Security headers with Helmet

## 📁 Project Structure

```
posyandu-server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables
├── database/
│   ├── init.js       # Database initialization
│   └── posyandu.db   # SQLite database file
└── README.md         # This file
```

## 🐛 Troubleshooting

**Database tidak terbuat:**
```bash
npm run init-db
```

**Port sudah digunakan:**
- Ubah PORT di file `.env`
- Atau stop aplikasi yang menggunakan port 5000

**CORS Error:**
- Pastikan frontend berjalan di http://localhost:3000
- Atau tambahkan domain frontend ke CORS config

## 📞 Support

Jika ada pertanyaan atau bug, silakan buat issue di repository ini.

---
Made with ❤️ for Posyandu Digital System
