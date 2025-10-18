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

        // ✅ แสดงภาพสินค้าจากลูกค้าใน preview
        const previewContent = data.image
            ? `<img src="${data.image}" alt="preview" class="preview-img" data-full="${data.image}" style="width:80px; height:auto; display:block; object-fit:contain;">`
            : `<span style="color:red;">ไม่มีภาพ</span>`;

        row.innerHTML = `
            <td>${orderId}</td>
            <td><span class="status ${data.status || 'waiting'}">${data.status === 'confirmed' ? 'ยืนยันแล้ว' : 'รอคิว'}</span></td>
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

        if (data.status === 'waiting') waitingCount++;

        // --- สร้าง popup การชำระเงิน ---
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
    if (newOrderBtn) newOrderBtn.textContent = waitingCount;

    attachConfirmOrderEvents();
    attachPreviewEvents();
    attachIconEvents(); // ✅ ผูก event ปุ่มรายละเอียดและปริ้น
}

// --- Confirm Order ---
function attachConfirmOrderEvents() {
    document.querySelectorAll(".confirm-order").forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.id;
            if (orders[orderId]) orders[orderId].status = 'confirmed';
            localStorage.setItem("orders", JSON.stringify(orders));
            renderOrders();
        };
    });
}

// --- แสดง preview / ขยายภาพเต็ม ---
function attachPreviewEvents() {
    document.querySelectorAll(".preview-img").forEach(img => {
        img.onclick = () => showPreviewImage(img.getAttribute("data-full"));
    });
}

// --- แสดง popup รายละเอียด / ปริ้น ---
function attachIconEvents() {
    document.querySelectorAll(".icon-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const row = e.target.closest("tr");
            const orderId = row.querySelector(".confirm-order").dataset.id;
            const data = orders[orderId];
            if (!data) return;

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
                            <p><b>วัสดุ:</b> ${data.material}</p>
                            <p><b>ขนาด:</b> ${data.width} x ${data.height}</p>
                            <p><b>ยอดรวม:</b> ${data.total}</p>
                            <p><b>วิธีจัดส่ง:</b> ${data.delivery}</p>
                            <p><b>ที่อยู่:</b> ${data.address}</p>
                            ${data.image ? `<img src="${data.image}" style="max-width:200px; display:block; margin-top:10px;">` : ''}
                        </div>
                    `;
                    document.body.appendChild(detailsPopup);
                    detailsPopup.querySelector(".closeDetailsPopup").onclick = () => detailsPopup.remove();
                } else {
                    existingPopup.style.display = "block";
                }
            }


            if (btn.dataset.tooltip === "ปริ้นที่อยู่") {
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

// --- แสดงภาพเต็ม (popup) ---
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

// --- Auto-update ทุก 2 วินาที ---
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    setInterval(renderOrders, 2000);
});

// -------------------- ระบบนับจำนวนออเดอร์ใหม่ --------------------
function updateNewOrderCount() {
    const orders = JSON.parse(localStorage.getItem("orders") || "{}");
    let waitingCount = 0;

    Object.keys(orders).forEach(orderId => {
        if (orders[orderId].status === "waiting") waitingCount++;
    });

    const newOrderBox = document.querySelector('a[href="../Or1/1.html"] span');
    if (newOrderBox) newOrderBox.textContent = waitingCount;

    const totalBox = document.querySelector('a[href="../main_Or/main_Or.html"] span');
    if (totalBox) totalBox.textContent = Object.keys(orders).length;
}

document.addEventListener("DOMContentLoaded", () => {
    updateNewOrderCount();
    setInterval(updateNewOrderCount, 2000);
});
