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
  // Fetch all subscriptions with optional search/filters and target displayCurrency
  getAll: async (filters = {}, displayCurrency = 'USD') => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (displayCurrency) queryParams.append('displayCurrency', displayCurrency);

    const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL;
    const res = await fetch(url);
    return handleResponse(res);
  },

  // Fetch aggregated dashboard metrics converted to displayCurrency
  getMetrics: async (displayCurrency = 'USD') => {
    const res = await fetch(`${BASE_URL}/metrics?displayCurrency=${displayCurrency}`);
    return handleResponse(res);
  },

  // Create a new subscription
  create: async (subscriptionData, displayCurrency = 'USD') => {
    const res = await fetch(`${BASE_URL}?displayCurrency=${displayCurrency}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData)
    });
    return handleResponse(res);
  },

  // Update existing subscription
  update: async (id, subscriptionData, displayCurrency = 'USD') => {
    const res = await fetch(`${BASE_URL}/${id}?displayCurrency=${displayCurrency}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData)
    });
    return handleResponse(res);
  },

  // Toggle active / paused status instantly
  toggleStatus: async (id, displayCurrency = 'USD') => {
    const res = await fetch(`${BASE_URL}/${id}/toggle?displayCurrency=${displayCurrency}`, {
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
