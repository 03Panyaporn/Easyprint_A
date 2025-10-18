// --- เปิด popup การชำระเงิน ด้วย Event Delegation ---
document.querySelector(".order-table tbody").addEventListener("click", (e) => {
    const btn = e.target.closest(".payment");
    if(!btn) return; // ไม่ใช่ปุ่ม payment

    const target = btn.getAttribute('data-target');
    const popup = document.querySelector(target);
    if (popup) popup.style.display = 'block';
});

// --- ปิด popup การชำระเงิน ---
document.addEventListener('click', (e) => {
    if(e.target.id === 'closePopup') {
        e.target.closest('.popup').style.display = 'none';
    }
});


// --- ดึง Orders จาก localStorage ---
let orders = JSON.parse(localStorage.getItem("orders") || "{}");

// --- Render Orders ยืนยันแล้ว (confirmed) ---
function renderConfirmedOrders() {
    const tbody = document.querySelector(".order-table tbody");
    tbody.innerHTML = "";
    orders = JSON.parse(localStorage.getItem("orders") || "{}");

    Object.keys(orders).forEach(orderId => {
        const data = orders[orderId];

        if(data.status !== 'confirmed') return; // ✅ แสดงเฉพาะ confirmed

        const row = document.createElement("tr");
        row.classList.add("order-row");

        const previewContent = data.image
            ? `<img src="${data.image}" alt="preview" class="preview-img" data-full="${data.image}" style="width:80px; height:auto; display:block; object-fit:contain;">`
            : `<span style="color:red;">ไม่มีภาพ</span>`;

        row.innerHTML = `
    <td>${orderId}</td>
    <td><span class="status confirmed">ยืนยันแล้ว</span></td>
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
            <button class="confirm-btn printing-btn" data-order-id="${orderId}">กำลังพิมพ์</button>
            <div class="icon-group" style="display:flex; gap:5px;">
                <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
                <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
            </div>
        </div>
    </td>
`;


        tbody.appendChild(row);

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

    attachPreviewEvents();
    attachIconEvents();
    attachPrintingButtons();
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
            const orderId = row.querySelector("td:first-child").textContent.trim();
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
                                <button class="closeDetailsPopup">&times;</button>
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
                    detailsPopup.querySelector(".closeDetailsPopup").onclick = () => detailsPopup.remove();
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

// --- เพิ่มปุ่มกำลังพิมพ์ บนแต่ละแถว ---
function attachPrintingButtons() {
    document.querySelectorAll(".printing-btn").forEach(btn => {
        btn.onclick = (e) => {
            const row = e.target.closest("tr");
            const orderId = row.querySelector("td:first-child").textContent.trim();

            // ดึง orders จาก localStorage
            let orders = JSON.parse(localStorage.getItem("orders") || "{}");
            if(!orders[orderId]) return;

            // เปลี่ยน status เป็น printing
            orders[orderId].status = "printing";

            // บันทึกกลับ localStorage
            localStorage.setItem("orders", JSON.stringify(orders));

            // ลบแถวออกจากหน้า 2
            row.remove();

            // ไปหน้า 3.html อัตโนมัติ
            window.location.href = "3.html";
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
    renderConfirmedOrders(); // ✅ เรียกแสดง confirmed
    setInterval(renderConfirmedOrders, 2000);
});
