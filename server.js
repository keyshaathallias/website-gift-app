// server.js (Versi Baru dengan Cloudinary)

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Konfigurasi Cloudinary menggunakan variabel dari Railway
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Konfigurasi penyimpanan MENGGUNAKAN Cloudinary, bukan folder lokal
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'website-gifts', // Nama folder di Cloudinary
    format: async (req, file) => 'jpg', // Format file
    public_id: (req, file) => 'gift-' + Date.now(), // Nama file unik
  },
});

const upload = multer({ storage: storage });

// Endpoint upload sekarang mengirim file ke Cloudinary
app.post('/upload', upload.single('giftImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Tolong unggah sebuah file.' });
  }

  // Kirim kembali URL aman dari Cloudinary, bukan path lokal
  res.send({
    message: 'File berhasil diunggah!',
    // req.file.path berisi URL lengkap dari Cloudinary
    imageUrl: req.file.path 
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});