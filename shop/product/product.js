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

function toggleProfilePopup() {
  const popup = document.getElementById('profilePopup');
  popup.classList.toggle('show');
}

window.addEventListener('click', function (e) {
  const popup = document.getElementById('profilePopup');
  const icon = document.querySelector('.profile-icon');
  if (!icon.contains(e.target)) {
    popup.classList.remove('show');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('product-table');
  const popup = document.getElementById('editPopup');
  const editType = document.getElementById('editType');
  const editSize = document.getElementById('editSize');
  const editPrice = document.getElementById('editPrice');
  const saveBtn = document.getElementById('saveEdit');
  const cancelBtn = document.getElementById('cancelEdit');

  let currentRow = null;

  // ✅ เมื่อกดปุ่ม "แก้ไข"
  table.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      currentRow = e.target.closest('.table-row');
      const cells = currentRow.querySelectorAll('div:not(:last-child)');

      // เติมค่าลงใน popup
      editType.value = cells[1].innerText.trim();
      editSize.value = cells[2].innerText.trim();
      editPrice.value = cells[3].innerText.trim();

      // แสดง popup
      popup.style.display = 'flex';
    }
  });

  // ✅ ปุ่ม "บันทึก"
  saveBtn.addEventListener('click', () => {
    if (currentRow) {
      const cells = currentRow.querySelectorAll('div:not(:last-child)');
      cells[1].innerText = editType.value;
      cells[2].innerText = editSize.value;
      cells[3].innerText = editPrice.value;

      alert('บันทึกการแก้ไขเรียบร้อยแล้ว ✅');
      popup.style.display = 'none';
    }
  });

  // ✅ ปุ่ม "ยกเลิก"
  cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // ✅ ปิด popup เมื่อคลิกพื้นหลัง
  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.style.display = 'none';
  });
});
