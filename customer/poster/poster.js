// ----- Element references -----
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const typeSelect = document.getElementById("typeSelect");
const upfile = document.getElementById("upfile");
const uploadedFilesDiv = document.getElementById("uploadedFiles");
const previewBox = document.getElementById("previewBox");
const statusText = document.getElementById("statusText");
const cartDot = document.getElementById('cartDot');
const confirmBtn = document.querySelector('.confirm-btn');

// ----- ราคาวัสดุ -----
const materialPrice = {
  "Vinyl": 150,
  "Premium Vinyl": 250,
  "Sticker": 450,
  "Clear Sticker": 450,
  "Sticker on Foamboard": 650,
  "Sticker on Future Board": 700,
  "Acrylic": 3000,
  "Plaswood": 1700,
  "PP Eco Glossy": 350,
  "poster": 350
};

// ----- ฟังก์ชันคำนวณราคา -----
function calculatePrice() {
  const width = parseFloat(widthInput.value) || 0;
  const height = parseFloat(heightInput.value) || 0;
  const quantity = parseInt(quantityInput.value) || 1;
  const material = typeSelect.value.trim();

  const baseMaterialPrice = materialPrice[material] || 0;
  const pricePerItem = baseMaterialPrice * (width / 100) * (height / 100);
  priceInput.value = (pricePerItem * quantity).toFixed(2);
}

// ----- ฟังก์ชันปรับขนาด preview -----
function updatePreviewBoxSize() {
  const w = parseFloat(widthInput.value) || 0;
  const h = parseFloat(heightInput.value) || 0;
  previewBox.style.width = w * 4 + "px";
  previewBox.style.height = h * 4 + "px";
}

// ----- ฟังก์ชันจัดการไฟล์ -----
function handleFileChange() {
  uploadedFilesDiv.innerHTML = "";
  previewBox.innerHTML = "";
  statusText.textContent = "";

  const files = upfile.files;
  Array.from(files).forEach(file => {
    const fileInfo = document.createElement("p");
    fileInfo.textContent = `ไฟล์: ${file.name} (ขนาด: ${widthInput.value}x${heightInput.value} ซม., วัสดุ: ${typeSelect.value.trim()})`;
    uploadedFilesDiv.appendChild(fileInfo);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          previewBox.appendChild(img);
          const boxRatio = previewBox.clientWidth / previewBox.clientHeight;
          const imgRatio = img.naturalWidth / img.naturalHeight;
          if (imgRatio >= boxRatio) {
            img.style.width = "100%";
            img.style.height = "auto";
          } else {
            img.style.width = "auto";
            img.style.height = "100%";
          }
          const displayedWidth = img.clientWidth;
          const displayedHeight = img.clientHeight;
          statusText.textContent = (displayedWidth >= previewBox.clientWidth && displayedHeight >= previewBox.clientHeight)
            ? "เต็มกรอบ"
            : "มีพื้นที่เหลือในกรอบ";
        }
      }
      reader.readAsDataURL(file);
    }
  });

  calculatePrice();
}

// ----- Event listeners -----
widthInput.addEventListener("input", () => { updatePreviewBoxSize(); handleFileChange(); });
heightInput.addEventListener("input", () => { updatePreviewBoxSize(); handleFileChange(); });
quantityInput.addEventListener("input", calculatePrice);
typeSelect.addEventListener("change", calculatePrice);
upfile.addEventListener("change", handleFileChange);

// ----- เพิ่มสินค้าไป localStorage และอัปเดต badge -----
confirmBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (upfile.files.length === 0) {
    alert("กรุณาอัปโหลดไฟล์ก่อนยืนยัน");
    return;
  }

  const width = widthInput.value;
  const height = heightInput.value;
  const quantity = quantityInput.value;
  const material = typeSelect.value.trim();
  const price = priceInput.value;

  const previewImg = previewBox.querySelector("img");
  const imgSrc = previewImg ? previewImg.src : "icon/placeholder.png";

  const item = {
    product: "POSTER",
    width,
    height,
    quantity,
    material,
    price,
    imgSrc
  };

  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  cartItems.push(item);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // แสดง badge จำนวนสินค้า
  cartDot.textContent = cartItems.length;
  cartDot.style.display = 'block';

  alert("เพิ่มสินค้าในตะกร้าเรียบร้อย!");
});

// ----- เริ่มต้น -----
updatePreviewBoxSize();
calculatePrice();
handleFileChange();

// --- navbar, location, user dropdown ฟังก์ชันเดิมยังใช้งานได้ ---
// ----- เพิ่ม/โหลดที่อยู่จาก localStorage -----

document.addEventListener('DOMContentLoaded', function () {
  const userBtn = document.getElementById("userBtn");
  const userMenu = document.getElementById("userMenu");
  const locationBtn = document.getElementById('locationBtn');
  const locationMenu = document.getElementById('locationMenu');
  const selectedSpan = document.getElementById('selectedLocation');

  // ✅ ปุ่มตำแหน่งปัจจุบัน (เหมือนหน้า main)
  locationBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    locationMenu.style.display = (locationMenu.style.display === 'block') ? 'none' : 'block';
  });
  document.addEventListener('click', function (e) {
    if (!locationBtn.contains(e.target) && !locationMenu.contains(e.target)) {
      locationMenu.style.display = 'none';
    }
  });

  // ✅ โหลดที่อยู่จาก localStorage
  const saved = JSON.parse(localStorage.getItem('addresses')) || [];

  const addLocationBtn = locationMenu.querySelector('.add-location');
  locationMenu.innerHTML = '';
  locationMenu.appendChild(addLocationBtn);

  saved.forEach((addr, index) => {
    const div = document.createElement('div');
    div.classList.add('location-option');
    div.innerHTML = `
      <label class="option-content">
        <input type="radio" name="address" value="${addr.type}">
        <span class="option-title">${addr.type}</span>
      </label>
      <div class="option-detail">
        ${addr.fname} ${addr.lname}<br>
        ${addr.houseNo}, หมู่ ${addr.village}, ${addr.subdistrict}<br>
        ${addr.district}, ${addr.province} ${addr.zipcode}<br>
        ${addr.phone}
      </div>
      <div class="option-actions">
        <button class="edit-btn" data-index="${index}" title="แก้ไข">
          <img src="icon/edit-30.svg" alt="แก้ไข">
        </button>
        <button class="delete-btn" data-index="${index}" title="ลบ">
          <img src="icon/trash-20.svg" alt="ลบ">
        </button>
      </div>
    `;
    locationMenu.insertBefore(div, addLocationBtn);
  });

  // ✅ เมื่อเลือก radio จะอัปเดตตำแหน่งที่เลือกไว้
  locationMenu.addEventListener('change', (e) => {
    if (e.target.name === 'address' && e.target.checked) {
      selectedSpan.innerText = e.target.value;
      const selected = document.getElementById('selectedLocations');
      if (selected) selected.innerText = e.target.value;
    }
  });

  // ✅ ปุ่มแก้ไข
  locationMenu.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const index = editBtn.dataset.index;
      window.location.href = `../editaddress/address.html?edit=${index}`;
    }
  });

  // ✅ ปุ่มลบ
  locationMenu.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.delete-btn');
    if (delBtn) {
      const index = delBtn.dataset.index;
      const saved = JSON.parse(localStorage.getItem('addresses')) || [];
      const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?");
      if (confirmed) {
        saved.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(saved));
        location.reload();
      }
    }
  });

  // ✅ เมนูผู้ใช้
  userBtn.addEventListener("click", function (e) {
    e.preventDefault();
    userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
  });
  document.addEventListener("click", function (e) {
    if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.style.display = "none";
    }
  });
});