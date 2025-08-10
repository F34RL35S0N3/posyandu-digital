# 📋 Panduan Upload ke GitHub

## Langkah 1: Buat Repository Baru di GitHub

1. Buka https://github.com
2. Login ke akun GitHub Anda
3. Klik tombol "+" di pojok kanan atas
4. Pilih "New repository"
5. Isi form berikut:
   - **Repository name**: `posyandu-digital`
   - **Description**: `🏥 Sistem Informasi Manajemen Posyandu untuk Monitoring Kesehatan Bayi dan Balita`
   - **Visibility**: Public (atau Private sesuai kebutuhan)
   - **JANGAN** centang "Add a README file" (karena sudah ada)
   - **JANGAN** centang "Add .gitignore" (karena sudah ada)
   - **JANGAN** centang "Choose a license" (bisa ditambahkan nanti)

6. Klik "Create repository"

## Langkah 2: Copy URL Repository

Setelah repository dibuat, GitHub akan menampilkan halaman dengan instruksi.
Copy URL repository yang berbentuk:
`https://github.com/username/posyandu-digital.git`

## Langkah 3: Hubungkan Local Repository ke GitHub

Ganti `your-username` dengan username GitHub Anda:

```bash
git remote add origin https://github.com/your-username/posyandu-digital.git
git branch -M main
git push -u origin main
```

## Langkah 4: Verifikasi Upload

Refresh halaman GitHub repository untuk memastikan semua file sudah terupload.

---

**Status Saat Ini:**
✅ Git repository sudah diinisialisasi
✅ File .gitignore sudah dibuat
✅ README.md sudah dibuat dan lengkap
✅ Semua file sudah di-commit
⏳ Menunggu: Buat repository di GitHub dan push

**Siap untuk di-push ke GitHub!**
