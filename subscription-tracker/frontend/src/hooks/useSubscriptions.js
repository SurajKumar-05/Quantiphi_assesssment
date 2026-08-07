import { useState, useEffect, useCallback } from 'react';
import { subscriptionApi } from '../api/subscriptionApi';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);

  // Global display currency state
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load subscriptions & metrics from backend using target displayCurrency
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [subsData, metricsData] = await Promise.all([
        subscriptionApi.getAll({ search: searchQuery, category: selectedCategory, status: statusFilter }, displayCurrency),
        subscriptionApi.getMetrics(displayCurrency)
      ]);
      setSubscriptions(subsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load subscription tracker data:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, [displayCurrency, searchQuery, selectedCategory, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle active/paused status
  const toggleStatus = async (id) => {
    if (togglingIds.includes(id)) return;

    setTogglingIds((prev) => [...prev, id]);

    // Optimistically update local status
    setSubscriptions((prevSubs) =>
      prevSubs.map((sub) => {
        if (sub.id === id) {
          const newStatus = sub.status === 'active' ? 'paused' : 'active';
          return { ...sub, status: newStatus };
        }
        return sub;
      })
    );

    try {
      await subscriptionApi.toggleStatus(id, displayCurrency);
      const [updatedSubs, updatedMetrics] = await Promise.all([
        subscriptionApi.getAll({}, displayCurrency),
        subscriptionApi.getMetrics(displayCurrency)
      ]);
      setSubscriptions(updatedSubs);
      setMetrics(updatedMetrics);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setError('Failed to update subscription status. Reverting change.');
      fetchData();
    } finally {
      setTogglingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Create subscription
  const addSubscription = async (formData) => {
    const created = await subscriptionApi.create(formData, displayCurrency);
    await fetchData();
    return created;
  };

  // Update subscription
  const updateSubscription = async (id, formData) => {
    const updated = await subscriptionApi.update(id, formData, displayCurrency);
    await fetchData();
    return updated;
  };

  // Delete subscription
  const deleteSubscription = async (id) => {
    await subscriptionApi.delete(id);
    await fetchData();
  };

  return {
    subscriptions,
    metrics,
    loading,
    error,
    togglingIds,
    displayCurrency,
    setDisplayCurrency,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    refreshData: fetchData,
    toggleStatus,
    addSubscription,
    updateSubscription,
    deleteSubscription
  };
};
