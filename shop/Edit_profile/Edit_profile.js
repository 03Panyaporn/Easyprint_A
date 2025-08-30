function goToNotification() {
    window.location.href = "../Notification/Notification.html";
  }
   
  function goNextEditProfile() {
    window.location.href = '../Edit_profile/Edit_profile.html';
  }
   
  // Toggle Switch
  document.querySelector('.switch input').addEventListener('change', function () {
      if (this.checked) {
        alert("ระบบเปิดการทำงาน");
      } else {
        alert("ระบบปิดการทำงาน");
      }
    });
   
    // Search Function
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
   