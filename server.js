// server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Menggunakan CORS agar frontend bisa mengakses API ini
app.use(cors());

// Menyajikan file statis dari folder 'public' (untuk frontend)
app.use(express.static('public'));
// Menyajikan file yang diunggah dari folder 'uploads'
app.use('/uploads', express.static('uploads'));

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder tujuan penyimpanan
  },
  filename: function (req, file, cb) {
    // Membuat nama file unik dengan timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoint untuk handle upload gambar
// Menggunakan middleware 'upload.single('giftImage')'
// 'giftImage' harus sama dengan nama field di form HTML
app.post('/upload', upload.single('giftImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Tolong unggah sebuah file.' });
  }

  // Jika berhasil, kirim kembali path ke file yang sudah diunggah
  res.send({
    message: 'File berhasil diunggah!',
    filePath: `/uploads/${req.file.filename}`
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});