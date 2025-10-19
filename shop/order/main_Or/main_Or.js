document.addEventListener('DOMContentLoaded', function() {

    let orders = JSON.parse(localStorage.getItem("orders") || "{}");

    const tbody = document.querySelector(".order-table tbody");

    function renderAllOrders() {
        tbody.innerHTML = ""; // ลบของเก่า
        orders = JSON.parse(localStorage.getItem("orders") || "{}");

        Object.keys(orders).forEach(orderId => {
            const data = orders[orderId];

            const row = document.createElement("tr");
            row.setAttribute("data-id", orderId);

            const previewContent = data.image
                ? `<img src="${data.image}" class="preview-img" data-full="${data.image}" style="width:80px; height:auto; display:block; object-fit:contain;">`
                : `<span style="color:red;">ไม่มีภาพ</span>`;

            let statusText = "";
            switch(data.status) {
                case "new": statusText = '<span class="status new">ออเดอร์ใหม่</span>'; break;
                case "confirmed": statusText = '<span class="status confirmed">ยืนยันออเดอร์</span>'; break;
                case "printing": statusText = '<span class="status printing">กำลังพิมพ์</span>'; break;
                case "preparing": statusText = '<span class="status preparing">เตรียมจัดส่ง</span>'; break;
                case "sent": statusText = '<span class="status sent">จัดส่งแล้ว</span>'; break;
                default: statusText = `<span class="status unknown">${data.status}</span>`;
            }

            row.innerHTML = `
                <td>${orderId}</td>
                <td>${statusText}</td>
                <td><b>${data.customer}</b></td>
                <td>${data.product}</td>
                <td>${data.quantity}</td>
                <td class="order-preview">${previewContent}</td>
                <td>
                    ${data.total} <br>
                    <button class="confirm-btn payment" data-target="#paymentPopup-${orderId}" style="margin-top:5px;">ตรวจสอบการชำระเงิน</button>
                </td>
                <td class="order-actions-cell">
                    <div class="icon-group" style="display:flex; gap:5px;">
                        <button class="icon-btn" data-tooltip="รายละเอียดคำสั่งซื้อ">📝</button>
                        <button class="icon-btn stop" data-tooltip="ปริ้นที่อยู่">🖨️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);

            // สร้าง popup การชำระเงิน ถ้าไม่มี
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

        // update order count
        const orderCountElement = document.getElementById("orderCount");
        if(orderCountElement) orderCountElement.innerText = Object.keys(orders).length;
    }

    renderAllOrders();

    // --- Event Delegation สำหรับปุ่มต่างๆ ---
    document.body.addEventListener('click', function(e){
        const target = e.target;

        // ปิด popup
        if(target.classList.contains('closePopup')){
            const popup = target.closest('.popup');
            if(popup) popup.classList.remove('show');
        }

        // เปิด popup การชำระเงิน
        if(target.classList.contains('confirm-btn') && target.classList.contains('payment')){
            const popupId = target.getAttribute('data-target');
            const popup = document.querySelector(popupId);
            if(popup) popup.classList.add('show');
        }

        // เปิด popup รายละเอียดคำสั่งซื้อ
        if(target.classList.contains('icon-btn') && target.dataset.tooltip === "รายละเอียดคำสั่งซื้อ"){
            const row = target.closest("tr");
            const orderId = row.getAttribute("data-id");
            const data = orders[orderId];
            if(!data) return;

            let detailsPopup = document.getElementById(`detailsPopup-${orderId}`);
            if(!detailsPopup){
                detailsPopup = document.createElement("div");
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
            }
            detailsPopup.classList.add('show');
        }

        // ปริ้นที่อยู่
        if(target.classList.contains('icon-btn') && target.dataset.tooltip === "ปริ้นที่อยู่"){
            const row = target.closest("tr");
            const orderId = row.getAttribute("data-id");
            const data = orders[orderId];
            if(!data) return;

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

        // preview image
        if(target.classList.contains('preview-img')){
            showPreviewImage(target.getAttribute('data-full'));
        }
    });

    function showPreviewImage(src){
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
});
