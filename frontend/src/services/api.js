import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch sales data with filters, search, sort, and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} Response data
 */
export async function fetchSales(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add search
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    // Add filters (multi-select as arrays)
    if (params.region && params.region.length > 0) {
      params.region.forEach(r => queryParams.append('region', r));
    }
    if (params.gender && params.gender.length > 0) {
      params.gender.forEach(g => queryParams.append('gender', g));
    }
    if (params.ageMin) {
      queryParams.append('ageMin', params.ageMin);
    }
    if (params.ageMax) {
      queryParams.append('ageMax', params.ageMax);
    }
    if (params.category && params.category.length > 0) {
      params.category.forEach(c => queryParams.append('category', c));
    }
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(t => queryParams.append('tags', t));
    }
    if (params.paymentMethod && params.paymentMethod.length > 0) {
      params.paymentMethod.forEach(p => queryParams.append('paymentMethod', p));
    }
    if (params.dateFrom) {
      queryParams.append('dateFrom', params.dateFrom);
    }
    if (params.dateTo) {
      queryParams.append('dateTo', params.dateTo);
    }
    
    // Add sorting
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    
    // Add pagination
    if (params.page) {
      queryParams.append('page', params.page);
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize);
    }
    
    const response = await api.get(`/api/sales?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3001');
    } else {
      throw error;
    }
  }
}

/**
 * Fetch filter options
 * @returns {Promise} Filter options
 */
export async function fetchFilterOptions() {
  try {
    const response = await api.get('/api/sales/filter-options');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3001');
    } else {
      throw error;
    }
  }
}

