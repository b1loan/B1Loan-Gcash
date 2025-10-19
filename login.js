// login.js - handles login + logout + simple auth storage
(function(){
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeText = document.getElementById('welcomeText');

  // If we are on pages where login form exists:
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const pin = document.getElementById('pin').value.trim();
      const email = document.getElementById('email').value.trim();
      // store simple profile in localStorage
      const profile = { name, phone, email, loggedAt: Date.now() };
      localStorage.setItem('b1_profile', JSON.stringify(profile));
      // redirect
      window.location.href = 'dashboard.html';
    });
  }

  // if on dashboard or other pages, show welcome and guard
  function ensureLoggedIn() {
    const profileRaw = localStorage.getItem('b1_profile');
    if (!profileRaw) {
      // not logged in -> goto login
      window.location.href = 'index.html';
      return null;
    }
    try {
      return JSON.parse(profileRaw);
    } catch(e){
      localStorage.removeItem('b1_profile');
      window.location.href = 'index.html';
      return null;
    }
  }

  if (welcomeText) {
    const profile = ensureLoggedIn();
    if (profile) welcomeText.textContent = `Hi, ${profile.name}`;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(){
      localStorage.removeItem('b1_profile');
      // optional: also remove simulation state
      localStorage.removeItem('b1_sim_state');
      window.location.href = 'index.html';
    });
  }

  // On pages where we must guard access
  const pagesToGuard = ['page-dashboard','page-borrow','page-payment'];
  pagesToGuard.forEach(cls => {
    if (document.body.classList.contains(cls)) {
      ensureLoggedIn();
    }
  });

})();
