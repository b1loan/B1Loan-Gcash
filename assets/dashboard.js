// assets/dashboard.js - money simulation
(function(){
  if (!document.body.classList.contains('page-dashboard')) return;
  const moneyDisplay = document.getElementById('moneyDisplay');
  const simulateReset = document.getElementById('simulateReset');
  const MAX = 20000000;
  const MIN_AFTER_MAX = 10000000;
  const DECREASE_FAST = 348045;
  const INCREASE_AMOUNT = 220000;

  function numFmt(n){ return '₱' + n.toLocaleString('en-PH', {maximumFractionDigits:0}); }

  let state = JSON.parse(localStorage.getItem('b1_sim_state') || 'null');
  if (!state){
    const start = Math.floor(13678 + Math.random() * (604552 - 13678));
    state = { value: start, mode: 'normal' };
  }
  moneyDisplay.textContent = numFmt(state.value);

  const decInterval = setInterval(()=>{
    if (state.mode === 'normal') {
      const dec = Math.floor(13678 + Math.random()*(604552-13678));
      state.value = Math.max(0, state.value - dec);
    } else {
      state.value = Math.max(0, state.value - DECREASE_FAST);
      if (state.value <= MIN_AFTER_MAX) state.mode = 'normal';
    }
    moneyDisplay.textContent = numFmt(state.value);
    localStorage.setItem('b1_sim_state', JSON.stringify(state));
  }, 500);

  const incInterval = setInterval(()=>{
    state.value = state.value + INCREASE_AMOUNT;
    if (state.value >= MAX && state.mode !== 'afterMax') state.mode = 'afterMax';
    moneyDisplay.textContent = numFmt(state.value);
    localStorage.setItem('b1_sim_state', JSON.stringify(state));
  }, 3000);

  if (simulateReset) simulateReset.addEventListener('click', function(){ localStorage.removeItem('b1_sim_state'); location.reload(); });

})();
