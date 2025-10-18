// ดึงข้อมูลจาก localStorage
function displayOrderStatus() {
    const orders = JSON.parse(localStorage.getItem('orders')) || {};
    const container = document.getElementById('orderTableContainer');
    container.innerHTML = '';

    if (Object.keys(orders).length === 0) {
        container.innerHTML = '<p>คุณยังไม่มีคำสั่งซื้อ</p>';
        return;
    }

    // จัดกลุ่มตามสถานะ
    const statusGroups = {
        'รับงานแล้ว': [],
        'ตรวจสอบการชำระเงิน': [],
        'กำลังดำเนินการ': [],
        'กำลังจัดส่ง': [],
        'จัดส่งสำเร็จแล้ว': []
    };

    for (const [orderId, order] of Object.entries(orders)) {
        if (!order.status) order.status = 'รับงานแล้ว';
        if (!statusGroups[order.status]) statusGroups[order.status] = [];
        statusGroups[order.status].push({ orderId, ...order });
    }

    // สร้าง HTML ตามสถานะ
    for (const [status, orderList] of Object.entries(statusGroups)) {
        if (orderList.length === 0) continue;

        const statusDiv = document.createElement('div');
        statusDiv.className = 'status-group';
        statusDiv.innerHTML = `<h4>${status} (${orderList.length})</h4>`;

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>รหัสคำสั่งซื้อ</th>
                    <th>สินค้า</th>
                    <th>ขนาด</th>
                    <th>จำนวน</th>
                    <th>วัสดุ</th>
                    <th>ราคา</th>
                    <th>วิธีจัดส่ง</th>
                    <th>ที่อยู่</th>
                    <th>รูปสินค้า</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        orderList.forEach(order => {
            const row = document.createElement('tr');

            // แสดงรูปสินค้า
            let productHTML = 'ไม่มีรูป';
            if (order.image) {
                productHTML = `<img src="${order.image}" alt="สินค้า" style="width:100px; height:100px; object-fit:cover; border:1px solid #ccc; border-radius:5px;">`;
            }

            // จัดที่อยู่ให้อ่านง่าย
            const addressHTML = order.address ? order.address.replace(/\n/g, '<br>') : 'ไม่ระบุ';

            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.product}</td>
                <td>${order.width} x ${order.height}</td>
                <td>${order.quantity}</td>
                <td>${order.material}</td>
                <td>${order.total}</td>
                <td>${order.delivery}</td>
                <td style="text-align:left; line-height:1.4; font-size:12px;">${addressHTML}</td>
                <td>${productHTML}</td>
            `;

            tbody.appendChild(row);
        });

        statusDiv.appendChild(table);
        container.appendChild(statusDiv);
    }
}

// เรียกฟังก์ชันเมื่อโหลดหน้า
window.addEventListener('DOMContentLoaded', displayOrderStatus);
