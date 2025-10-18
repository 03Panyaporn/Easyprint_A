document.addEventListener('DOMContentLoaded', () => {

  // --- Cart ---
  const cartTableBody = document.querySelector(".cart-table tbody");
  const totalDiv = document.querySelector(".cart-total");
  const cartBadge = document.getElementById("cart-count"); // badge

  function updateCartCount() {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const count = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

      if (cartBadge) {
          if (count > 0) {
              cartBadge.innerText = count;
              cartBadge.style.display = "inline";
          } else {
              cartBadge.innerText = "";
              cartBadge.style.display = "none";
          }
      }
  }

  function renderCart() {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      cartTableBody.innerHTML = "";
      let total = 0;

      cartItems.forEach((item, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${item.product}</td>
              <td>${item.imgSrc ? `<img src="${item.imgSrc}" width="80">` : ""}</td>
              <td>${item.width} x ${item.height}</td>
              <td>${item.quantity} ชิ้น</td>
              <td>${item.material}</td>
              <td>${item.price} บาท</td>
              <td><button class="delete-btn" data-index="${index}"><img src="icon/trash-2.svg"></button></td>
          `;
          cartTableBody.appendChild(row);
          total += parseFloat(item.price);
      });

      if(totalDiv){
          totalDiv.innerHTML = `ยอดรวมสินค้าทั้งหมด <b>${total.toFixed(2)} บาท</b>`;
      }

      // ลบสินค้า
      document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", function () {
              const index = btn.getAttribute("data-index");
              const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
              cartItems.splice(index, 1);
              localStorage.setItem("cartItems", JSON.stringify(cartItems));
              renderCart();
              updateCartCount(); // อัปเดต badge หลังลบ
          });
      });

      updateCartCount(); // อัปเดต badge หลัง render
  }

  renderCart();

  // --- Delivery method ---
  const radios = document.querySelectorAll('input[name="delivery-method"]');
  const selectPickup = document.getElementById('select-pickup');
  const selectShipping = document.getElementById('select-shipping');
  const confirmBtn = document.querySelector('.confirm-btn');

  function updateSelects() {
      if (document.querySelector('input[value="pickup"]').checked) {
          selectPickup.disabled = false;
          selectShipping.disabled = true;
          selectShipping.selectedIndex = 0;
      } else if (document.querySelector('input[value="shipping"]').checked) {
          selectPickup.disabled = true;
          selectPickup.selectedIndex = 0;
          selectShipping.disabled = false;
      }
  }

  radios.forEach(radio => radio.addEventListener('change', updateSelects));
  updateSelects();

  // --- Confirm order ---
  confirmBtn.addEventListener('click', (e) => {
      e.preventDefault(); // กันการ reload

      let errors = [];

      const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
      if (!deliveryMethod) {
          errors.push("กรุณาเลือกวิธีการจัดส่ง");
      } else {
          if (deliveryMethod.value === "pickup" && selectPickup.value === "") errors.push("กรุณาเลือกจุดนัดรับ");
          if (deliveryMethod.value === "shipping" && selectShipping.value === "") errors.push("กรุณาเลือกบริการขนส่ง");
      }

      const upfile = document.getElementById('upfile');
      if (!upfile.value) errors.push("กรุณาอัปโหลดหลักฐานการโอนเงิน");

      const slip = document.querySelector('input[name="slip"]:checked');
      if (!slip) errors.push("กรุณาเลือกว่าต้องการใบเสร็จหรือไม่");

      if (errors.length > 0) {
          alert(errors.join("\n"));
          return;
      }

      // --- เก็บคำสั่งซื้อไปหน้า Shop ---
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

      if (cartItems.length > 0) {
          const orders = JSON.parse(localStorage.getItem("orders") || "{}");

          cartItems.forEach((item, index) => {
              const orderId = "WA" + Date.now() + index;

              orders[orderId] = {
                  customer: "ลูกค้าไม่ระบุ",
                  product: item.product,
                  quantity: item.quantity + " ชิ้น",
                  material: item.material,
                  total: parseFloat(item.price).toFixed(2) + " บาท",
                  width: item.width,
                  height: item.height,
                  delivery: deliveryMethod.value === "pickup" ? selectPickup.value : selectShipping.value,
                  address: document.querySelector('input[name="address"]:checked + .address-content')?.innerText || "ไม่ระบุ",
                  slip: slip.value,
                  image: item.imgSrc || ""
              };
          });

          localStorage.setItem("orders", JSON.stringify(orders));

          // --- ล้างตะกร้า ---
          localStorage.removeItem("cartItems");

          alert("ยืนยันการสั่งซื้อเรียบร้อย!");
          // --- ส่งลูกค้าไปหน้าติดตามสถานะ ---
          window.location.href = "../status/order-received.html";
      }
  });

  // --- Location dropdown ---
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
              document.getElementById('selectedLocations').innerText = this.value;
          }
      });
  });

  // --- User menu ---
  const userBtn = document.getElementById("userBtn");
  const userMenu = document.getElementById("userMenu");

  userBtn.addEventListener("click", function (e) {
      e.preventDefault();
      userMenu.style.display = userMenu.style.display === "block" ? 'none' : 'block';
  });

  document.addEventListener("click", function (e) {
      if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
          userMenu.style.display = "none";
      }
  });

  // --- Edit/Delete Address ---
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

});

