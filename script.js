const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboardPage");
const loginPage = document.getElementById("loginPage");
const logoutBtn = document.getElementById("logoutBtn");
const moneyDisplay = document.getElementById("moneyDisplay");

let money = 13678;
let maxMoney = 20000000;
let minMoney = 10000000;
let increasing = true;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
  startSimulation();
});

logoutBtn.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");
  money = 13678;
  moneyDisplay.textContent = "₱13,678";
});

function startSimulation() {
  setInterval(() => {
    if (increasing) {
      money += 220000;
      if (money >= maxMoney) increasing = false;
    } else {
      money -= 348045;
      if (money <= minMoney) increasing = true;
    }
    moneyDisplay.textContent = "₱" + money.toLocaleString();
  }, 500);
}

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
