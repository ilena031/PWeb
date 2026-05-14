# Tugas 6 – Form Registrasi & Pencarian Kode Pos

Tugas keenam ini bikin halaman yang punya dua fitur utama dalam satu halaman dengan navigasi tab:

1. **Form Registrasi** — form daftar akun dengan validasi: nama lengkap, email, nomor telepon, jenis kelamin, password (harus ada huruf besar, angka, simbol), dan konfirmasi password.
2. **Pencarian Kode Pos** — dropdown bertingkat Provinsi → Kota → Kecamatan yang otomatis terisi. Setelah pilih kecamatan, klik cari dan kode pos-nya muncul. Data mencakup seluruh 38 provinsi Indonesia.

## Struktur Folder

```
Tugas6/
├── index.html        # Halaman utama (tab navigation)
├── style.css         # Styling tema coklat-putih minimalis
└── script.js         # Logika validasi + data kode pos
```

## Fitur

- Tab navigation (Form Registrasi & Pencarian Kode Pos)
- Validasi form client-side (regex untuk email, password, dll)
- Dropdown cascading Provinsi → Kota → Kecamatan
- Data kode pos 38 provinsi seluruh Indonesia
- Tema warna coklat-putih minimalis
- Responsive (mobile friendly)

## Teknologi

- HTML5
- Vanilla CSS (external file)
- Vanilla JavaScript (external file)
- Google Fonts (Inter)
