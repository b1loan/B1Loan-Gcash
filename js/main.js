// Main JS for B1 Wallet demo site
(function(){
  // Helpers
  const $ = id => document.getElementById(id);

  // Peso falling animation (simple)
  function startPesoFall(){
    const wrap = document.getElementById('peso-fall');
    if(!wrap) return;
    // create many falling spans
    const colors = ['#0d47a1','#1976d2','#64b5f6','#e3f2fd'];
    for(let i=0;i<40;i++){
      const s = document.createElement('span');
      s.textContent = '₱';
      s.style.position = 'absolute';
      s.style.left = Math.random()*100 + '%';
      s.style.top = -Math.random()*20 + '%';
      s.style.fontSize = (10+Math.random()*26) + 'px';
      s.style.opacity = 0.8*Math.random()+0.2;
      s.style.color = colors[Math.floor(Math.random()*colors.length)];
      s.style.transform = 'rotate('+ (Math.random()*60-30) +'deg)';
      s.style.willChange = 'transform, top, left';
      wrap.appendChild(s);
      animateSpan(s, i);
    }
    function animateSpan(el, idx){
      const dur = 8000 + Math.random()*8000;
      const delay = Math.random()*2000;
      el.animate([
        {transform:'translateY(-10vh) rotate(0deg)', opacity:0},
        {transform:'translateY(110vh) rotate(360deg)', opacity:1}
      ], {duration:dur, delay:delay, iterations:Infinity, easing:'linear'});
    }
  }

  // Simulation of money changing numbers
  function startMoneySimulation(){
    const el = $('moneySim');
    if(!el) return;
    function format(n){
      return n.toLocaleString('en-PH', {style:'currency', currency:'PHP', minimumFractionDigits:2});
    }
    setInterval(()=>{
      const v = Math.floor(100000 + Math.random()*(1599999-100000+1));
      el.textContent = format(v);
    }, 500);
  }

  // Load saved user, show on dashboard
  function populateDashboard(){
    if(!$) return;
    const nameEl = $('userName');
    const walletEl = $('walletBalance');
    const borrowersEl = $('borrowers');
    const stored = localStorage.getItem('b1_user');
    if(stored){
      const user = JSON.parse(stored);
      if(nameEl) nameEl.textContent = user.name || 'User';
      if(walletEl){
        const bal = user.wallet || 500; // show bonus default
        walletEl.textContent = bal.toLocaleString('en-PH', {style:'currency', currency:'PHP', minimumFractionDigits:2});
      }
      if(borrowersEl) borrowersEl.textContent = user.borrowers || 678;
    }
  }

  // Login flow
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = $('name').value.trim();
      const phone = $('phone').value.trim();
      const email = $('email').value.trim();
      const remember = $('remember').checked;
      if(!name || !email){ alert('Please fill name and email.'); return; }
      const user = {name, phone, email, wallet:500, borrowers:678, firstTime:true, created: Date.now()};
      localStorage.setItem('b1_user', JSON.stringify(user));
      if(remember){
        localStorage.setItem('b1_remember', '1');
      } else {
        localStorage.removeItem('b1_remember');
      }
      // redirect to dashboard
      window.location.href = 'dashboard.html';
    });
  }

  // Borrow flow
  const borrowForm = document.getElementById('borrowForm');
  if(borrowForm){
    borrowForm.addEventListener('submit', function(e){
      e.preventDefault();
      const amount = parseInt($('loanAmount').value,10);
      const period = parseInt($('loanPeriod').value,10);
      if(isNaN(amount) || amount < 5000 || amount > 99999){
        alert('Loan must be between ₱5,000 and ₱99,999 and up to 5 digits.');
        return;
      }
      // calculate
      const interestRate = period === 6 ? 0.18 : 0.21;
      const interestAmount = Math.round(amount * interestRate * 100)/100;
      const platformFee = 894.33;
      const totalDue = Math.round((amount + interestAmount + platformFee) * 100)/100;
      const monthly = Math.round((totalDue / period) * 100)/100;
      // store as pending loan
      const loan = {amount, period, interestRate, interestAmount, platformFee, totalDue, monthly, created:Date.now(), status:'pending_payment'};
      localStorage.setItem('b1_pending_loan', JSON.stringify(loan));
      // store quick view for calc page
      localStorage.setItem('b1_last_calc', JSON.stringify(loan));
      // go to calc page
      window.location.href = 'calc.html';
    });
  }

  // On calc page show result
  const calcResultEl = document.getElementById('calcResult');
  if(calcResultEl){
    const loan = localStorage.getItem('b1_last_calc');
    if(loan){
      const L = JSON.parse(loan);
      calcResultEl.innerHTML = `<p>Loan Amount: ₱${Number(L.amount).toLocaleString('en-PH')}</p>
        <p>Loan Period: ${L.period} months</p>
        <p>Interest Rate: ${Math.round(L.interestRate*100)}%</p>
        <p>Interest Amount: ₱${L.interestAmount.toLocaleString('en-PH', {minimumFractionDigits:2})}</p>
        <p>Platform & Processing Fee: ₱${L.platformFee.toLocaleString('en-PH', {minimumFractionDigits:2})}</p>
        <p><strong>Total Due: ₱${L.totalDue.toLocaleString('en-PH', {minimumFractionDigits:2})}</strong></p>
        <p>Monthly Payment (approx): ₱${L.monthly.toLocaleString('en-PH', {minimumFractionDigits:2})}</p>
        <div style="margin-top:12px"><a class="btn primary" href="payment.html">Proceed to Payment (show QR)</a></div>`;
    } else {
      calcResultEl.textContent = 'No calculation found. Please create a loan from Borrow page.';
    }
  }

  // Payment upload handling
  const uploadBtn = document.getElementById('uploadBtn');
  if(uploadBtn){
    uploadBtn.addEventListener('click', function(){
      const fileInput = $('uploadProof');
      if(!fileInput.files || fileInput.files.length===0){ alert('Please choose a screenshot before uploading.'); return; }
      // simulate upload by saving file name locally (not sending anywhere)
      const file = fileInput.files[0];
      const loan = JSON.parse(localStorage.getItem('b1_pending_loan')||'null');
      if(!loan){ alert('No pending loan found. Please calculate your loan first.'); return; }
      loan.proof = file.name;
      loan.status = 'verification';
      loan.uploadedAt = Date.now();
      localStorage.setItem('b1_pending_loan', JSON.stringify(loan));
      // show status and redirect to dashboard and mark waiting
      const status = $('status');
      if(status) status.textContent = 'Uploaded. Your payment proof has been submitted. Verification in 24 hours.';
      setTimeout(()=>{ window.location.href = 'dashboard.html'; }, 1200);
    });
  }

  // On dashboard populate and start money sim
  if(window.location.pathname.endsWith('dashboard.html')){
    startMoneySimulation();
    startPesoFall();
    populateDashboard();
  } else {
    // for other pages still start peso animation
    startPesoFall();
  }

  // On index show peso and maybe prefill if remembered
  if(window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')){
    startPesoFall();
    const rem = localStorage.getItem('b1_remember');
    const user = JSON.parse(localStorage.getItem('b1_user')||'null');
    if(rem && user){
      // prefill
      $('name').value = user.name||'';
      $('phone').value = user.phone||'';
      $('email').value = user.email||'';
      $('remember').checked = true;
    }
  }

  // On logout link clear state moderately
  const logoutLink = document.getElementById('logout');
  if(logoutLink){
    logoutLink.addEventListener('click', function(e){
      // keep remember option respected
      if(!localStorage.getItem('b1_remember')){
        localStorage.removeItem('b1_user');
      }
      // redirect handled by link
    });
  }

})();