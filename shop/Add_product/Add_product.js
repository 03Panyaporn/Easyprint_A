// --- แจ้งเตือน / แก้ไขโปรไฟล์ ---
function goToNotification() {
  window.location.href = "../Notification/Notification.html";
}

function goNextEditProfile() {
  window.location.href = '../Edit_profile/Edit_profile.html';
}

function toggleProfilePopup() {
  const popup = document.getElementById('profilePopup');
  popup.classList.toggle('show');
}

window.addEventListener('click', function(e) {
  const popup = document.getElementById('profilePopup');
  const icon = document.querySelector('.profile-icon');
  if (!icon.contains(e.target)) {
      popup.classList.remove('show');
  }
});

// --- สถานะร้าน ---
const toggle = document.querySelector('.switch input');
toggle.addEventListener('change', function () {
  if (this.checked) {
    alert("ระบบเปิดการทำงาน");
  } else {
    alert("ระบบปิดการทำงาน");
  }
});

// --- ค้นหาในตาราง (ถ้ามี) ---
document.querySelector('.topbar input')?.addEventListener('keyup', function () {
  let keyword = this.value.toLowerCase();
  document.querySelectorAll("tbody tr").forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(keyword) ? "" : "none";
  });
});

// --- อัปโหลดภาพสินค้า ---
const uploadInput = document.getElementById('upload');
const previewImg = document.getElementById('preview');
const uploadLabel = document.getElementById('upload-label');
const imgCount = document.getElementById('img-count');
const removeBtn = document.getElementById('remove-img');

let uploadedImage = "";

uploadInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      uploadedImage = reader.result;
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
  uploadedImage = '';
});

// --- เพิ่มสินค้า ---
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.btn-add');

  addBtn.addEventListener('click', function (e) {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    // ดึงค่าจากฟอร์ม
    const name = document.getElementById('product-name').value.trim();
    const code = document.getElementById('product-code').value.trim();
    const tag = document.getElementById('tag').value.trim();

    // ดึงขนาดสินค้าให้ถูกต้อง (ใน HTML input ของคุณใช้ id ซ้ำกับ code ผมแก้เป็น querySelector)
    const sizeInput = document.querySelector('.product-size + input');
    const size = sizeInput ? sizeInput.value.trim() : '';

    const price = document.getElementById('price').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!name || !code || !tag || !size || !price || !description || !uploadedImage) {
      alert('กรุณากรอกข้อมูลและเลือกรูปภาพให้ครบ');
      return;
    }

    // ดึงสินค้าเก่าจาก localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // สร้างสินค้าใหม่
    const newProduct = {
      id: Date.now(),
      name,
      code,
      tag,
      size,
      price,
      description,
      image: uploadedImage
    };

    products.push(newProduct);

    // เก็บสินค้าใน localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // แจ้งเตือนแล้วไปหน้าสินค้า
    alert('เพิ่มสินค้าเรียบร้อย!');
    window.location.href = "../product/product.html";
  });
});
