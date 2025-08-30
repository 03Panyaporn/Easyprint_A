const salesData = {
    daily: {
        labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
        datasets: [
            {
                label: 'โปสเตอร์ - ยอดขาย (บาท)',
                data: [1500, 1800, 1200, 2000, 1700, 2100, 1900],
                borderColor: 'rgba(58, 174, 163, 1)',
                backgroundColor: 'rgba(58, 174, 163, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'โรลอัพ - ยอดขาย (บาท)',
                data: [1000, 1200, 900, 1300, 1100, 1400, 1250],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'เอ็กสแตน - ยอดขาย (บาท)',
                data: [800, 950, 700, 1000, 850, 1100, 900],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3
            }
        ]
    },
    weekly: {
        labels: ['สัปดาห์ 1','สัปดาห์ 2','สัปดาห์ 3','สัปดาห์ 4'],
        datasets: [
            {
                label: 'โปสเตอร์ - ยอดขาย (บาท)',
                data: [12000, 15000, 13000, 16000],
                borderColor: 'rgba(58, 174, 163, 1)',
                backgroundColor: 'rgba(58, 174, 163, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'โรลอัพ - ยอดขาย (บาท)',
                data: [8000, 9000, 8500, 9500],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'เอ็กสแตน - ยอดขาย (บาท)',
                data: [6000, 7000, 6500, 7200],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3
            }
        ]
    },
    monthly: {
        labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
        datasets: [
            {
                label: 'โปสเตอร์ - ยอดขาย (บาท)',
                data: [50000, 55000, 53000, 58000, 60000, 62000],
                borderColor: 'rgba(58, 174, 163, 1)',
                backgroundColor: 'rgba(58, 174, 163, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'โรลอัพ - ยอดขาย (บาท)',
                data: [35000, 37000, 36000, 38000, 40000, 41000],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'เอ็กสแตน - ยอดขาย (บาท)',
                data: [25000, 27000, 26000, 28000, 30000, 31000],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3
            }
        ]
    }
};

let currentPeriod = 'daily';
const ctx = document.getElementById('salesChart').getContext('2d');
let salesChart = new Chart(ctx, {
    type: 'line',
    data: salesData[currentPeriod],
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
    }
});


document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        updateChart();
    });
});

function updateChart() {
    salesChart.data = salesData[currentPeriod];
    salesChart.update();
}

function updateTable() {
    const tbody = document.querySelector("#salesTable tbody");
    tbody.innerHTML = ""; // ล้างก่อน
    const data = salesData[currentPeriod];
    const rows = data.labels.map((label, index) => {
      const poster = data.datasets[0].data[index];
      const rollup = data.datasets[1].data[index];
      const xstand = data.datasets[2].data[index];
      return `<tr>
        <td>${label}</td>
        <td>${poster}</td>
        <td>${rollup}</td>
        <td>${xstand}</td>
      </tr>`;
    });
    tbody.innerHTML = rows.join("");
  }
  
  updateTable();
  
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      salesChart.data = salesData[currentPeriod];
      salesChart.update();
      updateTable(); 
    });
  });
  
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
   