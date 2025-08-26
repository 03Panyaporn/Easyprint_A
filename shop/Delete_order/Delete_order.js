let currentRowToDelete = null;

// เพิ่ม event listener ให้ปุ่มลบออเดอร์ (🗑️)
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".icon-btn.delete").forEach(button => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const orderId = row.querySelector("td div").innerText;
      document.getElementById("orderIdToDelete").textContent = "#" + orderId;
      currentRowToDelete = row;
      document.getElementById("deletePopup").style.display = "flex";
    });
  });
});

// ซ่อน popup เมื่อกดปุ่ม "ยกเลิก"
function hideDeletePopup() {
  document.getElementById("deletePopup").style.display = "none";
  currentRowToDelete = null;
}

// ลบออเดอร์เมื่อกด "ลบออเดอร์"
function confirmDelete() {
  if (currentRowToDelete) {
    currentRowToDelete.remove();
  }
  hideDeletePopup();
}
