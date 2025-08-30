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

document.querySelectorAll('.payment').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const popup = document.querySelector(target);
    if (popup) popup.style.display = 'block';
  });
});

document.querySelectorAll('#closePopup').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.popup').style.display = 'none';
  });
});

const orders = {
  WA110666: {
    customer: "สมชาย",
    type: "roll-up",
    quantity: "1 ชิ้น",
    total: "270 บาท",
    address: "123/4 ถนนสุขใจ เขตเมือง",
    delivery: "Kerry Express"
  },
  WA110555: {
    customer: "สมหญิง",
    type: "x-stand",
    quantity: "1 ชิ้น",
    total: "340 บาท",
    address: "56/7 ถนนเพลินใจ เขตเมือง",
    delivery: "Flash Express"
  }
};

document.querySelectorAll(".icon-btn[data-tooltip='รายละเอียดคำสั่งซื้อ']").forEach(btn => {
  btn.addEventListener("click", () => {
    const orderId = btn.closest("tr").querySelector("td:first-child div").textContent.trim();
    const data = orders[orderId];
    if(!data) return;

    document.getElementById("orderId").textContent = orderId;
    document.getElementById("customerName").textContent = data.customer;
    document.getElementById("productType").textContent = data.type;
    document.getElementById("quantity").textContent = data.quantity;
    document.getElementById("total").textContent = data.total;
    document.getElementById("address").textContent = data.address;
    document.getElementById("delivery").textContent = data.delivery;

    const popup = document.getElementById("detailsPopup");
    popup.style.display = "block";
    setTimeout(()=> popup.classList.add("show"), 10);
  });
});

document.querySelectorAll(".icon-btn[data-tooltip='ปริ้นที่อยู่']").forEach(btn => {
  btn.addEventListener("click", () => {
    const orderId = btn.closest("tr").querySelector("td:first-child div").textContent.trim();
    const data = orders[orderId];
    if(!data) return;

    document.getElementById("printName").textContent = data.customer;
    document.getElementById("printAddress").textContent = data.address;
    document.getElementById("printZip").textContent = "10110";
    document.getElementById("printdelivery").textContent = data.delivery;

    const popup = document.getElementById("printPopup");
    popup.style.display = "block";
    setTimeout(()=> popup.classList.add("show"), 10);
  });
});

document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const popup = btn.closest(".popup-bottom-right");
    popup.classList.remove("show");
    setTimeout(()=> popup.style.display = "none", 300); 
  });
});

document.getElementById("printBtn").addEventListener("click", () => {
  const printContents = document.getElementById("printContent").innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); 
});
