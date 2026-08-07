// In-memory database store for The Subscription Tracker
// Pre-populated seed subscriptions covering real-world services, multi-currency terms, and upcoming renewal alerts.

const today = new Date();
const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

// Dynamic date helpers to ensure urgent renewal alerts (< 7 days) always show relative to runtime
const getRecentStartDate = (daysUntilRenewal, monthsAgo = 6) => {
  const d = new Date(today);
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(today.getDate() + daysUntilRenewal);
  return formatDate(d);
};

let subscriptions = [
  {
    id: "sub-seed-1",
    name: "Spotify Family Plan",
    cost: 16.99,
    currency: "EUR",
    frequency: "monthly",
    category: "Entertainment",
    startDate: getRecentStartDate(2, 12), // Renews in 2 days (RENEWING SOON ALERT)
    status: "active",
    autoRenew: true,
    description: "6 Premium accounts (EU Billing)",
    createdAt: new Date("2023-08-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-08-01T10:00:00Z").toISOString()
  },
  {
    id: "sub-seed-2",
    name: "Notion Plus & AI",
    cost: 10.00,
    currency: "USD",
    frequency: "monthly",
    category: "Software",
    startDate: getRecentStartDate(5, 4), // Renews in 5 days (RENEWING SOON ALERT)
    status: "active",
    autoRenew: true,
    description: "Unlimited blocks & Q&A AI assistant",
    createdAt: new Date("2024-02-15T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-15T10:00:00Z").toISOString()
  },
  {
    id: "sub-seed-3",
    name: "Netflix Premium 4K",
    cost: 22.99,
    currency: "USD",
    frequency: "monthly",
    category: "Entertainment",
    startDate: getRecentStartDate(14, 8), // Renews in 14 days
    status: "active",
    autoRenew: true,
    description: "4-screen UHD streaming tier with spatial audio",
    createdAt: new Date("2023-10-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-10-10T10:00:00Z").toISOString()
  },
  {
    id: "sub-seed-4",
    name: "AWS Cloud Infrastructure",
    cost: 145.00,
    currency: "USD",
    frequency: "monthly",
    category: "Infrastructure",
    startDate: "2023-11-01",
    status: "paused", // PAUSED ROW STYLE DEMO
    autoRenew: false,
    description: "EC2 cluster & S3 backup storage (Temporarily Paused)",
    createdAt: new Date("2023-11-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-11-01T10:00:00Z").toISOString()
  },
  {
    id: "sub-seed-5",
    name: "Adobe Creative Cloud",
    cost: 599.88,
    currency: "USD",
    frequency: "yearly",
    category: "Software",
    startDate: "2023-12-05",
    status: "active",
    autoRenew: true,
    description: "All Apps suite team annual license",
    createdAt: new Date("2023-12-05T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-12-05T10:00:00Z").toISOString()
  },
  {
    id: "sub-seed-6",
    name: "iCloud+ 200GB Storage",
    cost: 249.00,
    currency: "INR",
    frequency: "monthly",
    category: "Infrastructure",
    startDate: getRecentStartDate(18, 5), // Renews in 18 days
    status: "active",
    autoRenew: true,
    description: "Family Sharing & Private Relay (India region)",
    createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T10:00:00Z").toISOString()
  }
];

export const db = {
  getAll: () => [...subscriptions],
  getById: (id) => subscriptions.find((s) => s.id === id),
  create: (data) => {
    const newSub = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      currency: data.currency || "USD",
      status: data.status || "active",
      autoRenew: data.autoRenew !== undefined ? data.autoRenew : true,
      description: data.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    subscriptions.push(newSub);
    return newSub;
  },
  update: (id, updates) => {
    const index = subscriptions.findIndex((s) => s.id === id);
    if (index === -1) return null;
    subscriptions[index] = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return subscriptions[index];
  },
  toggleStatus: (id) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return null;
    sub.status = sub.status === "active" ? "paused" : "active";
    sub.updatedAt = new Date().toISOString();
    return sub;
  },
  delete: (id) => {
    const index = subscriptions.findIndex((s) => s.id === id);
    if (index === -1) return false;
    subscriptions.splice(index, 1);
    return true;
  }
};
