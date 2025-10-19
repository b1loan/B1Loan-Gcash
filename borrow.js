// borrow.js - loan calculation
(function(){
  if (!document.body.classList.contains('page-borrow')) return;

  const loanInput = document.getElementById('loanAmount');
  const monthsSelect = document.getElementById('loanMonths');
  const calcBtn = document.getElementById('calcBtn');
  const calcResult = document.getElementById('calcResult');
  const loanBreakdown = document.getElementById('loanBreakdown');
  const proceedPayBtn = document.getElementById('proceedPayBtn');
  const interestRateTxt = document.getElementById('interestRateTxt');

  function updateInterestText(){
    const months = parseInt(monthsSelect.value,10);
    interestRateTxt.textContent = (months === 6) ? '18%' : '21%';
  }
  monthsSelect.addEventListener('change', updateInterestText);
  updateInterestText();

  function clamp(val, min, max){
    return Math.max(min, Math.min(max, val));
  }

  calcBtn.addEventListener('click', function(){
    const principal = clamp(parseInt(loanInput.value || '0',10), 1000, 110000);
    const months = parseInt(monthsSelect.value, 10);
    const rate = months === 6 ? 18 : 21;
    const fee = 568;

    // simple interest calculation (as before)
    const interestAmount = Math.round(principal * (rate/100));
    const totalRepay = principal + interestAmount;
    const monthlyDue = Math.ceil(totalRepay / months);

    loanBreakdown.innerHTML = `
      • Loan Amount: ₱${principal.toLocaleString()}<br>
      • Loan Period: ${months} months (payments due every 30th)<br>
      • Interest Rate: ${rate}%<br>
      • Interest Amount: ₱${interestAmount.toLocaleString()}<br>
      • Total Repayment: ₱${totalRepay.toLocaleString()}<br>
      • Monthly Payment: ₱${monthlyDue.toLocaleString()}<br>
      • Platform & Processing Fee: ₱${fee.toLocaleString()} (pay now)<br>
    `;
    calcResult.hidden = false;

    proceedPayBtn.classList.remove('disabled');
    proceedPayBtn.removeAttribute('aria-disabled');
    proceedPayBtn.href = 'payment.html';
    const pending = {
      principal, months, rate, interestAmount, totalRepay, monthlyDue, fee, createdAt: Date.now()
    };
    localStorage.setItem('b1_pending_loan', JSON.stringify(pending));
  });

  const existing = localStorage.getItem('b1_pending_loan');
  if (existing) {
    proceedPayBtn.classList.remove('disabled');
    proceedPayBtn.removeAttribute('aria-disabled');
    proceedPayBtn.href = 'payment.html';
  }

})();
