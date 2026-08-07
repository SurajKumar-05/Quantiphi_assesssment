# The Subscription Tracker & Multi-Currency Ledger Engine

**The Subscription Tracker** is a full-stack financial dashboard designed to track, normalize, and audit recurring subscription expenses in real-time across multiple currencies (`USD`, `EUR`, `GBP`, `INR`).

---

## 🚀 Key Features

- **Multi-Currency System**: Each subscription stores its original billing currency (`USD $`, `EUR €`, `GBP £`, `INR ₹`).
- **Global Display Currency Switcher**: Live stamped-ticker currency selector converts all monthly burn rates and annual metrics server-side into the chosen display currency (`USD`, `EUR`, `GBP`, `INR`) instantly.
- **Original Amount Preservation**: Displays each row's original entered payment amount as a secondary label so users never lose track of original billing terms.
- **Cost Uniformity Engine**: Normalizes weekly, monthly, quarterly, and annual terms into monthly burn rates ($\text{Monthly Normalization} \rightarrow \text{Server Currency Conversion}$).
- **Tactile Financial Ledger Aesthetic**: Deep financial slate theme (`#0b0e14`), `IBM Plex Mono` display font, structured alternating ledger table rows, and tactile ON/OFF status switches.
- **Urgent Renewal Alert Badge**: Reserved eye-catching Fiery Alert (`#ff5500`) badge for subscriptions renewing within 3 days.

---

## 📁 Repository Structure

```text
subscription-tracker/
├── backend/
│   ├── config/db.js                 # In-memory store with multi-currency seed data
│   ├── models/Subscription.js       # Subscription model schema & currency validation
│   ├── services/
│   │   ├── costEngine.js            # Cost Uniformity Engine (monthly normalization)
│   │   ├── currencyEngine.js        # Server-side exchange rate conversion math
│   │   └── dateEngine.js            # Renewal date calculations
│   ├── middleware/validate.js       # Payload validation
│   ├── controllers/subscriptionController.js # Multi-currency API handlers
│   ├── routes/subscriptionRoutes.js # Express router
│   └── server.js                    # Express server (Port 5000)
└── frontend/
    ├── index.html                   # HTML entry ("The Subscription Tracker")
    ├── vite.config.js
    └── src/
        ├── api/subscriptionApi.js    # API client with displayCurrency support
        ├── hooks/useSubscriptions.js  # React custom hook for currency state
        ├── components/
        │   ├── EntryForm.jsx        # Modal form with per-subscription currency selector
        │   ├── MetricsRow.jsx       # Hero Monthly Burn Rate & global currency switcher
        │   ├── SubscriptionTable.jsx# Structured ledger table
        │   ├── SubscriptionRow.jsx  # Row with secondary original currency label
        │   └── ToggleSwitch.jsx     # Tactile toggle switch
        ├── App.jsx                  # Main dashboard container
        └── index.css                # Financial ledger stylesheet
```

---

## 🧮 Multi-Currency Calculation Logic

Following strict server-side architecture rules:
1. **Monthly Normalization First**:
   $$\text{Monthly Cost (Original Currency)} = \frac{\text{Cost} \times \text{Annual Cycles}}{12}$$
2. **Currency Conversion Second**:
   $$\text{Converted Monthly Cost} = \text{convertCurrency}(\text{Monthly Cost}, \text{Original Currency}, \text{Display Currency})$$

---

## 💻 Quick Start

### 1. Run Backend Server
```bash
cd subscription-tracker/backend
npm install
npm run dev
```

### 2. Run Frontend Client
```bash
cd subscription-tracker/frontend
npm install
npm run dev
```
Open `http://localhost:3000`.
