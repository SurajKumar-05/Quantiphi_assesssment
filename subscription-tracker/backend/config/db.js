// In-memory database store for Subscription Tracker

let subscriptions = [
  {
    id: "sub-1",
    name: "Netflix Premium 4K",
    cost: 22.99,
    currency: "USD",
    frequency: "monthly",
    category: "Entertainment",
    startDate: "2024-01-15",
    status: "active",
    autoRenew: true,
    description: "4-screen UHD streaming tier",
    createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T10:00:00Z").toISOString()
  },
  {
    id: "sub-2",
    name: "AWS Cloud Hosting",
    cost: 145.00,
    currency: "USD",
    frequency: "monthly",
    category: "Infrastructure",
    startDate: "2023-11-01",
    status: "paused",
    autoRenew: true,
    description: "EC2 & S3 storage cluster",
    createdAt: new Date("2023-11-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-11-01T10:00:00Z").toISOString()
  },
  {
    id: "sub-3",
    name: "GitHub Copilot Enterprise",
    cost: 220.00,
    currency: "USD",
    frequency: "yearly",
    category: "Software",
    startDate: "2024-03-01",
    status: "active",
    autoRenew: true,
    description: "AI Pair programming team license",
    createdAt: new Date("2024-03-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-03-01T10:00:00Z").toISOString()
  },
  {
    id: "sub-4",
    name: "Spotify Family Plan",
    cost: 16.99,
    currency: "EUR",
    frequency: "monthly",
    category: "Entertainment",
    startDate: "2023-08-10",
    status: "active",
    autoRenew: true,
    description: "6 premium accounts (EU Billing)",
    createdAt: new Date("2023-08-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-08-10T10:00:00Z").toISOString()
  },
  {
    id: "sub-5",
    name: "Equinox Fitness Club",
    cost: 35.00,
    currency: "GBP",
    frequency: "weekly",
    category: "Health",
    startDate: "2024-02-01",
    status: "paused",
    autoRenew: false,
    description: "Weekly membership pass (London)",
    createdAt: new Date("2024-02-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-01T10:00:00Z").toISOString()
  },
  {
    id: "sub-6",
    name: "Adobe Creative Cloud",
    cost: 599.88,
    currency: "USD",
    frequency: "yearly",
    category: "Software",
    startDate: "2023-12-05",
    status: "active",
    autoRenew: true,
    description: "All Apps suite",
    createdAt: new Date("2023-12-05T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-12-05T10:00:00Z").toISOString()
  },
  {
    id: "sub-7",
    name: "ChatGPT Plus",
    cost: 1650.00,
    currency: "INR",
    frequency: "monthly",
    category: "Software",
    startDate: "2024-04-10",
    status: "active",
    autoRenew: true,
    description: "GPT-4o & Web browsing (India billing)",
    createdAt: new Date("2024-04-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-04-10T10:00:00Z").toISOString()
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
