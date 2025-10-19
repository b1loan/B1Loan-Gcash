// dashboard.js - money simulation with SVG bills
(function(){
  if (!document.body.classList.contains('page-dashboard') && !document.body.classList.contains('page-login')) return;

  // only on dashboard or login create visual bills
  const MAX = 20000000;
  const MIN_AFTER_MAX = 10000000;
  const DECREASE_FAST = 348045;
  const INCREASE_AMOUNT = 220000;

  function numFmt(n){
    return '₱' + n.toLocaleString('en-PH', {maximumFractionDigits:0});
  }

  // Simulation state for dashboard
  let moneyDisplay = document.getElementById('moneyDisplay');
  let simulateReset = document.getElementById('simulateReset');

  // If on login page (no moneyDisplay), we still spawn bills as background
  function spawnSVGBill(){
    const layer = document.querySelector('.cash-layer');
    if (!layer) return;
    const ns = "http://www.w3.org/2000/svg";
    const wrapper = document.createElement('div');
    const left = Math.random()*100;
    const size = 50 + Math.random()*60;
    wrapper.className = 'bill';
    wrapper.style.left = left + 'vw';
    wrapper.style.width = size + 'px';
    wrapper.style.height = (size*0.6) + 'px';
    const dur = 6 + Math.random()*8;
    wrapper.style.animationDuration = dur + 's';

    // create svg markup for a stylized peso bill
    const svg = document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 200 120');
    svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
    svg.innerHTML = `
      <defs>
        <linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#e6fff2"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
      </defs>
      <rect x="4" y="8" width="192" height="104" rx="8" fill="url(#g)" stroke="#cfeee0" stroke-width="2"/>
      <text x="26" y="66" font-size="42" font-weight="700" fill="#0b6b3d">₱</text>
      <text x="60" y="66" font-size="26" fill="#0b6b3d">PESO</text>
      <circle cx="170" cy="60" r="18" fill="#0b8f59"/>
    `;
    wrapper.appendChild(svg);
    layer.appendChild(wrapper);
    setTimeout(()=> wrapper.remove(), dur*1000 + 2000);
  }

  // Spawn initial bills
  for (let i=0;i<8;i++){
    setTimeout(spawnSVGBill, i*350);
  }
  setInterval(spawnSVGBill, 900);

  // If no dashboard money area (on login), do nothing further
  if (!moneyDisplay) return;

  // load or init state
  let state = JSON.parse(localStorage.getItem('b1_sim_state') || 'null');
  if (!state){
    const start = Math.floor(13678 + Math.random() * (604552 - 13678));
    state = { value: start, mode: 'normal' };
  }
  moneyDisplay.textContent = numFmt(state.value);

  // decrease interval
  const decInterval = setInterval(()=>{
    if (!state) return;
    if (state.mode === 'normal') {
      const dec = Math.floor(13678 + Math.random()*(604552-13678));
      state.value = Math.max(0, state.value - dec);
    } else if (state.mode === 'afterMax') {
      state.value = Math.max(0, state.value - DECREASE_FAST);
      if (state.value <= MIN_AFTER_MAX) state.mode = 'normal';
    }
    moneyDisplay.textContent = numFmt(state.value);
    localStorage.setItem('b1_sim_state', JSON.stringify(state));
  }, 500);

  // increase interval
  const incInterval = setInterval(()=>{
    state.value = state.value + INCREASE_AMOUNT;
    if (state.value >= MAX && state.mode !== 'afterMax') state.mode = 'afterMax';
    moneyDisplay.textContent = numFmt(state.value);
    localStorage.setItem('b1_sim_state', JSON.stringify(state));
  }, 3000);

  if (simulateReset) {
    simulateReset.addEventListener('click', function(){
      localStorage.removeItem('b1_sim_state');
      location.reload();
    });
  }
})();
