# 🏥 Posyandu Digital

Sistem Informasi Manajemen Posyandu untuk Monitoring Kesehatan Bayi dan Balita

## 📋 Deskripsi

Posyandu Digital adalah aplikasi web yang dirancang untuk membantu petugas posyandu dalam mengelola data kesehatan bayi dan balita. Aplikasi ini menyediakan fitur lengkap untuk pencatatan, monitoring, dan pelaporan kesehatan dengan antarmuka yang user-friendly dan modern.

## ✨ Fitur Utama

### 🔐 Sistem Autentikasi
- Login secure dengan JWT token
- Session management
- Protected routes

### 📊 Dashboard
- Overview statistik posyandu
- Quick access ke semua fitur
- Real-time data display

### 👶 Manajemen Data Bayi
- Registrasi bayi baru
- Edit dan update informasi bayi
- Pencarian dan filter data
- Data orang tua dan kontak

### 📏 Pencatatan Pengukuran
- Input berat dan tinggi badan
- Tracking pertumbuhan
- Status gizi otomatis
- Riwayat pengukuran

### 👥 Manajemen Petugas
- Data petugas posyandu
- Role dan permission management
- Profile management

### 📋 Laporan Kesehatan
- Generate laporan pengukuran
- Export ke PDF
- Kirim laporan via WhatsApp
- Print ready format
- Grafik pertumbuhan

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React.js** - UI Framework
- **CSS3** - Styling dengan modern design
- **React Hooks** - State management
- **React-to-print** - Print functionality
- **jsPDF** - PDF generation
- **html2canvas** - HTML to image conversion

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🚀 Instalasi dan Setup

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/posyandu-digital.git
cd posyandu-digital
```

### 2. Setup Backend
```bash
cd posyandu-server
npm install
```

Buat folder database:
```bash
mkdir database
```

Jalankan server:
```bash
npm start
# atau
node server.js
```

Server akan berjalan di: `http://localhost:3001`

### 3. Setup Frontend
```bash
cd ../login-signup-page
npm install
```

Install dependencies untuk fitur laporan:
```bash
npm install react-to-print jspdf html2canvas
```

Jalankan aplikasi:
```bash
npm start
```

Aplikasi akan berjalan di: `http://localhost:3000`

## 🔑 Login Default

Untuk testing, gunakan kredensial berikut:
- **Username**: `posyandu22`
- **Password**: `poltek23`

## 📱 Fitur Laporan

### Generate PDF
- Laporan lengkap dengan format profesional
- Header dan footer dengan branding posyandu
- Tabel pengukuran dengan status pertumbuhan
- Rekomendasi kesehatan otomatis

### Kirim WhatsApp
- Integrasi dengan WhatsApp Web
- Template pesan otomatis
- Ringkasan data bayi dan pengukuran terakhir
- Direct link ke nomor orang tua ( nomor perlu di edit kembali)

### Print Ready
- Format A4 optimized
- Professional layout
- Print preview functionality
- High quality output

## 🗂️ Struktur Project

```
posyandu-digital/
├── login-signup-page/          # Frontend React App
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.js     # Login/Register
│   │   │   ├── Dashboard.js    # Main dashboard
│   │   │   ├── DataBayi.js     # Baby data management
│   │   │   ├── Pengukuran.js   # Measurement recording
│   │   │   ├── DataPetugas.js  # Staff management
│   │   │   ├── ReportPage.js   # Report generation
│   │   │   └── *.css           # Styling files
│   │   ├── services/
│   │   │   └── api.js          # API services
│   │   └── App.js              # Main app component
├── posyandu-server/            # Backend Express Server
│   ├── database/               # SQLite database
│   ├── server.js               # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🎨 Design Features

### UI/UX
- Modern medical-themed design
- Responsive layout untuk semua device
- Intuitive navigation
- Accessible color scheme
- Loading states dan error handling

### Animations
- Smooth transitions
- Hover effects
- Loading spinners
- Interactive buttons

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)

### Babies
- `GET /api/babies` - Get all babies
- `POST /api/babies` - Create new baby
- `PUT /api/babies/:id` - Update baby data
- `DELETE /api/babies/:id` - Delete baby

### Measurements
- `GET /api/measurements/:babyId` - Get measurements for baby
- `POST /api/measurements` - Add new measurement
- `PUT /api/measurements/:id` - Update measurement

### Users/Staff
- `GET /api/users` - Get all staff
- `POST /api/users` - Create new staff
- `PUT /api/users/:id` - Update staff data

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection with Helmet

## 📊 Database Schema

### Users Table
- id, username, password, full_name, role, created_at

### Babies Table
- id, name, birth_date, gender, parent_name, parent_phone, address, created_at

### Measurements Table
- id, baby_id, weight, height, measurement_date, notes, created_at

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build production version:
```bash
cd login-signup-page
npm run build
```

2. Deploy folder `build` ke hosting pilihan

### Backend (Railway/Heroku)
1. Set environment variables:
   - `JWT_SECRET`
   - `PORT`

2. Deploy dengan git push

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **Jonathan Kevin** - Full Stack Developer


## 📞 Kontak

- **Email**: binsarkevin15@gmail.com
- **WhatsApp**: [Jonathan Kevin](https://wa.me/6281212645538)
- **Project Link**: [https://github.com/F34RL35S0N3/posyandu-digital](https://github.com/your-username/posyandu-digital)

## 🙏 Acknowledgments

- React.js Community
- Express.js Documentation
- SQLite Team
- Modern UI/UX Design Inspiration
- Posyandu Indonesia

---

**⚡ Built with ❤️ for Indonesian Healthcare System**
