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
 
    const userBtn = document.getElementById("userBtn");
    const userMenu = document.getElementById("userMenu");
    const locationBtn = document.getElementById('locationBtn');
    const locationMenu = document.getElementById('locationMenu');
    const selectedSpan = document.getElementById('selectedLocation');

    locationBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        locationMenu.style.display = locationMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => locationMenu.style.display = 'none');

    document.querySelectorAll('.location-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                selectedSpan.innerText = this.value;

            }
        });
    });

    document.querySelectorAll('.location-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                document.getElementById('selectedLocations').innerText = this.value;

            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            window.location.href = "../editaddress/address.html"; 
    });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const option = btn.closest('.location-option');

            if (option) {
                const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?");
                if (confirmed) {
                    option.remove();
                    alert("ลบที่อยู่นี้เรียบร้อย");
                }
            }
        });
    });
    userBtn.addEventListener("click", function (e) {
        e.preventDefault();
        userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (e) {
        if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.style.display = "none";
        }
    });
