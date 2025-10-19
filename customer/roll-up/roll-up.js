document.addEventListener('DOMContentLoaded', () => {
  // ----- ตัวแปรหลัก -----
  const sizeSelect = document.getElementById("sizeSelect");
  const quantityInput = document.getElementById("quantity");
  const priceInput = document.getElementById("price");
  const upfile = document.getElementById("upfile");
  const uploadedFilesDiv = document.getElementById("uploadedFiles");
  const previewBox = document.getElementById("previewBox");
  const statusText = document.getElementById("statusText");

  const userBtn = document.getElementById("userBtn");
  const userMenu = document.getElementById("userMenu");
  const locationBtn = document.getElementById('locationBtn');
  const locationMenu = document.getElementById('locationMenu');
  const selectedSpan = document.getElementById('selectedLocation');

  const confirmBtn = document.querySelector('.confirm-btn');
  const cartDot = document.getElementById('cartDot');
  const typeSelect = document.getElementById("typeSelect");

  const priceList = { "80x200": 1200 };

  // ----- ฟังก์ชันคำนวณราคา -----
  function calculatePrice() {
    const selectedOption = sizeSelect.value; 
    const sizeMatch = selectedOption.match(/(\d+x\d+)/);
    const cleanSize = sizeMatch ? sizeMatch[1] : "";
    const quantity = parseInt(quantityInput.value) || 1;
    const basePrice = priceList[cleanSize] || 0;
    priceInput.value = (basePrice * quantity).toLocaleString();
  }

  // ----- ฟังก์ชันปรับขนาด preview box -----
  function updatePreviewBoxSize() {
    const sizeValue = sizeSelect.value.replace("ซม.", "").trim();
    const [w, h] = sizeValue.split("x").map(v => parseFloat(v));
    previewBox.style.width = (w * 4) + "px";
    previewBox.style.height = (h * 4) + "px";
  }

  // ----- ฟังก์ชันจัดการไฟล์อัปโหลด -----
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

  // ----- Event Listeners -----
  sizeSelect.addEventListener("change", () => {
    updatePreviewBoxSize();
    handleFileChange();
    calculatePrice();
  });

  quantityInput.addEventListener("input", calculatePrice);
  upfile.addEventListener("change", handleFileChange);

  // ----- User menu -----
  userBtn.addEventListener("click", function (e) {
    e.preventDefault();
    userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (e) {
    if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.style.display = "none";
    }
  });

  // ----- Location menu -----
  locationBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    locationMenu.style.display = locationMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => locationMenu.style.display = 'none');

  document.addEventListener('change', (e) => {
    if (e.target.name === 'address' && e.target.checked) {
      selectedSpan.innerText = e.target.value;
      const selected = document.getElementById('selectedLocations');
      if (selected) selected.innerText = e.target.value;
    }
  });

  locationMenu.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const index = editBtn.dataset.index;
      window.location.href = `../editaddress/address.html?edit=${index}`;
      return;
    }

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

  // ----- Load addresses จาก localStorage -----
  const saved = JSON.parse(localStorage.getItem('addresses')) || [];
  const addLocationBtn = locationMenu.querySelector('.add-location');
  if (addLocationBtn) {
    locationMenu.innerHTML = '';
    locationMenu.appendChild(addLocationBtn);
  }

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
    if (addLocationBtn) locationMenu.insertBefore(div, addLocationBtn);
  });

  // ----- Confirm / Add to Cart -----
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!upfile.files.length) {
      alert("กรุณาอัปโหลดไฟล์ก่อนยืนยัน");
      return;
    }

    const file = upfile.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const sizeValue = sizeSelect.value.replace("ซม.", "").trim();
      const [width, height] = sizeValue.split("x").map(v => v.trim()); 
      cartItems.push({
        product: "Roll-up",
        width: width,
        height: height,
        quantity: parseInt(quantityInput.value),
        material: typeSelect.value,
        price: parseFloat(priceInput.value.replace(/,/g,'')),
        imgSrc: e.target.result
      });

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      cartDot.textContent = cartItems.length;
      cartDot.style.display = 'block';

      alert("เพิ่มออเดอร์ลงตะกร้าแล้ว");
    };
    reader.readAsDataURL(file);
  });

  // ----- เริ่มต้น -----
  updatePreviewBoxSize();
  handleFileChange();
  calculatePrice();
});
