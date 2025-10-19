// DOM Elements
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboardPage");
const loginPage = document.getElementById("loginPage");
const logoutBtn = document.getElementById("logoutBtn");
const moneyDisplay = document.getElementById("moneyDisplay");

// Default money values
let money = 13678;
let maxMoney = 20000000;
let minMoney = 10000000;
let increasing = true;
let simulationInterval;

// --- Check if user is already logged in ---
window.addEventListener("load", () => {
  const storedUser = JSON.parse(localStorage.getItem("userAccount"));
  const storedMoney = parseFloat(localStorage.getItem("userBalance"));

  if (storedUser) {
    showDashboard(storedUser);
    if (!isNaN(storedMoney)) {
      money = storedMoney;
      moneyDisplay.textContent = "₱" + money.toLocaleString();
    }
  }
});

// --- Login Event ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    gcash: document.getElementById("gcashNumber").value,
    pin: document.getElementById("pin").value,
    gmail: document.getElementById("gmail").value
  };

  // Save user locally
  localStorage.setItem("userAccount", JSON.stringify(user));

  showDashboard(user);
});

// --- Logout Event ---
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userAccount"); // Remove saved user
  localStorage.removeItem("userBalance"); // Remove saved balance
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");

  // Reset money simulation
  clearInterval(simulationInterval);
  money = 13678;
  moneyDisplay.textContent = "₱13,678";
});

// --- Show Dashboard ---
function showDashboard(user) {
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
  document.querySelector("h2").innerHTML = `Welcome, ${user.name}`;
  startSimulation();
}

// --- Money Simulation ---
function startSimulation() {
  clearInterval(simulationInterval); // Prevent multiple intervals
  simulationInterval = setInterval(() => {
    if (increasing) {
      money += 220000; // increase money
      if (money >= maxMoney) increasing = false;
    } else {
      money -= 348045; // decrease money
      if (money <= minMoney) increasing = true;
    }

    moneyDisplay.textContent = "₱" + money.toLocaleString();
    localStorage.setItem("userBalance", money); // Save current balance
  }, 500);
}

// --- Loan Calculator ---
function calculateLoan() {
  const amount = parseFloat(document.getElementById("loanAmount").value);
  const result = document.getElementById("loanResult");

  if (isNaN(amount) || amount <= 0) {
    result.innerHTML = "<p>Please enter a valid loan amount.</p>";
    return;
  }

  const interest6 = amount * 0.18;
  const total6 = amount + interest6;

  const interest12 = amount * 0.21;
  const total12 = amount + interest12;

  result.innerHTML = `
    <p><strong>Loan Amount:</strong> ₱${amount.toLocaleString()}</p>
    <p><strong>6 months (18%):</strong> ₱${total6.toLocaleString()}</p>
    <p><strong>12 months (21%):</strong> ₱${total12.toLocaleString()}</p>
  `;
}
