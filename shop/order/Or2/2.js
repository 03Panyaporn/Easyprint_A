// ===== EASYPRINT Shared Helpers =====

// ดึง Orders จาก localStorage อย่างปลอดภัย
function EP_getOrders() {
  try {
    const raw = localStorage.getItem("orders");
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return (obj && typeof obj === "object") ? obj : {};
  } catch {
    return {};
  }
}

// --- คำนวณจำนวนคำสั่งซื้อแต่ละสถานะ ---
function EP_computeCounts(orders) {
  const counts = { all: 0, waiting: 0, confirmed: 0, printing: 0, preparing: 0, sent: 0 };
  Object.keys(orders).forEach(id => {
    counts.all += 1;
    const st = (orders[id].status || "").toLowerCase();
    if (counts.hasOwnProperty(st)) counts[st] += 1;
  });
  return counts;
}

// --- อัปเดตเลขในแถบตัวกรอง (filter buttons) ---
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
    for (const th in map) if (label.startsWith(th)) { chosen = map[th]; break; }

    const span = a.querySelector("span") || (() => {
      const s = document.createElement("span");
      a.appendChild(s);
      return s;
    })();

    if (chosen && c.hasOwnProperty(chosen)) span.textContent = c[chosen];
  });
}

// ===== EASYPRINT Confirmed Orders Page =====

// --- เปิด popup การชำระเงิน ---
document.querySelector(".order-table tbody").addEventListener("click", (e) => {
  const btn = e.target.closest(".payment");
  if (!btn) return;
  const target = btn.getAttribute("data-target");
  const popup = document.querySelector(target);
  if (popup) popup.style.display = "block";
});

// --- ปิด popup ---
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("closePopup") || e.target.id === "closePopup") {
    e.target.closest(".popup").style.display = "none";
  }
});

// --- ปุ่ม “ชำระเงินแล้ว” → เปลี่ยนสถานะ ---
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("status-btn")) {
    const popup = e.target.closest(".popup");
    const orderId = popup.id.replace("paymentPopup-", "");
    let orders = EP_getOrders();
    if (!orders[orderId]) return;

    orders[orderId].status = "printing"; // ✅ ไปหน้า “กำลังพิมพ์”
    localStorage.setItem("orders", JSON.stringify(orders));
    popup.style.display = "none";
    renderConfirmedOrders();
    EP_updateFilterCounts(); // ✅ อัปเดตเลข
  }
});

// --- Render Orders (เฉพาะ confirmed) ---
function renderConfirmedOrders() {
  const tbody = document.querySelector(".order-table tbody");
  tbody.innerHTML = "";
  let orders = EP_getOrders();

  Object.keys(orders).forEach(orderId => {
    const data = orders[orderId];
    if (data.status !== "confirmed") return;

    const previewContent = data.image
      ? `<img src="${data.image}" alt="preview" class="preview-img" data-full="${data.image}" style="width:80px; height:auto; display:block; object-fit:contain;">`
      : `<span style="color:red;">ไม่มีภาพ</span>`;

    const row = document.createElement("tr");
    row.classList.add("order-row");
    row.setAttribute("data-id", orderId);
    row.innerHTML = `
      <td>${orderId}</td>
      <td><span class="status confirmed">ยืนยันแล้ว</span></td>
      <td><b>${data.customer}</b></td>
      <td>${data.product}</td>
      <td>${data.quantity}</td>
      <td class="order-preview">${previewContent}</td>
      <td>
        ${data.total}<br>
        <button class="confirm-btn payment" data-target="#paymentPopup-${orderId}" style="margin-top:5px;">ตรวจสอบการชำระเงิน</button>
      </td>
      <td class="order-actions-cell">
        <div style="display:flex; flex-direction:column; gap:5px; align-items:center;">
          <button class="confirm-btn printing-btn" data-order-id="${orderId}">กำลังพิมพ์</button>
          <div class="icon-group" style="display:flex; gap:5px;">
            <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
            <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(row);

    // popup การชำระเงิน
    if (!document.getElementById(`paymentPopup-${orderId}`)) {
      const popup = document.createElement("div");
      popup.classList.add("popup");
      popup.id = `paymentPopup-${orderId}`;
      popup.innerHTML = `
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
              <div>วันที่ : ${data.date?.split(" ")[0] || "-"}</div>
              <div>เวลา : ${data.date?.split(" ")[1] || ""}</div>
              <div><b>ยอดรวม : ${data.total}</b></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
    }
  });

  attachPrintingButtons();
  attachIconEvents();
  attachPreviewEvents();
  EP_updateFilterCounts(); // ✅ ทุกครั้งที่ render ก็อัปเดตเลข
}

// --- ปุ่ม “กำลังพิมพ์” ---
function attachPrintingButtons() {
  document.querySelectorAll(".printing-btn").forEach(btn => {
    btn.onclick = (e) => {
      const orderId = e.target.dataset.orderId;
      let orders = EP_getOrders();
      if (!orders[orderId]) return;
      orders[orderId].status = "printing";
      localStorage.setItem("orders", JSON.stringify(orders));
      e.target.closest("tr").remove();
      EP_updateFilterCounts();
    };
  });
}

// --- รายละเอียดคำสั่งซื้อ / ปริ้นที่อยู่ ---
function attachIconEvents() {
  document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.onclick = (e) => {
      const row = e.target.closest("tr");
      const orderId = row.dataset.id;
      const data = EP_getOrders()[orderId];
      if (!data) return;

      if (btn.dataset.tooltip === "รายละเอียดคำสั่งซื้อ") {
        let existing = document.getElementById(`detailsPopup-${orderId}`);
        if (!existing) {
          const popup = document.createElement("div");
          popup.classList.add("popup");
          popup.id = `detailsPopup-${orderId}`;
          popup.innerHTML = `
            <div class="popup-header">
              <span>รายละเอียดคำสั่งซื้อ #${orderId}</span>
              <div class="header-right">
                <button class="closePopup">&times;</button>
              </div>
            </div>
            <div class="popup-content" style="padding:15px;color:#6c6c6c;">
              <p><b>ลูกค้า:</b> ${data.customer}</p>
              <p><b>สินค้า:</b> ${data.product}</p>
              <p><b>จำนวน:</b> ${data.quantity}</p>
              <p><b>วัสดุ:</b> ${data.material || "-"}</p>
              <p><b>ขนาด:</b> ${data.width || "-"} x ${data.height || "-"}</p>
              <p><b>ยอดรวม:</b> ${data.total}</p>
              <p><b>วิธีจัดส่ง:</b> ${data.delivery}</p>
              <p><b>ที่อยู่:</b> ${data.address}</p>
              ${data.image ? `<img src="${data.image}" style="max-width:200px;display:block;margin-top:10px;">` : ""}
            </div>
          `;
          document.body.appendChild(popup);
        } else existing.style.display = "block";
      }

      if (btn.dataset.tooltip === "ปริ้นที่อยู่") {
        const content = `
          <h3>คำสั่งซื้อ #${orderId}</h3>
          <p><b>ลูกค้า:</b> ${data.customer}</p>
          <p><b>ที่อยู่:</b> ${data.address}</p>
          <p><b>จัดส่งแบบ:</b> ${data.delivery}</p>
        `;
        const w = window.open("", "", "width=600,height=400");
        w.document.write(`<html><head><title>ปริ้นที่อยู่</title></head><body>${content}</body></html>`);
        w.document.close();
        w.print();
      }
    };
  });
}

// --- แสดงรูปเต็ม ---
function attachPreviewEvents() {
  document.querySelectorAll(".preview-img").forEach(img => {
    img.onclick = () => showPreviewImage(img.dataset.full);
  });
}

function showPreviewImage(src) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;
  `;
  overlay.innerHTML = `
    <img src="${src}" style="max-width:90%;max-height:90%;border:2px solid #fff;border-radius:8px;">
    <span style="position:absolute;top:20px;right:40px;font-size:30px;color:#fff;cursor:pointer;">&times;</span>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("span").onclick = () => overlay.remove();
}

// --- โหลดหน้า / อัปเดตอัตโนมัติ ---
document.addEventListener("DOMContentLoaded", () => {
  renderConfirmedOrders();
  EP_updateFilterCounts();
  setInterval(() => {
    renderConfirmedOrders();
    EP_updateFilterCounts();
  }, 2000);
});
window.addEventListener("storage", e => {
  if (e.key === "orders") EP_updateFilterCounts();
});
