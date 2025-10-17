// --- ฟังก์ชันเปลี่ยนหน้า Notification และแก้ไขโปรไฟล์ ---
function goToNotification() {
    window.location.href = "../../Notification/Notification.html";
}
function goNextEditProfile() {
    window.location.href = '../Edit_profile/Edit_profile.html';
}

// --- Toggle ระบบร้าน ---
document.querySelector('.switch input').addEventListener('change', function () {
    alert(this.checked ? "ระบบเปิดการทำงาน" : "ระบบปิดการทำงาน");
});

// --- Toggle Profile Popup ---
function toggleProfilePopup() {
    document.getElementById('profilePopup').classList.toggle('show');
}
window.addEventListener('click', function(e) {
    const popup = document.getElementById('profilePopup');
    if (!document.querySelector('.profile-icon').contains(e.target)) popup.classList.remove('show');
});

// --- เปิด popup การชำระเงิน ---
document.addEventListener('click', function(e) {
    if(e.target.closest('.payment')) {
        const target = e.target.closest('.payment').getAttribute('data-target');
        const popup = document.querySelector(target);
        if(popup) popup.style.display = 'block';
    }
});

// --- ปิด popup ---
document.addEventListener('click', function(e) {
    if(e.target.id === 'closePopup') {
        const popup = e.target.closest('.popup');
        if(popup) popup.style.display = 'none';
    }
});

// --- ดึง Orders จาก localStorage ---
let orders = JSON.parse(localStorage.getItem("orders") || "{}");

// --- Render Orders ลงตาราง ---
function renderOrders() {
    const tbody = document.querySelector(".order-table tbody");
    tbody.innerHTML = "";
    orders = JSON.parse(localStorage.getItem("orders") || "{}");

    let waitingCount = 0;

    Object.keys(orders).forEach(orderId => {
        const data = orders[orderId];
        const row = document.createElement("tr");
        row.classList.add("order-row");

        const previewContent = data.preview ?
            `<img src="${data.preview}" alt="preview" class="preview-img" data-full="${data.preview}">` : "preview";

        row.innerHTML = `
            <td><div>${orderId}</div></td>
            <td><span class="status ${data.status || 'waiting'}">${data.status === 'confirmed' ? 'ยืนยันแล้ว' : 'รอคิว'}</span></td>
            <td><b>${data.customer}</b></td>
            <td>${data.product}</td>
            <td>${data.quantity}</td>
            <td class="order-preview">${previewContent}</td>
            <td>
                ${data.total} 
                <br>
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

        if(data.status === 'waiting') waitingCount++;

        // --- สร้าง popup การชำระเงิน ---
        if(!document.getElementById(`paymentPopup-${orderId}`)) {
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

    const newOrderBtn = document.querySelector(".filter-btn.active span");
    if(newOrderBtn) newOrderBtn.textContent = waitingCount;

    attachPopupEvents();
    attachConfirmOrderEvents();
    attachPreviewEvents();
}

// --- จับ Event Popup ---
function attachPopupEvents() {
    document.querySelectorAll(".icon-btn[data-tooltip='รายละเอียดคำสั่งซื้อ']").forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.closest("tr").querySelector("td:first-child div").textContent.trim();
            const data = orders[orderId];
            if(!data) return;

            const popup = document.getElementById("detailsPopup");
            document.getElementById("orderId").textContent = orderId;
            document.getElementById("customerName").textContent = data.customer;
            document.getElementById("productType").textContent = data.product;
            document.getElementById("quantity").textContent = data.quantity;
            document.getElementById("total").textContent = data.total;
            document.getElementById("address").textContent = data.address;
            document.getElementById("delivery").textContent = data.delivery;

            popup.style.display = "block";
            setTimeout(()=> popup.classList.add("show"), 10);
        };
    });

    document.querySelectorAll(".icon-btn[data-tooltip='ปริ้นที่อยู่']").forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.closest("tr").querySelector("td:first-child div").textContent.trim();
            const data = orders[orderId];
            if(!data) return;

            const popup = document.getElementById("printPopup");
            document.getElementById("printName").textContent = data.customer;
            document.getElementById("printAddress").textContent = data.address;
            document.getElementById("printZip").textContent = data.zip || '';
            document.getElementById("printdelivery").textContent = data.delivery;

            popup.style.display = "block";
            setTimeout(()=> popup.classList.add("show"), 10);
        };
    });

    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.onclick = () => {
            const popup = btn.closest(".popup-bottom-right, .popup");
            popup.classList.remove("show");
            setTimeout(()=> popup.style.display = "none", 300);
        };
    });
}

// --- Confirm Order ---
function attachConfirmOrderEvents() {
    document.querySelectorAll(".confirm-order").forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.id;
            if(orders[orderId]) orders[orderId].status = 'confirmed';
            localStorage.setItem("orders", JSON.stringify(orders));
            renderOrders();
        };
    });
}

// --- แสดง popup รูปใหญ่ ---
function attachPreviewEvents() {
    document.querySelectorAll(".preview-img").forEach(img => {
        img.onclick = () => {
            const src = img.getAttribute("data-full");
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
            overlay.innerHTML = `<img src="${src}" style="max-width:90%; max-height:90%; border:2px solid #fff; border-radius:5px;"><span style="position:absolute;top:20px;right:40px;font-size:30px;color:#fff;cursor:pointer;">&times;</span>`;
            document.body.appendChild(overlay);
            overlay.querySelector("span").onclick = () => overlay.remove();
        };
    });
}

// --- Auto-update ทุก 2 วินาที ---
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    setInterval(renderOrders, 2000);
});
