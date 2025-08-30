document.addEventListener('DOMContentLoaded', function() {
    const paymentButtons = document.querySelectorAll('.confirm-btn.payment');
    const paymentPopup = document.getElementById('paymentPopup');
    const closeBtn = document.getElementById('closePopup');

    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentPopup.classList.add('show');
        });
    });

    closeBtn.addEventListener('click', () => {
        paymentPopup.classList.remove('show');
    });

  
    document.querySelectorAll('.icon-btn:not(.stop)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('orderPopup').classList.add('show');
      });
    });

    document.querySelectorAll('.icon-btn.stop').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('printPopup').classList.add('show');
      });
    });

    document.querySelectorAll('.close-popup').forEach(btn => {
      btn.addEventListener('click', function() {
        this.closest('.popup').classList.remove('show');
      });
    });

    const profileIcon = document.querySelector('.profile-icon');
    const profilePopup = document.getElementById('profilePopup');
    profileIcon.addEventListener('click', () => {
        profilePopup.classList.toggle('show');
    });
    window.addEventListener('click', function(e) {
        if (!profileIcon.contains(e.target)) {
            profilePopup.classList.remove('show');
        }
    });

    const toggleSwitch = document.querySelector('.switch input');
    toggleSwitch.addEventListener('change', function () {
        alert(this.checked ? "ระบบเปิดการทำงาน" : "ระบบปิดการทำงาน");
    });


    const searchInput = document.querySelector('.searchbar input');
    searchInput.addEventListener('keyup', function () {
        let keyword = this.value.toLowerCase();
        document.querySelectorAll("tbody tr").forEach(row => {
            let text = row.innerText.toLowerCase();
            row.style.display = text.includes(keyword) ? "" : "none";
        });
    });
  });


  function goToNotification() {
    window.location.href = "../../Notification/Notification.html";
  }

  function goNextEditProfile() {
    window.location.href = '../../Edit_profile/Edit_profile.html';
  }

