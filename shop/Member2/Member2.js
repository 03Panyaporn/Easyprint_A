function goNextPageMember21() {
  window.location.href = '../Member1/Member1.html'; 
}

function goNextPageMember22() {
  window.location.href = '../Member3/Member3.html'; 
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
  
  (function initAddAccount(){
    const btn = document.getElementById('btnAdd');
    const list = document.getElementById('accountList');
    const tpl = document.getElementById('tplAccount');
  
    if(!btn || !list || !tpl) return;
  
    btn.addEventListener('click', () => {
      const clone = tpl.content.cloneNode(true);
  
      const index = list.querySelectorAll('.account').length + 1;
      clone.querySelectorAll('select, input').forEach((el) => {
        if(el.name.includes('bank'))   el.id = `bank-${index}`;
        if(el.name.includes('accno'))  el.id = `accno-${index}`;
        if(el.name.includes('accname'))el.id = `accname-${index}`;
      });
      clone.querySelectorAll('label').forEach((lb) => {
        const text = lb.textContent.trim();
        if(text.includes('เลือกธนาคาร')) lb.setAttribute('for', `bank-${index}`);
        if(text.includes('เลขที่บัญชี')) lb.setAttribute('for', `accno-${index}`);
        if(text.includes('ชื่อบัญชี'))   lb.setAttribute('for', `accname-${index}`);
      });
  
      list.appendChild(clone);
    });
  })();
  
  (function initSubmit(){
    const form = document.getElementById('bankForm');
    if(!form) return;
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const banks   = [...form.querySelectorAll('select[name="bank[]"]')];
      const accnos  = [...form.querySelectorAll('input[name="accno[]"]')];
      const accnames= [...form.querySelectorAll('input[name="accname[]"]')];
  
      const firstValid =
        banks.some(b => b.value) &&
        accnos.some(a => a.value.trim() !== '') &&
        accnames.some(n => n.value.trim() !== '');
  
        if(!firstValid){
          setTimeout(() => {
            alert('กรุณากรอกข้อมูลบัญชีอย่างน้อย 1 บัญชีให้ครบถ้วน');
          }, 0);
          return;
        }
  
      alert('บันทึกข้อมูลสำเร็จ');
    });
  })();
  