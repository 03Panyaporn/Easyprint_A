
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

    ////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  const locationMenu = document.getElementById('locationMenu');
 
  // โหลดข้อมูลที่อยู่จาก localStorage
  const saved = JSON.parse(localStorage.getItem('addresses')) || [];
 
  // ถ้ามีข้อมูล ให้เพิ่มเข้าใน dropdown
  saved.forEach((addr, index) => {
    const div = document.createElement('div');
    div.classList.add('location-option');
 
    div.innerHTML = `
      <label class="option-content">
        <input type="radio" name="address" value="${addr.type}">
        <span class="option-title">${addr.type}</span>
      </label>
      <div class="option-detail">
        ${addr.fname} ${addr.lname}<br>
        ${addr.houseNo}, หมู่ ${addr.village}, ${addr.subdistrict}<br>
        ${addr.district}, ${addr.province} ${addr.zipcode}<br>
        ${addr.phone}
      </div>
      <div class="option-actions">
        <button class="edit-btn" title="แก้ไข"><img src="icon/edit-30.svg" alt="แก้ไข"></button>
        <button class="delete-btn" title="ลบ" data-index="${index}"><img src="icon/trash-20.svg" alt="ลบ"></button>
      </div>
    `;
    locationMenu.insertBefore(div, locationMenu.querySelector('.add-location'));
  });
 
  // ปุ่มลบที่อยู่
  locationMenu.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
      const index = e.target.closest('.delete-btn').dataset.index;
      const saved = JSON.parse(localStorage.getItem('addresses')) || [];
      saved.splice(index, 1);
      localStorage.setItem('addresses', JSON.stringify(saved));
      location.reload();
    }
  });
});
 
