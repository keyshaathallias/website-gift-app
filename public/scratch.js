// public/scratch.js (Revisi Penuh)

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
  
  // Ini penting: Gambar di-load di background DULU
  bgImage.onload = () => {
    // Pastikan ukuran canvas sesuai dengan container SETELAH gambar latar dimuat
    // agar kita punya referensi ukuran yang benar.
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Gambar lapisan atas (yang akan digores) setelah ukuran canvas diset
    ctx.fillStyle = '#c6d5b3'; // Warna hijau sage
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Menggambar kotak penuh
    
    // Teks di atas lapisan
    ctx.font = 'bold 32px "Poppins", sans-serif';
    ctx.fillStyle = '#6b5b4b'; // Warna teks coklat
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
    
    setupScratchListeners(); // Siapkan listener setelah semuanya digambar
  };

  // Jika gambar gagal dimuat, tampilkan error
  bgImage.onerror = () => {
    console.error("Gagal memuat gambar latar.");
    container.innerHTML = '<h2>Gagal memuat gambar. Silakan coba lagi.</h2>';
  };

  let isDrawing = false;
  
  function getEventLocation(e) {
    // ... (kode ini tidak perlu diubah, sudah benar) ...
    if (e.touches && e.touches.length === 1) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.clientX !== undefined && e.clientY !== undefined) { // Perbaikan kecil untuk universalitas
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

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  function checkProgress() {
    downloadBtn.classList.remove('hidden');
  }

  function setupScratchListeners() {
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; });

    canvas.addEventListener('mouseup', () => { isDrawing = false; checkProgress(); });
    canvas.addEventListener('touchend', () => { isDrawing = false; checkProgress(); });
    
    canvas.addEventListener('mousemove', scratch);
  }
})