document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('popup').style.display = 'flex';
    });
  });


  window.addEventListener('click', function (e) {
    const popup = document.getElementById('popup');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });
});


document.querySelectorAll('.shipping-table .switch input').forEach(switchInput => {
  switchInput.addEventListener('change', () => {

    const row = switchInput.closest('tr');
    const courierName = row.querySelector('td:first-child').textContent.trim();

    if (switchInput.checked) {
      console.log(`ขนส่ง ${courierName} เปิดใช้งานแล้ว`);

    } else {
      console.log(`ขนส่ง ${courierName} ปิดการใช้งานแล้ว`);

    }
  });
});

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function goToNotification() {
  window.location.href = "../Notification/Notification.html";
}
 
function goNextEditProfile() {
  window.location.href = '../Edit_profile/Edit_profile.html';
}

document.querySelector('.switch input').addEventListener('change', function () {
    if (this.checked) {
      alert("ระบบเปิดการทำงาน");
    } else {
      alert("ระบบปิดการทำงาน");
    }
  });
 
  document.querySelector('.topbar input').addEventListener('keyup', function () {
    let keyword = this.value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach(row => {
      let text = row.innerText.toLowerCase();
      row.style.display = text.includes(keyword) ? "" : "none";
    });
  });
 
 
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
 