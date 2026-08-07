# The Subscription Tracker & Multi-Currency Ledger Engine

**The Subscription Tracker** is a full-stack financial dashboard designed to track, normalize, and audit recurring subscription expenses in real-time across multiple currencies (`USD`, `EUR`, `GBP`, `INR`).

---

## 🎨 UI Aesthetic & Theme System

- **Pure White Canvas (`#FFFFFF`)**: Crisp, light financial ledger theme with slate grid rules (`#CBD5E1`) and high-contrast charcoal ink text (`#0F172A`).
- **Typography Pairing**:
  - `IBM Plex Mono`: Characterful display font for prices, monthly burn rate figures, dates, and status stamps.
  - `Space Grotesk`: Clean structural body and heading typeface.
- **Hero Monthly Burn Rate**: The Total Monthly Burn Rate is rendered as the main hero ticker banner at the top of the dashboard.
- **Global Display Currency Switcher**: Stamped ticker selector (`USD $` | `EUR €` | `GBP £` | `INR ₹`) converting the entire dashboard live without page reloads.
- **Tactile Active/Paused Toggle**: Paused items feature a diagonal hatched texture, strikethrough cost display, and an explicit `OFF / PAUSED` stamp switch.
- **Eye-Catching "RENEWING SOON" Badge**: Reserved high-visibility crimson alert dot (`#DC2626`) for subscriptions renewing within 7 days.

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
    ├── vite.config.js               # API proxy to backend
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

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/subscriptions` | List subscriptions (supports `?displayCurrency=`, `?category=`, `?status=`, `?search=`) |
| `GET` | `/api/subscriptions/metrics` | Get aggregated financial metrics converted to `?displayCurrency=` |
| `POST` | `/api/subscriptions` | Create subscription record with original currency |
| `GET` | `/api/subscriptions/:id` | Get details for single subscription |
| `PUT` | `/api/subscriptions/:id` | Update subscription details & currency |
| `PATCH` | `/api/subscriptions/:id/toggle` | Toggle `active` $\leftrightarrow$ `paused` status |
| `DELETE` | `/api/subscriptions/:id` | Delete subscription record |

---

## 📜 Commit History (`git log --oneline`)

```text
4c4095e feat: pre-populate backend with 6 realistic seed subscriptions and update README
0f4fcdb style: change dashboard background to pure white (#FFFFFF) with high contrast UI rules
1bb5a1c feat: rename app to The Subscription Tracker & add multi-currency conversion system
f695d0c style: financial ledger UI redesign with hero monthly burn rate and tactile switches
00fede4 chore: README + gitignore
b7ace30 feat: wire frontend to backend, real-time burn rate on toggle
2c943b0 feat(frontend): metrics row + subscription table + toggle switch
f02b252 feat(frontend): entry form + api layer
df1e703 feat(backend): subscription CRUD + toggle + metrics endpoints
d49b6a7 feat(backend): cost engine + date engine services
3ddd3e8 init: project scaffold + folder structure
```

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
