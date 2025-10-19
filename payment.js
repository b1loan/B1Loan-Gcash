// payment.js - handle upload and modal
(function(){
  if (!document.body.classList.contains('page-payment')) return;

  const pendingRaw = localStorage.getItem('b1_pending_loan');
  if (!pendingRaw) {
    setTimeout(()=> window.location.href='borrow.html', 600);
    return;
  }
  const pending = JSON.parse(pendingRaw);

  const screenshot = document.getElementById('screenshot');
  const submitBtn = document.getElementById('submitPayment');
  const afterSubmit = document.getElementById('afterSubmit');

  submitBtn.addEventListener('click', function(){
    const file = screenshot.files[0];
    if (!file) {
      alert('Please upload a screenshot of your payment transaction.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e){
      const payload = {
        pending,
        proofDataUrl: e.target.result,
        submittedAt: Date.now(),
        status: 'pending_verification'
      };
      const appsRaw = localStorage.getItem('b1_applications') || '[]';
      const apps = JSON.parse(appsRaw);
      apps.push(payload);
      localStorage.setItem('b1_applications', JSON.stringify(apps));
      localStorage.removeItem('b1_pending_loan');
      afterSubmit.hidden = false;
      submitBtn.disabled = true;
    };
    reader.readAsDataURL(file);
  });

  // modal controls
  window.openQRModal = function(){
    const m = document.getElementById('qrModal');
    if (!m) return;
    m.setAttribute('aria-hidden','false');
  };
  window.closeQRModal = function(){
    const m = document.getElementById('qrModal');
    if (!m) return;
    m.setAttribute('aria-hidden','true');
  };
})();
