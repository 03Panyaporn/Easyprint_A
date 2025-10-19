
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
// โหลดที่อยู่จาก localStorage
document.addEventListener('DOMContentLoaded', function () {
  const saved = JSON.parse(localStorage.getItem('addresses')) || [];

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
        <button class="edit-btn" data-index="${index}" title="แก้ไข">
          <img src="icon/edit-30.svg" alt="แก้ไข">
        </button>
        <button class="delete-btn" data-index="${index}" title="ลบ">
          <img src="icon/trash-20.svg" alt="ลบ">
        </button>
      </div>
    `;
    locationMenu.insertBefore(div, locationMenu.querySelector('.add-location'));
  });

  // ✅ ปุ่มลบ
  locationMenu.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.delete-btn');
    if (delBtn) {
      const index = delBtn.dataset.index;
      const saved = JSON.parse(localStorage.getItem('addresses')) || [];
      const confirmed = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?");
      if (confirmed) {
        saved.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(saved));
        location.reload();
      }
    }
  });

  // ✅ ปุ่มแก้ไข
  locationMenu.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const index = editBtn.dataset.index;
      window.location.href = `../editaddress/address.html?edit=${index}`;
    }
  });
});

// เมื่อเลือก radio จะอัปเดตชื่อสถานที่ที่เลือกไว้
document.addEventListener('change', (e) => {
  if (e.target.name === 'address' && e.target.checked) {
    selectedSpan.innerText = e.target.value;
    const selected = document.getElementById('selectedLocations');
    if (selected) selected.innerText = e.target.value;
  }
});

// เมนูผู้ใช้
userBtn.addEventListener("click", function (e) {
  e.preventDefault();
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});
document.addEventListener("click", function (e) {
  if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.style.display = "none";
  }
});