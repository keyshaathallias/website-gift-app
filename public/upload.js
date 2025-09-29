const fileInput = document.getElementById('giftImage');
const fileNameDisplay = document.getElementById('fileName');

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
        fileNameDisplay.textContent = 'Belum ada foto yang dipilih';
    }
});

const form = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');
const giftLinkInput = document.getElementById('giftLink');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('giftImage');
  const formData = new FormData();
  formData.append('giftImage', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload gagal!');
    }

    const result = await response.json();
    
    // Tampilkan link
    const currentHost = window.location.origin;
    const giftURL = `${currentHost}/gift.html?image=${result.filePath.split('/').pop()}`;

    giftLinkInput.value = giftURL;
    resultDiv.classList.remove('hidden');

    // Otomatis select link agar mudah di-copy
    giftLinkInput.select();

  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat mengunggah gambar.');
  }
});