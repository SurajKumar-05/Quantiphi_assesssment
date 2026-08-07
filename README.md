# SubPulse - Subscription Tracker & Cost Uniformity Engine

**SubPulse** is a full-stack financial dashboard designed to track, normalize, and optimize recurring subscription expenses in real-time. By converting irregular billing cycles (weekly, monthly, quarterly, annual) into normalized monthly burn rates ($/mo), SubPulse provides true visibility into active recurring commitments and financial overhead.

---

## 🚀 Key Features

- **Cost Uniformity Engine**: Automatically converts weekly, monthly, quarterly, and annual costs into equivalent monthly, annual, and daily burn rates.
- **Date Intersect Calculator**: Calculates next renewal dates, days remaining until payment, and interval overlap cost proration.
- **Real-Time Status Toggling**: Instantly toggle subscriptions between `active` and `paused` with real-time recalculation of total monthly burn rate and projected savings.
- **Interactive Financial Dashboard**: Dynamic metric cards for Monthly Burn Rate, 12-Month Projected Spend, Active vs. Paused counts, and Upcoming Payment Alerts.
- **Filtered Subscription Table**: Search by name or note, filter by category tab or active status, and sort by burn rate or renewal urgency.
- **Glassmorphic Aesthetic UI**: Premium dark mode design system with subtle glow accents, custom toggle switches, and smooth micro-animations.

---

## 📁 Repository Structure

```text
subscription-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # In-memory database store with seed data & CRUD helpers
│   ├── models/
│   │   └── Subscription.js       # Subscription data model contract & schema validator
│   ├── services/
│   │   ├── costEngine.js         # Cost Uniformity Engine (frequency normalization & metrics math)
│   │   └── dateEngine.js         # Date Intersect Calculator (renewal dates & proration math)
│   ├── middleware/
│   │   └── validate.js           # Request payload validation middleware
│   ├── controllers/
│   │   └── subscriptionController.js # REST API handlers for CRUD, status toggle, & metrics
│   ├── routes/
│   │   └── subscriptionRoutes.js # Express router endpoints
│   └── server.js                 # Main Express server (Port 5000)
└── frontend/
    ├── index.html                # Main HTML entry with font imports
    ├── vite.config.js            # Vite configuration with backend API proxy
    └── src/
        ├── api/
        │   └── subscriptionApi.js # API client for Express backend endpoints
        ├── hooks/
        │   └── useSubscriptions.js # Custom React hook for state management & optimistic updates
        ├── components/
        │   ├── EntryForm.jsx     # Subscription creation/editing modal with live monthly preview
        │   ├── MetricsRow.jsx    # Real-time KPI overview cards
        │   ├── SubscriptionTable.jsx # Filterable, sortable subscription table wrapper
        │   ├── SubscriptionRow.jsx   # Individual row with status toggle & actions
        │   └── ToggleSwitch.jsx  # Custom animated switch component
        ├── App.jsx               # Dashboard application container
        ├── main.jsx              # React mounting root
        └── index.css             # Glassmorphic design system & styling
```

---

## 🧮 Math & Calculation Engines

### 1. Cost Uniformity Engine (`backend/services/costEngine.js`)

Converts any billing cycle into an equivalent monthly burn rate ($/mo):

- **Weekly**: $\text{Monthly Cost} = \frac{\text{Cost} \times 52}{12}$
- **Monthly**: $\text{Monthly Cost} = \text{Cost}$
- **Quarterly**: $\text{Monthly Cost} = \frac{\text{Cost}}{3}$
- **Yearly**: $\text{Monthly Cost} = \frac{\text{Cost}}{12}$

### 2. Date Intersect Calculator (`backend/services/dateEngine.js`)

- Computes upcoming billing dates dynamically from subscription start dates.
- Calculates interval overlap costs for custom date ranges.

---

## 💻 Quick Start

### 1. Run the Backend API

```bash
cd subscription-tracker/backend
npm install
npm run dev
```

The Express server will launch on `http://localhost:5000`.

### 2. Run the Frontend Client

```bash
cd subscription-tracker/frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/subscriptions` | List all subscriptions (supports `?category=`, `?status=`, `?search=`) |
| `GET` | `/api/subscriptions/metrics` | Get aggregated financial metrics & upcoming renewals |
| `POST` | `/api/subscriptions` | Create a new subscription record |
| `GET` | `/api/subscriptions/:id` | Get details for a single subscription |
| `PUT` | `/api/subscriptions/:id` | Update an existing subscription |
| `PATCH` | `/api/subscriptions/:id/toggle` | Toggle `active` $\leftrightarrow$ `paused` status |
| `DELETE` | `/api/subscriptions/:id` | Delete a subscription record |
