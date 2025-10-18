
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
