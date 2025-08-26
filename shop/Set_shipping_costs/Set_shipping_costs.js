// เปิดป๊อปอัปเมื่อคลิกปุ่ม "แก้ไขคำสั่ง"
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('popup').style.display = 'flex';
    });
  });

  // ปิดป๊อปอัปเมื่อคลิกด้านนอก
  window.addEventListener('click', function (e) {
    const popup = document.getElementById('popup');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });
});

