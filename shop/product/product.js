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

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('product-table');
  const countSpan = document.getElementById('selected-count');
  const sortSelect = document.getElementById('sort-by');

  function updateCount() {
    const rows = table.querySelectorAll('.table-row');
    countSpan.textContent = rows.length;
  }

  table.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn-delete')) {
      const row = e.target.closest('.table-row');
      if(row) {
        row.remove();
        updateCount();
      }
    }
  });

  updateCount();

  sortSelect.addEventListener('change', () => {
    const rowsArray = Array.from(table.querySelectorAll('.table-row'));
    
    rowsArray.sort((a, b) => {
      const dateA = new Date(a.getAttribute('data-created'));
      const dateB = new Date(b.getAttribute('data-created'));
      return dateA - dateB; 
    });

    rowsArray.forEach(row => table.appendChild(row));
  });
});