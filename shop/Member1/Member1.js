function goNextPage() {
    window.location.href = '../Member2/Member2.html'; 
  }

document.getElementById('shopForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const shopName = document.getElementById('shopName').value;
    const shopAddress = document.getElementById('shopAddress').value;
    const shopSubdistrict = document.getElementById('shopSubdistrict').value;
    const shopPhone = document.getElementById('shopPhone').value;
    const shopImage = document.getElementById('shopImage').files[0];


    console.log({
        email, password, shopName, shopAddress, shopSubdistrict, shopPhone, shopImage
    });

    alert("ส่งฟอร์มเรียบร้อย!");
});
