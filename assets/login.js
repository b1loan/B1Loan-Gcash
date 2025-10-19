// assets/login.js - simple auth using localStorage
(function(){
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const pin = document.getElementById('pin').value.trim();
      const email = document.getElementById('email').value.trim();
      const profile = { name, phone, email, loggedAt: Date.now() };
      localStorage.setItem('b1_profile', JSON.stringify(profile));
      // redirect to dashboard after login
      window.location.href = 'dashboard.html';
    });
  }

  function ensureLoggedIn() {
    const profileRaw = localStorage.getItem('b1_profile');
    if (!profileRaw) {
      window.location.href = 'index.html';
      return null;
    }
    try { return JSON.parse(profileRaw); } catch(e){ localStorage.removeItem('b1_profile'); window.location.href='index.html'; return null; }
  }

  const welcomeText = document.getElementById('welcomeText');
  if (welcomeText) {
    const profile = ensureLoggedIn();
    if (profile) welcomeText.textContent = 'Hi, ' + profile.name;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(){
      localStorage.removeItem('b1_profile');
      localStorage.removeItem('b1_sim_state');
      window.location.href = 'index.html';
    });
  }
})();
