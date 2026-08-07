# The Subscription Tracker & Multi-Currency Ledger Engine

**The Subscription Tracker** is a full-stack financial dashboard designed to track, normalize, and audit recurring subscription expenses in real-time across multiple currencies (`USD`, `EUR`, `GBP`, `INR`).

---

## 🚀 Pre-Populated Seed Subscriptions

The backend in-memory database (`backend/config/db.js`) comes pre-populated with **6 real-world seed subscriptions** designed to demonstrate all UI and calculation features out-of-the-box:

| Service Name | Original Billed Terms | Original Currency | Status | Key Feature Demonstrated |
| :--- | :--- | :--- | :--- | :--- |
| **Spotify Family Plan** | €16.99 / monthly | `EUR (€)` | **Active** | 🔴 **Renewing Soon Alert** (< 7 days) |
| **Notion Plus & AI** | $10.00 / monthly | `USD ($)` | **Active** | 🔴 **Renewing Soon Alert** (< 7 days) |
| **Netflix Premium 4K** | $22.99 / monthly | `USD ($)` | **Active** | Monthly term normalization |
| **AWS Cloud Infrastructure** | $145.00 / monthly | `USD ($)` | ⏸️ **Paused** | **Tactile Paused Row** (Hatched texture & deferred rate) |
| **Adobe Creative Cloud** | $599.88 / yearly | `USD ($)` | **Active** | Yearly term normalization ($\frac{\$599.88}{12} = \$49.99/\text{mo}$) |
| **iCloud+ 200GB Storage** | ₹249.00 / monthly | `INR (₹)` | **Active** | INR currency conversion math |

> **Note**: Seed subscriptions dynamically pass through `backend/services/costEngine.js` and `backend/services/dateEngine.js` on every API request. Nothing is hardcoded.

---

## 📁 Repository Structure

```text
subscription-tracker/
├── backend/
│   ├── config/db.js                 # In-memory store pre-populated with 6 realistic seed records
│   ├── models/Subscription.js       # Subscription model schema & currency validation
│   ├── services/
│   │   ├── costEngine.js            # Cost Uniformity Engine (monthly normalization math)
│   │   ├── currencyEngine.js        # Server-side exchange rate conversion math
│   │   └── dateEngine.js            # Renewal date & countdown calculations
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
        │   ├── SubscriptionTable.jsx# Structured financial ledger table
        │   ├── SubscriptionRow.jsx  # Row display with tactile switch & secondary labels
        │   └── ToggleSwitch.jsx     # Tactile toggle switch
        ├── App.jsx                  # Main dashboard container
        └── index.css                # Pure white background high-contrast theme
```

---

## 🧮 Multi-Currency & Cost Engine Math

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
