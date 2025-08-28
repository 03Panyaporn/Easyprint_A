document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="delivery-method"]');
    const selectPickup = document.getElementById('select-pickup');
    const selectShipping = document.getElementById('select-shipping');
    const confirmBtn = document.querySelector('.confirm-btn');
  
    // อัปเดตการเลือกขนส่ง
    function updateSelects() {
      if (document.querySelector('input[value="pickup"]').checked) {
        selectPickup.disabled = false;
        selectShipping.disabled = true;
        selectShipping.selectedIndex = 0;
      } else if (document.querySelector('input[value="shipping"]').checked) {
        selectPickup.disabled = true;
        selectPickup.selectedIndex = 0;
        selectShipping.disabled = false;
      }
    }
    radios.forEach(radio => radio.addEventListener('change', updateSelects));
    updateSelects();
  
    // ตรวจสอบก่อนยืนยัน
    confirmBtn.addEventListener('click', (e) => {
      let errors = [];
  
      // ตรวจสอบวิธีจัดส่ง
      const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
      if (!deliveryMethod) {
        errors.push("กรุณาเลือกวิธีการจัดส่ง");
      } else {
        if (deliveryMethod.value === "pickup" && selectPickup.value === "") {
          errors.push("กรุณาเลือกจุดนัดรับ");
        }
        if (deliveryMethod.value === "shipping" && selectShipping.value === "") {
          errors.push("กรุณาเลือกบริการขนส่ง");
        }
      }
  
      // ตรวจสอบไฟล์อัปโหลด
      const upfile = document.getElementById('upfile');
      if (!upfile.value) {
        errors.push("กรุณาอัปโหลดหลักฐานการโอนเงิน");
      }
  
      // ตรวจสอบใบเสร็จ
      const slip = document.querySelector('input[name="slip"]:checked');
      if (!slip) {
        errors.push("กรุณาเลือกว่าต้องการใบเสร็จหรือไม่");
      }
  
      if (errors.length > 0) {
        e.preventDefault();
        alert(errors.join("\n"));
      } else {
        alert("ยืนยันการสั่งซื้อเรียบร้อย!");
      }
    });
  });
  
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      if (confirm("คุณต้องการลบสินค้านี้ออกจากตะกร้าจริงหรือไม่?")) {
        const row = this.closest("tr"); // หาว่าอยู่แถวไหน
        row.remove(); // ลบแถวออก
        alert("ลบสินค้าสำเร็จ");
      }
    });
  });