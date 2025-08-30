function goNextPageMember31() {
  window.location.href = '../Member2/Member2.html'; 
}

function goNextPageMember32() {
  window.location.href = '../Main_shop/Main_shop.html'; 
}

(function initStepper(){
    const stepper = document.getElementById('stepper');
    if(!stepper) return;
  
    const steps = [...stepper.querySelectorAll('.steps .step')];
    const fill  = stepper.querySelector('.track .fill');
  
    const activeIndex = steps.findIndex(s => s.classList.contains('active'));
    const lastIndex   = steps.length - 1;
  
    const percent = Math.max(0, Math.min(100, (activeIndex / lastIndex) * 100));
    fill.style.width = percent + '%';
  })();
  
  document.getElementById('extraForm')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('ยินดีต้อนรับเข้าสู่EASYPRINT — เริ่มการใช้งาน');
  });
  
  document.getElementById('backBtn')?.addEventListener('click', () => {
    history.back();
  });
  