/* ================= Dropdown Menu ปุ่มดินสอ ================= */
const menu = document.getElementById("menu");

function toggleMenu(event) {
  event.stopPropagation(); // ป้องกัน click หล่นไป document
  const rect = event.target.getBoundingClientRect();
  menu.style.left = rect.left + "px";
  menu.style.top = rect.bottom + "px";
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// คลิกนอกเมนู -> ปิด
document.addEventListener("click", function(e) {
  menu.style.display = "none";
});

/* ================= Modal Popup กลางจอ ================= */
function showPopup(text) {
  document.getElementById('popup-text').innerText = text;
  document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

/* ================= Payment Popup ในตาราง ================= */
function togglePayment(button) {
  const popup = button.nextElementSibling;
  if (popup.style.display === "block") {
    popup.style.display = "none";
  } else {
    // ปิด popup อื่นทั้งหมดก่อน
    document.querySelectorAll('.payment-popup').forEach(p => p.style.display = 'none');
    popup.style.display = "block";
  }
}

// คลิกนอก popup -> ปิดทั้งหมด
document.addEventListener("click", function(e) {
  if (!e.target.closest('.pay-btn') && !e.target.closest('.payment-popup')) {
    document.querySelectorAll('.payment-popup').forEach(p => p.style.display = 'none');
  }
});

/* ================= Image Popup ================= */
function openImagePopup(src) {
  document.getElementById('popupImage').src = src;
  document.getElementById('imagePopup').style.display = 'flex';
}

function closeImagePopup() {
  document.getElementById('imagePopup').style.display = 'none';
}

/* ================= ป้องกันการซ้อน event ================= */
document.querySelectorAll('.dropdown-menu, .payment-popup, .image-popup, #popup').forEach(el => {
  el.addEventListener('click', function(e){
    e.stopPropagation();
  });
});


//พิมพี่อยู๋//
function showPopupWithImage(text, imageUrl) {
  const popupText = document.getElementById('popup-text');
  const popupContent = `
    <div style="margin-bottom: 15px;">${text}</div>
    <img src="${imageUrl}" alt="ตัวอย่าง" style="max-width: 100%; border-radius: 10px; margin-bottom: 15px;">
    <button style="
      display: block;
      margin: 0 auto;
      padding: 10px 20px;
      background-color: #4dc3b6;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      cursor: pointer;
    ">พิมพ์</button>
  `;
  popupText.innerHTML = popupContent;
  document.getElementById('popup').style.display = 'flex';
}





