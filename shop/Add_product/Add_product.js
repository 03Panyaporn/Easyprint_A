const uploadInput = document.getElementById('upload');
const previewImg = document.getElementById('preview');
const uploadLabel = document.getElementById('upload-label');
const imgCount = document.getElementById('img-count');
const removeBtn = document.getElementById('remove-img');

uploadInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      previewImg.src = reader.result;
      previewImg.style.display = 'block';
      uploadLabel.style.display = 'none';
      removeBtn.style.display = 'block';
      imgCount.textContent = '1';
    };
    reader.readAsDataURL(file);
  }
});

removeBtn.addEventListener('click', function () {
  uploadInput.value = '';
  previewImg.src = '';
  previewImg.style.display = 'none';
  uploadLabel.style.display = 'block';
  removeBtn.style.display = 'none';
  imgCount.textContent = '0';
});
