
// ราคาตามขนาด
const priceList = { "80x200": 1200 };
const sizeSelect = document.getElementById("sizeSelect");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const upfile = document.getElementById("upfile");
const uploadedFilesDiv = document.getElementById("uploadedFiles");
const previewBox = document.getElementById("previewBox");
const statusText = document.getElementById("statusText");


function calculatePrice() {
  const selectedOption = sizeSelect.value; 
  const quantity = parseInt(quantityInput.value) || 1;
  const cleanSize = selectedOption.replace("ซม.", "").trim(); 
  const basePrice = priceList[cleanSize] || 0;
  priceInput.value = (basePrice * quantity).toLocaleString();
}

quantityInput.addEventListener("input", calculatePrice);
calculatePrice();
function updatePreviewBoxSize() {
  const sizeValue = sizeSelect.value.replace("ซม.", "").trim();
  const [w, h] = sizeValue.split("x").map(v => parseFloat(v));
  previewBox.style.width = (w * 4) + "px";
  previewBox.style.height = (h * 4) + "px";
}


function handleFileChange() {
  uploadedFilesDiv.innerHTML = "";
  previewBox.innerHTML = "";
  statusText.textContent = "";

  const files = upfile.files;
  Array.from(files).forEach(file => {
    const fileInfo = document.createElement("p");
    fileInfo.textContent = `ไฟล์: ${file.name} (ขนาด: ${sizeSelect.value})`;
    uploadedFilesDiv.appendChild(fileInfo);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          previewBox.appendChild(img);

          const boxWidth = previewBox.clientWidth;
          const boxHeight = previewBox.clientHeight;
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;

          const boxRatio = boxWidth / boxHeight;
          const imgRatio = imgWidth / imgHeight;

          if (imgRatio >= boxRatio) {
            img.style.width = "100%";
            img.style.height = "auto";
          } else {
            img.style.width = "auto";
            img.style.height = "100%";
          }

          const displayedWidth = img.clientWidth;
          const displayedHeight = img.clientHeight;
          statusText.textContent = (displayedWidth >= boxWidth && displayedHeight >= boxHeight)
            ? "เต็มกรอบ"
            : "มีพื้นที่เหลือในกรอบ";
        }
      }
      reader.readAsDataURL(file);
    }
  });

  calculatePrice();
}

sizeSelect.addEventListener("change", () => {
  updatePreviewBoxSize();
  handleFileChange();
});

quantityInput.addEventListener("input", calculatePrice);
upfile.addEventListener("change", handleFileChange);

// เริ่มต้น
updatePreviewBoxSize();
calculatePrice();
const userBtn = document.getElementById("userBtn");
const userMenu = document.getElementById("userMenu");
const locationBtn = document.getElementById('locationBtn');
const locationMenu = document.getElementById('locationMenu');
const selectedSpan = document.getElementById('selectedLocation');

locationBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  locationMenu.style.display = locationMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', () => locationMenu.style.display = 'none');

document.querySelectorAll('.location-option input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function () {
    if (this.checked) {
      selectedSpan.innerText = this.value;

    }
  });
});

document.querySelectorAll('.location-option input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function () {
    if (this.checked) {
      document.getElementById('selectedLocations').innerText = this.value;

    }
  });
});

document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    window.location.href = "../editaddress/address.html";
  });
});

document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const option = btn.closest('.location-option');

    if (option) {
      const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?");
      if (confirmed) {
        option.remove();
        alert("ลบที่อยู่นี้เรียบร้อย");
      }
    }
  });
});
userBtn.addEventListener("click", function (e) {
  e.preventDefault();
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", function (e) {
  if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.style.display = "none";
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.querySelector('.confirm-btn');
  const upfile = document.getElementById('upfile');
  const cartDot = document.getElementById('cartDot');

  let orderCount = 0;

  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (upfile.files.length === 0) {
      alert("กรุณาอัปโหลดไฟล์ก่อนยืนยัน");
      return;
    }

    orderCount += 1;
    cartDot.textContent = orderCount;
    cartDot.style.display = 'block';

    alert("เพิ่มออเดอร์ลงตะกร้าแล้ว");
  });
});
/////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  const locationMenu = document.getElementById('locationMenu');
 
  // โหลดข้อมูลที่อยู่จาก localStorage
  const saved = JSON.parse(localStorage.getItem('addresses')) || [];
 
  // ถ้ามีข้อมูล ให้เพิ่มเข้าใน dropdown
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
        <button class="edit-btn" title="แก้ไข"><img src="icon/edit-30.svg" alt="แก้ไข"></button>
        <button class="delete-btn" title="ลบ" data-index="${index}"><img src="icon/trash-20.svg" alt="ลบ"></button>
      </div>
    `;
    locationMenu.insertBefore(div, locationMenu.querySelector('.add-location'));
  });
 
  // ปุ่มลบที่อยู่
  locationMenu.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
      const index = e.target.closest('.delete-btn').dataset.index;
      const saved = JSON.parse(localStorage.getItem('addresses')) || [];
      saved.splice(index, 1);
      localStorage.setItem('addresses', JSON.stringify(saved));
      location.reload();
    }
  });
});