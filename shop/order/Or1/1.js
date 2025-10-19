// ===== EASYPRINT — ระบบจัดการออเดอร์ (OR1) ปลอดภัยต่อ Cart =====

(function() { // scope ป้องกัน global

  // --- ฟังก์ชันเปลี่ยนหน้า Notification และแก้ไขโปรไฟล์ ---
  function goToNotification() {
    window.location.href = "../../Notification/Notification.html";
  }
  function goNextEditProfile() {
    window.location.href = "../Edit_profile/Edit_profile.html";
  }

  // --- Toggle ระบบร้าน ---
  const switchInput = document.querySelector(".switch input");
  if (switchInput) {
    switchInput.addEventListener("change", function () {
      alert(this.checked ? "ระบบเปิดการทำงาน" : "ระบบปิดการทำงาน");
    });
  }

  // --- Toggle Profile Popup ---
  function toggleProfilePopup() {
    const popup = document.getElementById("profilePopup");
    if (popup) popup.classList.toggle("show");
  }
  window.addEventListener("click", function (e) {
    const popup = document.getElementById("profilePopup");
    if (popup && !document.querySelector(".profile-icon").contains(e.target)) {
      popup.classList.remove("show");
    }
  });

  // ===== EASYPRINT Shared Helpers =====
  function EP_getOrders() {
    try {
      const raw = localStorage.getItem("orders");
      if (!raw) return {};
      const obj = JSON.parse(raw);
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      console.error("EP_getOrders parse error:", e);
      return {};
    }
  }

  function EP_computeCounts(orders) {
    const counts = {
      all: 0,
      waiting: 0,
      confirmed: 0,
      printing: 0,
      preparing: 0,
      sent: 0,
    };
    Object.keys(orders).forEach((id) => {
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

    container.querySelectorAll("a.filter-btn").forEach((a) => {
      const label = a.textContent.replace(/\d+/g, "").trim();
      let chosen = null;
      for (const th in map) if (label.startsWith(th)) { chosen = map[th]; break; }
      const span =
        a.querySelector("span") ||
        (() => {
          const s = document.createElement("span");
          a.appendChild(s);
          return s;
        })();
      if (chosen && c.hasOwnProperty(chosen)) span.textContent = c[chosen];
    });
  }

  // --- Render Orders หน้าออเดอร์ใหม่ (waiting) ---
  function renderOrders() {
    const tbody = document.querySelector(".order-table tbody");
    if (!tbody) return;

    const orders = EP_getOrders();
    tbody.innerHTML = "";

    Object.keys(orders).forEach((orderId) => {
      const data = orders[orderId];
      if (data.status !== "waiting") return;

      const previewContent = data.image
        ? `<img src="${data.image}" 
                alt="preview" 
                class="preview-img" 
                data-full="${data.image}" 
                style="width:80px; height:auto; object-fit:contain;">`
        : `<span style="color:red;">ไม่มีภาพ</span>`;

      const row = document.createElement("tr");
      row.classList.add("order-row");
      row.innerHTML = `
        <td>${orderId}</td>
        <td><span class="status waiting">รอคิว</span></td>
        <td><b>${data.customer}</b></td>
        <td>${data.product}</td>
        <td>${data.quantity}</td>
        <td class="order-preview">${previewContent}</td>
        <td>
          ${data.total} <br>
          <button class="confirm-btn payment" data-target="#paymentPopup-${orderId}" style="margin-top:5px;">ตรวจสอบการชำระเงิน</button>
        </td>
        <td class="order-actions-cell">
          <button class="confirm-btn confirm-order" data-id="${orderId}">ยืนยันออเดอร์</button>
          <div class="icon-group">
            <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
            <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);

      // --- popup Payment ---
      if (!document.getElementById(`paymentPopup-${orderId}`)) {
        const paymentPopup = document.createElement("div");
        paymentPopup.classList.add("popup");
        paymentPopup.id = `paymentPopup-${orderId}`;
        paymentPopup.innerHTML = `
          <div class="popup-header">
            <span>ตรวจสอบการชำระเงิน</span>
            <div class="header-right">
              <button id="closePopup">&times;</button>
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
                <div>เวลา : ${data.date?.split(" ")[1] || "-"} ${data.date?.split(" ")[2] || ""}</div>
                <div><b>ยอดรวม : ${data.total}</b></div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(paymentPopup);
      }
    });

    EP_updateFilterCounts();
  }

  // --- Event Delegation ---
  const tbody = document.querySelector(".order-table tbody");
  if(tbody){
    tbody.addEventListener("click", (e) => {
      const target = e.target;
      const orders = EP_getOrders();

      if (target.closest(".payment")) {
        const popupId = target.closest(".payment").getAttribute("data-target");
        const popup = document.querySelector(popupId);
        if (popup) popup.style.display = "block";
        return;
      }

      if (target.closest(".confirm-order")) {
        const orderId = target.closest(".confirm-order").dataset.id;
        if (orders[orderId]) {
          orders[orderId].status = "confirmed";
          localStorage.setItem("orders", JSON.stringify(orders));
          renderOrders();
          EP_updateFilterCounts();
        }
        return;
      }

      if (target.closest(".icon-btn")) {
        const btn = target.closest(".icon-btn");
        const row = btn.closest("tr");
        const orderId = row.querySelector("td:first-child").textContent.trim();
        const data = orders[orderId];
        if (!data) return;

        // รายละเอียดคำสั่งซื้อ
        if (btn.dataset.tooltip === "รายละเอียดคำสั่งซื้อ") {
          let existingPopup = document.getElementById(`detailsPopup-${orderId}`);
          if (!existingPopup) {
            const detailsPopup = document.createElement("div");
            detailsPopup.classList.add("popup");
            detailsPopup.id = `detailsPopup-${orderId}`;
            detailsPopup.innerHTML = `
              <div class="popup-header">
                <span>รายละเอียดคำสั่งซื้อ #${orderId}</span>
                <div class="header-right">
                  <button class="closeDetailsPopup">&times;</button>
                </div>
              </div>
              <div class="popup-content" style="padding:15px; color:#6c6c6c;"> 
                <p><b>ลูกค้า:</b> ${data.customer}</p>
                <p><b>สินค้า:</b> ${data.product}</p>
                <p><b>จำนวน:</b> ${data.quantity}</p>
                <p><b>วัสดุ:</b> ${data.material || "-"}</p>
                <p><b>ขนาด:</b> ${data.width || "-"} x ${data.height || "-"}</p>
                <p><b>ยอดรวม:</b> ${data.total}</p>
                <p><b>วิธีจัดส่ง:</b> ${data.delivery}</p>
                <p><b>ที่อยู่:</b> ${data.address}</p>
                ${data.image ? `<img src="${data.image}" style="max-width:200px; display:block; margin:5px 0;">` : ""}
              </div>
            `;
            document.body.appendChild(detailsPopup);
            detailsPopup.querySelector(".closeDetailsPopup").onclick = () => detailsPopup.remove();
          } else {
            existingPopup.style.display = "block";
          }
        }

        // ปริ้นที่อยู่
        if (btn.dataset.tooltip === "ปริ้นที่อยู่") {
          const printContent = `
            <h3>คำสั่งซื้อ #${orderId}</h3>
            <p><b>ลูกค้า:</b> ${data.customer}</p>
            <p><b>ที่อยู่:</b> ${data.address}</p>
            <p><b>จัดส่งแบบ:</b> ${data.delivery}</p>
          `;
          const printWindow = window.open("", "", "height=400,width=600");
          printWindow.document.write("<html><head><title>ปริ้นที่อยู่</title></head><body>");
          printWindow.document.write(printContent);
          printWindow.document.write("</body></html>");
          printWindow.document.close();
          printWindow.print();
        }
      }

      if (target.closest(".preview-img")) {
        const src = target.closest(".preview-img").getAttribute("data-full") || target.closest(".preview-img").src;
        showPreviewImage(src);
      }
    });
  }

  // --- ปิด popup ---
  document.addEventListener("click", (e) => {
    if (e.target.id === "closePopup") {
      const popup = e.target.closest(".popup");
      if (popup) popup.style.display = "none";
    }
  });

  // --- preview image ---
  function showPreviewImage(src) {
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

  // --- โหลดหน้า ---
  document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
    EP_updateFilterCounts();
  });

})();
