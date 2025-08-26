function goNextPageMember31() {
  window.location.href = '../Member2/Member2.html'; 
}

function goNextPageMember32() {
  window.location.href = '../Main_shop/Main_shop.html'; 
}

// คำนวณความยาวแถบความคืบหน้าตามตำแหน่ง .active
(function initStepper(){
    const stepper = document.getElementById('stepper');
    if(!stepper) return;
  
    const steps = [...stepper.querySelectorAll('.steps .step')];
    const fill  = stepper.querySelector('.track .fill');
  
    const activeIndex = steps.findIndex(s => s.classList.contains('active'));
    const lastIndex   = steps.length - 1;
  
    // 0, 1, 2 -> 0%, 50%, 100%
    const percent = Math.max(0, Math.min(100, (activeIndex / lastIndex) * 100));
    fill.style.width = percent + '%';
  })();
  
  // เดโมส่งฟอร์ม
  document.getElementById('extraForm')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('เริ่มใช้งาน (เดโม) — คุณสามารถเชื่อมต่อ API/บันทึกลงฐานข้อมูลต่อได้');
  });
  
  // ปุ่มย้อนกลับ (เดโม)
  document.getElementById('backBtn')?.addEventListener('click', () => {
    history.back();
  });
  