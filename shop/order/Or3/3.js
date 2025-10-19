// ===== EASYPRINT Shared Helpers =====

// ดึง Orders จาก localStorage แบบปลอดภัย
function EP_getOrders() {
  try {
    const raw = localStorage.getItem("orders");
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return (obj && typeof obj === "object") ? obj : {};
  } catch (e) {
    console.error("EP_getOrders parse error:", e);
    return {};
  }
}

// ✅ ฟังก์ชันคำนวณจำนวนออเดอร์แต่ละสถานะ
function EP_computeCounts(orders) {
  const counts = { all: 0, waiting: 0, confirmed: 0, printing: 0, preparing: 0, sent: 0 };
  Object.keys(orders).forEach(id => {
    counts.all += 1;
    const st = (orders[id].status || "").toLowerCase();
    if (counts.hasOwnProperty(st)) counts[st] += 1;
  });
  return counts;
}

// ✅ ฟังก์ชันอัปเดตตัวเลขบนปุ่มกรองสถานะ
function EP_updateFilterCounts() {
  const orders = EP_getOrders();
  const c = EP_computeCounts(orders);
  const container = document.querySelector(".order-filters");
  if (!container) return;

  const map = {
    "ทั้งหมด": "all",
    "ออเดอร์ใหม่": "waiting",
    "ยืนยันออเดอร์": "confirmed",
    "กำลังพิมพ์": "printing",
    "เตรียมจัดส่ง": "preparing",
    "จัดส่งแล้ว": "sent",
  };

  container.querySelectorAll("a.filter-btn").forEach(a => {
    const label = a.textContent.replace(/\d+/g, "").trim();
    let chosen = null;
    for (const th in map) {
      if (label.startsWith(th)) {
        chosen = map[th];
        break;
      }
    }
    const span = a.querySelector("span") || (() => {
      const s = document.createElement("span");
      a.appendChild(s);
      return s;
    })();
    if (chosen && c.hasOwnProperty(chosen)) span.textContent = c[chosen];
  });
}


// ===== MAIN ORDER PAGE LOGIC =====

// --- ดึง Orders จาก localStorage ---
let orders = JSON.parse(localStorage.getItem("orders") || "{}");

// --- เปิด popup การชำระเงินด้วย Event Delegation ---
document.querySelector(".order-table tbody").addEventListener("click", (e) => {
  const btn = e.target.closest(".payment");
  if (!btn) return;
  const target = btn.getAttribute('data-target');
  const popup = document.querySelector(target);
  if (popup) popup.style.display = 'block';
});

// --- ปิด popup ---
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('closePopup')) {
    e.target.closest('.popup').style.display = 'none';
  }
});

// --- ปุ่ม "ชำระเงินแล้ว" ---
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('status-btn')) {
    const popup = e.target.closest('.popup');
    const orderId = popup.id.replace('paymentPopup-', '');
    orders = JSON.parse(localStorage.getItem("orders") || "{}");
    if (!orders[orderId]) return;

    // เปลี่ยนสถานะเป็น printing (หรือหน้า 3)
    orders[orderId].status = 'printing';
    localStorage.setItem("orders", JSON.stringify(orders));
    popup.style.display = 'none';
    renderPrintingOrders();
    EP_updateFilterCounts(); // ✅ อัปเดตเลข
  }
});

// --- Render Orders กำลังพิมพ์ (printing) ---
function renderPrintingOrders() {
  const tbody = document.querySelector(".order-table tbody");
  tbody.innerHTML = "";
  orders = JSON.parse(localStorage.getItem("orders") || "{}");

  Object.keys(orders).forEach(orderId => {
    const data = orders[orderId];
    if (data.status !== 'printing') return;

    const row = document.createElement("tr");
    row.classList.add("order-row");
    row.setAttribute("data-id", orderId);

    const previewContent = data.image
      ? `<img src="${data.image}" class="preview-img" data-full="${data.image}" style="width:80px; height:auto; display:block; object-fit:contain;">`
      : `<span style="color:red;">ไม่มีภาพ</span>`;

    row.innerHTML = `
      <td>${orderId}</td>
      <td><span class="status printing">กำลังพิมพ์</span></td>
      <td><b>${data.customer}</b></td>
      <td>${data.product}</td>
      <td>${data.quantity}</td>
      <td class="order-preview">${previewContent}</td>
      <td>
        ${data.total} <br>
        <button class="confirm-btn payment" data-target="#paymentPopup-${orderId}" style="margin-top:5px;">ตรวจสอบการชำระเงิน</button>
      </td>
      <td class="order-actions-cell">
        <div style="display:flex; flex-direction:column; gap:5px; align-items:center;">
          <button class="confirm-btn printing-btn" data-order-id="${orderId}">เตรียมจัดส่ง</button>
          <div class="icon-group" style="display:flex; gap:5px;">
            <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
            <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(row);

    // --- popup ชำระเงิน ---
    if (!document.getElementById(`paymentPopup-${orderId}`)) {
      const paymentPopup = document.createElement("div");
      paymentPopup.classList.add("popup");
      paymentPopup.id = `paymentPopup-${orderId}`;
      paymentPopup.innerHTML = `
        <div class="popup-header">
          <span>ตรวจสอบการชำระเงิน</span>
          <div class="header-right">
            <button class="closePopup">&times;</button>
          </div>
        </div>
        <div class="popup-content">
          <div class="slip-header">
            <h4>สลิปโอนเงิน</h4>
            <button class="status-btn">ชำระเงินแล้ว</button>
          </div>
          <div class="content-row">
            <div class="slip-box">ตัวอย่างสลิปโอนเงิน</div>
            <div class="order-details">
              <div><b>#${orderId}</b></div>
              <div>ชื่อบัญชี : ${data.customer}</div>
              <div>วันที่ : ${data.date?.split(" ")[0] || '-'}</div>
              <div>เวลา : ${data.date?.split(" ")[1] || '-'} ${data.date?.split(" ")[2] || ''}</div>
              <div><b>ยอดรวม : ${data.total}</b></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(paymentPopup);
    }
  });

  attachPreviewEvents();
  attachIconEvents();
  attachPrintingButtons('delivered');
  EP_updateFilterCounts(); // ✅ อัปเดตเลข
}

// --- ปุ่มเตรียมจัดส่ง ---
function attachPrintingButtons(newStatus) {
  document.querySelectorAll(".printing-btn").forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest("tr");
      const orderId = row.getAttribute("data-id");
      orders = JSON.parse(localStorage.getItem("orders") || "{}");
      if(!orders[orderId]) return;
      orders[orderId].status = newStatus;
      localStorage.setItem("orders", JSON.stringify(orders));
      row.remove();
      EP_updateFilterCounts(); // ✅ อัปเดตเลข
    };
  });
}

// --- preview / popup รูป ---
function attachPreviewEvents() {
  document.querySelectorAll(".preview-img").forEach(img => {
    img.onclick = () => showPreviewImage(img.getAttribute("data-full"));
  });
}

// --- รายละเอียด / ปริ้น ---
function attachIconEvents() {
  document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const row = btn.closest("tr");
      const orderId = row.getAttribute("data-id");
      const data = orders[orderId];
      if(!data) return;

      if(btn.dataset.tooltip === "รายละเอียดคำสั่งซื้อ") {
        let existingPopup = document.getElementById(`detailsPopup-${orderId}`);
        if(!existingPopup) {
          const detailsPopup = document.createElement("div");
          detailsPopup.classList.add("popup");
          detailsPopup.id = `detailsPopup-${orderId}`;
          detailsPopup.innerHTML = `
            <div class="popup-header">
              <span>รายละเอียดคำสั่งซื้อ #${orderId}</span>
              <div class="header-right">
                <button class="closePopup">&times;</button>
              </div>
            </div>
            <div class="popup-content" style="padding:15px; color:#6c6c6c;">
              <p><b>ลูกค้า:</b> ${data.customer}</p>
              <p><b>สินค้า:</b> ${data.product}</p>
              <p><b>จำนวน:</b> ${data.quantity}</p>
              <p><b>วัสดุ:</b> ${data.material || '-'}</p>
              <p><b>ขนาด:</b> ${data.width || '-'} x ${data.height || '-'}</p>
              <p><b>ยอดรวม:</b> ${data.total}</p>
              <p><b>วิธีจัดส่ง:</b> ${data.delivery}</p>
              <p><b>ที่อยู่:</b> ${data.address}</p>
              ${data.image ? `<img src="${data.image}" style="max-width:200px; display:block; margin-top:10px;">` : ''}
            </div>
          `;
          document.body.appendChild(detailsPopup);
          detailsPopup.querySelector(".closePopup").onclick = () => detailsPopup.remove();
        } else {
          existingPopup.style.display = "block";
        }
      }

      if(btn.dataset.tooltip === "ปริ้นที่อยู่") {
        const printContent = `
          <h3>คำสั่งซื้อ #${orderId}</h3>
          <p><b>ลูกค้า:</b> ${data.customer}</p>
          <p><b>ที่อยู่:</b> ${data.address}</p>
        `;
        const printWindow = window.open('', '', 'height=400,width=600');
        printWindow.document.write('<html><head><title>ปริ้นที่อยู่</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    };
  });
}

// --- แสดงรูปเต็ม ---
function showPreviewImage(src) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;
  overlay.innerHTML = `
    <img src="${src}" style="max-width:90%; max-height:90%; border:2px solid #fff; border-radius:8px;">
    <span style="position:absolute;top:20px;right:40px;font-size:30px;color:#fff;cursor:pointer;">&times;</span>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("span").onclick = () => overlay.remove();
}

// --- Auto render หน้า 3 ---
document.addEventListener('DOMContentLoaded', () => {
  renderPrintingOrders();
  EP_updateFilterCounts(); // ✅ ตอนโหลดหน้า
  setInterval(() => {
    renderPrintingOrders();
    EP_updateFilterCounts(); // ✅ อัปเดตทุก 2 วิ
  }, 2000);
});

// ✅ sync เมื่อมีการเปลี่ยน localStorage จากหน้าอื่น
window.addEventListener("storage", e => {
  if (e.key === "orders") EP_updateFilterCounts();
});