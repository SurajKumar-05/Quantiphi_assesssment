// Currency Engine Service
// Handles currency conversion and exchange rates relative to USD base rate.

export const SUPPORTED_CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 1.087 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 1.266 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 0.012 }
};

const RATES_RELATIVE_TO_USD = {
  USD: 1.0,      // Base
  EUR: 1.087,    // 1 EUR = 1.087 USD
  GBP: 1.266,    // 1 GBP = 1.266 USD
  INR: 0.012     // 1 INR = 0.012 USD (1 USD = ~83.33 INR)
};

/**
 * Converts an amount from one currency to another target currency.
 * @param {number} amount - Numerical cost amount
 * @param {string} fromCurrency - Original currency code ("USD", "EUR", "GBP", "INR")
 * @param {string} toCurrency - Target display currency code ("USD", "EUR", "GBP", "INR")
 * @returns {number} Converted numerical amount rounded to 2 decimal places
 */
export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  const num = Number(amount) || 0;
  const from = (fromCurrency || 'USD').toUpperCase();
  const to = (toCurrency || 'USD').toUpperCase();

  if (from === to) return num;

  const rateFrom = RATES_RELATIVE_TO_USD[from] || 1.0;
  const rateTo = RATES_RELATIVE_TO_USD[to] || 1.0;

  // Convert source currency to USD base first, then USD to target currency
  const amountInUSD = num * rateFrom;
  const converted = amountInUSD / rateTo;

  return Math.round(converted * 100) / 100;
};

/**
 * Returns symbol for currency code
 * @param {string} code 
 * @returns {string} Symbol ($ / € / £ / ₹)
 */
export const getCurrencySymbol = (code = 'USD') => {
  const c = SUPPORTED_CURRENCIES[code?.toUpperCase()];
  return c ? c.symbol : '$';
};
