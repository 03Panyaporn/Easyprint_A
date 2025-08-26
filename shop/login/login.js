function goNextPage1() {
    window.location.href = '../login/login.html'; 
  }

function goNextPage2() {
    window.location.href = '../Member1/Member1.html'; 
  }

function showError(id, show){
    const el = document.getElementById(id);
    if(!el) return;
    el.classList.toggle('show', !!show);
    }
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    if (!email.value || !email.checkValidity()){
    showError('emailErr', true);
    email.focus({preventScroll:true});
    valid = false;
    }else{
    showError('emailErr', false);
    }
    if (password.value.length < 6){
    showError('pwdErr', true);
    if(valid){ password.focus({preventScroll:true}); }
    valid = false;
    }else{
    showError('pwdErr', false);
    }
    if(!valid) return;
    alert('ล็อกอินสำเร็จ (เดโม)\n\nEmail: ' + email.value);
    form.reset();
    });
    document.getElementById('forgot').addEventListener('click', (e)=>{
    e.preventDefault();
    prompt('กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน:', email.value || '');
    });
    document.getElementById('signup').addEventListener('click', ()=>{
    alert('ไปหน้าสมัครสมาชิก (เดโม)');
    });