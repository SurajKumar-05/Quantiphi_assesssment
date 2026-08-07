// API Service client for communicating with Subscription Tracker backend

const BASE_URL = '/api/subscriptions';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network response error' }));
    throw new Error(errorData.error || errorData.details?.[0] || 'API request failed');
  }
  return response.json();
};

export const subscriptionApi = {
  // Fetch all subscriptions with optional search/filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);

    const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL;
    const res = await fetch(url);
    return handleResponse(res);
  },

  // Fetch aggregated dashboard metrics
  getMetrics: async () => {
    const res = await fetch(`${BASE_URL}/metrics`);
    return handleResponse(res);
  },

  // Create a new subscription
  create: async (subscriptionData) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData)
    });
    return handleResponse(res);
  },

  // Update existing subscription
  update: async (id, subscriptionData) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData)
    });
    return handleResponse(res);
  },

  // Toggle active / paused status instantly
  toggleStatus: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/toggle`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  // Delete a subscription
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};
