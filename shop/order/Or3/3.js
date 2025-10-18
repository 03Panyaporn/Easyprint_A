// --- ดึง Orders จาก localStorage ---
let orders = JSON.parse(localStorage.getItem("orders") || "{}");

// --- Render Orders ที่กำลังพิมพ์ (printing) ---
// --- Render Orders ที่กำลังพิมพ์ (printing) ---
function renderPrintingOrders() {
    const tbody = document.querySelector(".order-table tbody");
    tbody.innerHTML = "";
    let orders = JSON.parse(localStorage.getItem("orders") || "{}");

    Object.keys(orders).forEach(orderId => {
        const data = orders[orderId];
        if(data.status !== "printing") return; // ✅ แสดงเฉพาะ printing

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${orderId}</td>
            <td>${data.customer}</td>
            <td>${data.product}</td>
            <td>${data.quantity}</td>
            <td>${data.total}</td>
            <td>${data.image ? `<img src="${data.image}" class="preview-img" data-full="${data.image}" style="width:80px;">` : "-"}</td>
            <td>
                <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
                <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachPreviewEvents();
    attachIconEvents();
}

// --- Auto render หน้า 3 ---
document.addEventListener('DOMContentLoaded', () => {
    renderPrintingOrders();
    setInterval(renderPrintingOrders, 2000); // อัพเดททุก 2 วินาที
});


// --- แสดง popup รายละเอียด / ปริ้น ---
function attachIconEvents() {
    document.querySelectorAll(".icon-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const row = e.target.closest("tr");
            const orderId = row.querySelector("td:first-child").textContent.trim();
            const data = orders[orderId];
            if(!data) return;

            // รายละเอียดคำสั่งซื้อ
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

            // ปริ้นที่อยู่
            if(btn.dataset.tooltip === "ปริ้นที่อยู่") {
                const printContent = `
                    <h3>คำสั่งซื้อ #${orderId}</h3>
                    <p><b>ลูกค้า:</b> ${data.customer}</p>
                    <p><b>ที่อยู่:</b> ${data.address}</p>
                    <p><b>จัดส่งแบบ:</b> ${data.delivery}</p>
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

// --- แสดง preview / ขยายภาพเต็ม ---
function attachPreviewEvents() {
    document.querySelectorAll(".preview-img").forEach(img => {
        img.onclick = () => showPreviewImage(img.getAttribute("data-full"));
    });
}

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

// --- Search / Filter ---
document.querySelector('.topbar input').addEventListener('keyup', function () {
    let keyword = this.value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(keyword) ? "" : "none";
    });
});

// --- Toggle Profile Popup ---
function toggleProfilePopup() {
    const popup = document.getElementById('profilePopup');
    popup.classList.toggle('show');
}

window.addEventListener('click', function(e) {
    const popup = document.getElementById('profilePopup');
    const icon = document.querySelector('.profile-icon');
    if (!icon.contains(e.target)) {
        popup.classList.remove('show');
    }
});