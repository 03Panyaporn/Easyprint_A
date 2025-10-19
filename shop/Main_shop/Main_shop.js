// ===== EASYPRINT Shared Helpers (JS-only; UI unchanged) =====
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

function EP_computeCounts(orders) {
  const counts = { all: 0, waiting: 0, confirmed: 0, printing: 0, preparing: 0, sent: 0 };
  Object.keys(orders).forEach(id => {
    counts.all += 1;
    const st = (orders[id].status || "").toLowerCase();
    if (counts.hasOwnProperty(st)) counts[st] += 1;
  });
  return counts;
}

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
    const span = a.querySelector("span") || (() => { const s = document.createElement("span"); a.appendChild(s); return s; })();
    if (chosen && c.hasOwnProperty(chosen)) {
      span.textContent = c[chosen];
    }
  });
}

function EP_statusPill(status) {
  const s = (status || "").toLowerCase();
  const cls = {
    waiting: "waiting",
    new: "new",
    confirmed: "confirmed",
    printing: "printing",
    preparing: "preparing",
    sent: "sent",
  }[s] || "unknown";
  const th = {
    waiting: "รอคิว",
    new: "ออเดอร์ใหม่",
    confirmed: "ยืนยันแล้ว",
    printing: "กำลังพิมพ์",
    preparing: "เตรียมจัดส่ง",
    sent: "จัดส่งแล้ว",
    unknown: s
  }[cls];
  return `<span class="status ${cls}">${th}</span>`;
}

function EP_showPreview(src) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center;
    z-index:9999;
  `;
  overlay.innerHTML = `
    <img src="${src}" style="max-width:90%; max-height:90%; border:2px solid #fff; border-radius:8px;">
    <span style="position:absolute;top:20px;right:40px;font-size:30px;color:#fff;cursor:pointer;">&times;</span>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("span").onclick = () => overlay.remove();
}

function EP_attachPreviewDelegation(tbody) {
  tbody.addEventListener("click", e => {
    const img = e.target.closest(".preview-img");
    if (!img) return;
    const src = img.getAttribute("data-full") || img.src;
    EP_showPreview(src);
  });
}

function EP_ensurePaymentPopup(orderId, data) {
  if (document.getElementById(`paymentPopup-${orderId}`)) return;
  const paymentPopup = document.createElement("div");
  paymentPopup.classList.add("popup");
  paymentPopup.id = `paymentPopup-${orderId}`;
  const dateStr = (data.date || "").split(" ")[0] || "-";
  const timeParts = (data.date || "").split(" ");
  const timeStr = (timeParts[1] || "-") + " " + (timeParts[2] || "");
  paymentPopup.innerHTML = `
    <div class="popup-header">
      <span>ตรวจสอบการชำระเงิน</span>
      <div class="header-right">
        <button class="closePopup" aria-label="close">&times;</button>
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
          <div>ชื่อบัญชี : ${data.customer || "-"}</div>
          <div>วันที่ : ${dateStr}</div>
          <div>เวลา : ${timeStr}</div>
          <div><b>ยอดรวม : ${data.total || "-"}</b></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(paymentPopup);
}

function EP_wirePaymentPopup(tbody, nextStatusOnPaid = null, reRender) {
  tbody.addEventListener("click", e => {
    const btn = e.target.closest(".payment");
    if (!btn) return;
    const target = btn.getAttribute("data-target");
    const popup = document.querySelector(target);
    if (popup) popup.classList.add("show");
  });
  document.addEventListener("click", e => {
    if (e.target.classList.contains("closePopup")) {
      e.target.closest(".popup")?.classList.remove("show");
    }
  });
  document.addEventListener("click", e => {
    if (!e.target.classList.contains("status-btn")) return;
    const popup = e.target.closest(".popup");
    if (!popup) return;
    const id = popup.id.replace("paymentPopup-", "");
    const orders = EP_getOrders();
    if (!orders[id]) return;
    if (nextStatusOnPaid) {
      orders[id].status = nextStatusOnPaid;
      localStorage.setItem("orders", JSON.stringify(orders));
      popup.classList.remove("show");
      if (typeof reRender === "function") reRender();
      EP_updateFilterCounts();
    }
  });
}

function EP_bootstrapFilterAutoRefresh() {
  EP_updateFilterCounts();
  setInterval(EP_updateFilterCounts, 2000);
  window.addEventListener("storage", (e) => {
    if (e.key === "orders") EP_updateFilterCounts();
  });
}

// ===== Page Script: Orders =====
document.addEventListener('DOMContentLoaded', function() {
  const tbody = document.querySelector(".order-table tbody");
  if (!tbody) return;

  function renderAllOrders() {
    const orders = EP_getOrders();
    tbody.innerHTML = "";

    Object.keys(orders).forEach(orderId => {
      const data = orders[orderId];
      const preview = data.image
        ? `<img src="${data.image}" class="preview-img" data-full="${data.image}" style="width:80px;height:auto;display:block;object-fit:contain;">`
        : `<span style="color:red;">ไม่มีภาพ</span>`;

      const tr = document.createElement("tr");
      tr.classList.add("order-row");
      tr.setAttribute("data-id", orderId);
      tr.innerHTML = `
        <td>${orderId}</td>
        <td>${EP_statusPill(data.status)}</td>
        <td><b>${data.customer || "-"}</b></td>
        <td>${data.product || "-"}</td>
        <td>${data.quantity || "-"}</td>
        <td class="order-preview">${preview}</td>
        <td>
          ${data.total || "-"} <br>
          <button class="confirm-btn payment" data-target="#paymentPopup-${orderId}" style="margin-top:5px;">ตรวจสอบการชำระเงิน</button>
        </td>
        <td class="order-actions-cell">
          <div style="display:flex; flex-direction:column; gap:5px; align-items:flex-start;">
            ${["preparing"].includes((data.status||"").toLowerCase()) ? `<button class="confirm-btn shipping-btn" data-order-id="${orderId}">จัดส่งแล้ว</button>` : ""}
            <div class="icon-group" style="display:flex; gap:5px;">
              <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
              <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);

      EP_ensurePaymentPopup(orderId, data);
    });

    wireRowIcons(tbody);
    EP_attachPreviewDelegation(tbody);
    EP_wirePaymentPopup(tbody, null, renderAllOrders);
    attachShippingButtons();
  }

  function wireRowIcons(tbody) {
    tbody.querySelectorAll(".icon-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const tr = btn.closest("tr");
        const orderId = tr.getAttribute("data-id");
        const orders = EP_getOrders();
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

  function attachShippingButtons() {
    document.querySelectorAll(".shipping-btn").forEach(btn => {
      btn.onclick = () => {
        const row = btn.closest("tr");
        const orderId = row.getAttribute("data-id");
        const orders = EP_getOrders();
        if (!orders[orderId]) return;
        orders[orderId].status = "sent";
        localStorage.setItem("orders", JSON.stringify(orders));
        row.remove();
        EP_updateFilterCounts();
      };
    });
  }

  renderAllOrders();
  setInterval(renderAllOrders, 2000);
  EP_bootstrapFilterAutoRefresh();
});

// ===== Cart / Checkout / Address (เดิม, ไม่กระทบ Orders) =====
document.addEventListener('DOMContentLoaded', () => {
  // ...ใส่โค้ด cart / checkout / address ตามที่ส่งมาได้เลย (ไม่ต้องแก้)
});
