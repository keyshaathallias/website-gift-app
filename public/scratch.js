// public/scratch.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scratch-container');
  const canvas = document.getElementById('scratch-canvas');
  const bgImage = document.getElementById('background-image');
  const downloadBtn = document.getElementById('download-btn');
  const ctx = canvas.getContext('2d');

  // Ambil nama file gambar dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('image'); // Parameter 'image' sekarang berisi URL lengkap

    if (!imageUrl) {
        container.innerHTML = '<h2>Link tidak valid atau gambar tidak ditemukan.</h2>';
        return;
    }
    
    // Langsung gunakan URL dari Cloudinary
    bgImage.src = imageUrl;
    downloadBtn.href = imageUrl;
  
  const imagePath = `/uploads/${imageName}`;
  bgImage.src = imagePath;

  // Atur href untuk tombol download
  downloadBtn.href = imagePath;
  
  bgImage.onload = () => {
    // Sesuaikan ukuran canvas dengan ukuran container setelah gambar dimuat
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Gambar lapisan atas (yang akan digores)
    ctx.fillStyle = '#c6d5b3'; // Warna hijau sage
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tulisan di atas lapisan
    ctx.font = 'bold 32px "Poppins", sans-serif';
    ctx.fillStyle = '#6b5b4b'; // Warna teks coklat
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GOORES DI SINI', canvas.width / 2, canvas.height / 2);
    
    setupScratchListeners();
  };

  let isDrawing = false;
  
  function getEventLocation(e) {
    if (e.touches && e.touches.length === 1) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.clientX && e.clientY) {
      return { x: e.clientX, y: e.clientY };
    }
    return null;
  }

  function scratch(e) {
    if (!isDrawing) return;

    const loc = getEventLocation(e);
    if (!loc) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const x = loc.x - canvasRect.left;
    const y = loc.y - canvasRect.top;

    // Ini adalah bagian "sihir"-nya
    // 'destination-out' membuat apa yang kita gambar menjadi transparan (menghapus)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // Menggambar lingkaran sebagai "goresan"
    ctx.fill();
  }
  
  function checkProgress() {
      // Fungsi sederhana untuk menampilkan tombol download setelah digores
      downloadBtn.classList.remove('hidden');
  }

  function setupScratchListeners() {
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; });

    canvas.addEventListener('mouseup', () => { isDrawing = false; checkProgress(); });
    canvas.addEventListener('touchend', () => { isDrawing = false; checkProgress(); });
    
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); });
  }
});