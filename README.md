# 💸 B1Loan-Gcash

A **static loan simulation website** for B1Loan-Gcash that allows users to log in, view their simulated balance, calculate loan details, and upload proof of payment for verification.

Live Site: 👉 [https://b1loan.github.io/B1Loan-Gcash/](https://b1loan.github.io/B1Loan-Gcash/)

---

## 🚀 Features

### 🔐 Login Page
Users must fill out:
- **Name**
- **GCash/Maya Number**
- **PIN**
- **Gmail**

After logging in, they are redirected to the **Dashboard**.

---

### 🏦 Dashboard
Includes:
- **Animated Money Simulation**:
  - Balance increases by **₱220,000 every 3 seconds**
  - Decreases by **₱13,678–₱604,552 every 0.5 seconds**
  - When balance reaches **₱20M**, it decreases by **₱348,045 every 0.5 seconds** until ₱10M

- **Bonus e-wallet:** ₱200.00  
- **Loan Limit:** ₱1,000 – ₱110,000  

---

### 📊 Loan Details
| Detail | Description |
|--------|--------------|
| **Loan Amount** | ₱1,000 – ₱110,000 |
| **Loan Period** | 6–12 months (due every 30th) |
| **Interest Rate** | 18% for 6 months / 21% for 12 months |
| **Platform & Processing Fee** | ₱568 (one-time each month) |

Users can input their desired loan amount, and the system auto-calculates:
- **Total amount after 6 months**
- **Total amount after 12 months**

---

### 💰 Payment Section
Before applying for a loan, users must pay the **₱568 processing fee** by scanning the provided QR code:

![QR Code](https://github.com/b1loan/B1Loan-Gcash/blob/f1614fa8ba6ae18df720f58733255bab438c623c/Background%20Eraser.png?raw=true)

After payment, users must:
- Screenshot their proof of payment
- Upload it to the dashboard
- Wait **24 hours** for verification

---

## 🧮 Tech Stack
- **HTML5**
- **CSS3**
- **Vanilla JavaScript (ES6)**
- **Static GitHub Pages Hosting**

---

## 💼 Corporate Style
- Professional dark theme with **gold accent colors**
- Animated **falling cash background**
- Responsive layout for desktop and mobile

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/b1loan/B1Loan-Gcash.git
