// public/scratch.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scratch-container');
  const canvas = document.getElementById('scratch-canvas');
  const bgImage = document.getElementById('background-image');
  const downloadBtn = document.getElementById('download-btn');
  const ctx = canvas.getContext('2d');

  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get('image');

  if (!imageUrl) {
    container.innerHTML = '<h2>Link tidak valid atau gambar tidak ditemukan.</h2>';
    return;
  }
  
  bgImage.src = imageUrl;
  downloadBtn.href = imageUrl;
  
  bgImage.onload = () => {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.fillStyle = '#c6d5b3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 32px "Poppins", sans-serif';
    ctx.fillStyle = '#6b5b4b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
    
    // Panggil fungsi untuk menyiapkan semua listener (mouse dan touch)
    setupScratchListeners();
  };

  bgImage.onerror = () => {
    console.error("Gagal memuat gambar latar.");
    container.innerHTML = '<h2>Gagal memuat gambar. Silakan coba lagi.</h2>';
  };

  let isDrawing = false;
  
  // Fungsi ini sudah dirancang untuk menangani mouse dan touch
  function getEventLocation(e) {
    if (e.touches && e.touches.length === 1) {
      // Untuk sentuhan jari
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
      // Untuk mouse
      return { x: e.clientX, y: e.clientY };
    }
    return null;
  }

  function scratch(e) {
    if (!isDrawing) return;

    // Mencegah browser melakukan scroll saat kita menggores di HP/tablet
    e.preventDefault();

    const loc = getEventLocation(e);
    if (!loc) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const x = loc.x - canvasRect.left;
    const y = loc.y - canvasRect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // Ukuran goresan sedikit dibesarkan untuk jari
    ctx.fill();
  }
  
  function checkProgress() {
    downloadBtn.classList.remove('hidden');
  }

  // --- BAGIAN TERPENTING ADA DI SINI ---
  function setupScratchListeners() {
    // Event untuk memulai goresan
    canvas.addEventListener('mousedown', () => { isDrawing = true; });
    canvas.addEventListener('touchstart', () => { isDrawing = true; });

    // Event untuk berhenti menggores
    canvas.addEventListener('mouseup', () => { isDrawing = false; checkProgress(); });
    canvas.addEventListener('touchend', () => { isDrawing = false; checkProgress(); });
    
    // Event saat sedang menggores
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);
  }
});