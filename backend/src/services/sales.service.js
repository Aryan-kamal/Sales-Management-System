import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import StreamArray from 'stream-json/streamers/StreamArray.js';
import streamChain from 'stream-chain';

const { chain } = streamChain;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load sales data from JSON file
let salesData = null;
let isLoading = false;
let loadPromise = null;

function loadSalesData() {
  // Return cached data if already loaded
  if (salesData !== null) {
    return salesData;
  }
  
  // If currently loading, return empty array (will be populated later)
  if (isLoading) {
    return [];
  }
  
  const jsonPath = path.join(__dirname, '../data/sales.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('Sales data file not found. Please run: npm run convert-csv');
    salesData = [];
    return salesData;
  }
  
  // File is too large for standard readFileSync, use streaming
  isLoading = true;
  loadPromise = loadSalesDataStreaming(jsonPath);
  
  // For now, return empty array. Data will be loaded asynchronously
  // In production, you'd want to wait for this, but for now we'll let it load in background
  return [];
}

function loadSalesDataStreaming(jsonPath) {
  return new Promise((resolve, reject) => {
    const records = [];
    let recordCount = 0;
    const startTime = Date.now();
    
    const pipeline = chain([
      fs.createReadStream(jsonPath, { highWaterMark: 1024 * 1024 }), // 1MB chunks
      StreamArray.withParser()
    ]);
    
    pipeline.on('data', ({ value }) => {
      if (value && typeof value === 'object') {
        records.push(value);
        recordCount++;
      }
    });
    
    pipeline.on('end', () => {
      salesData = records;
      isLoading = false;
      resolve(records);
    });
    
    pipeline.on('error', (error) => {
      console.error('Streaming parser error:', error);
      salesData = [];
      isLoading = false;
      reject(error);
    });
  }).catch((error) => {
    console.error('Failed to load data:', error);
    salesData = [];
    isLoading = false;
    return [];
  });
}

// Export function to pre-load data
export function preloadSalesData() {
  if (salesData !== null) {
    return Promise.resolve(salesData);
  }
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = loadSalesDataStreaming(path.join(__dirname, '../data/sales.json'));
  return loadPromise;
}

function emptyResult(params) {
  return {
    items: [],
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    totalItems: 0,
    totalPages: 0,
    summary: {
      totalUnitsSold: 0,
      totalAmount: 0,
      totalDiscount: 0
    }
  };
}

/**
 * Apply search filter to sales data
 * Searches in Customer Name and Phone Number (case-insensitive)
 */
function applySearch(data, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return data;
  }
  
  const search = searchTerm.toLowerCase().trim();
  
  return data.filter(item => {
    const customerName = (item['Customer Name'] || '').toLowerCase();
    const phoneNumber = (item['Phone Number'] || '').toLowerCase();
    
    return customerName.includes(search) || phoneNumber.includes(search);
  });
}

/**
 * Apply multi-select filter
 */
function applyMultiSelectFilter(data, fieldName, selectedValues) {
  if (!selectedValues || selectedValues.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    const value = item[fieldName];
    return selectedValues.includes(value);
  });
}

/**
 * Apply age range filter
 */
function applyAgeRangeFilter(data, ageMin, ageMax) {
  let filtered = data;
  
  if (ageMin !== undefined && ageMin !== null && ageMin !== '') {
    const min = parseFloat(ageMin);
    if (!isNaN(min)) {
      filtered = filtered.filter(item => {
        const age = parseFloat(item['Age']);
        return !isNaN(age) && age >= min;
      });
    }
  }
  
  if (ageMax !== undefined && ageMax !== null && ageMax !== '') {
    const max = parseFloat(ageMax);
    if (!isNaN(max)) {
      filtered = filtered.filter(item => {
        const age = parseFloat(item['Age']);
        return !isNaN(age) && age <= max;
      });
    }
  }
  
  return filtered;
}

/**
 * Apply date range filter
 */
function applyDateRangeFilter(data, dateFrom, dateTo) {
  let filtered = data;
  
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    if (!isNaN(fromDate.getTime())) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item['Date']);
        return !isNaN(itemDate.getTime()) && itemDate >= fromDate;
      });
    }
  }
  
  if (dateTo) {
    const toDate = new Date(dateTo);
    if (!isNaN(toDate.getTime())) {
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item['Date']);
        return !isNaN(itemDate.getTime()) && itemDate <= toDate;
      });
    }
  }
  
  return filtered;
}

/**
 * Apply all filters to data
 */
function applyFilters(data, filters) {
  let filtered = data;
  
  // Customer Region (multi-select)
  if (filters.region && Array.isArray(filters.region)) {
    filtered = applyMultiSelectFilter(filtered, 'Customer Region', filters.region);
  }
  
  // Gender (multi-select)
  if (filters.gender && Array.isArray(filters.gender)) {
    filtered = applyMultiSelectFilter(filtered, 'Gender', filters.gender);
  }
  
  // Age Range
  filtered = applyAgeRangeFilter(filtered, filters.ageMin, filters.ageMax);
  
  // Product Category (multi-select)
  if (filters.category && Array.isArray(filters.category)) {
    filtered = applyMultiSelectFilter(filtered, 'Product Category', filters.category);
  }
  
  // Tags (multi-select) - Tags might be comma-separated, so we need special handling
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    filtered = filtered.filter(item => {
      const itemTags = (item['Tags'] || '').split(',').map(t => t.trim());
      return filters.tags.some(tag => itemTags.includes(tag));
    });
  }
  
  // Payment Method (multi-select)
  if (filters.paymentMethod && Array.isArray(filters.paymentMethod)) {
    filtered = applyMultiSelectFilter(filtered, 'Payment Method', filters.paymentMethod);
  }
  
  // Date Range
  filtered = applyDateRangeFilter(filtered, filters.dateFrom, filters.dateTo);
  
  return filtered;
}

/**
 * Apply sorting to data
 */
function applySorting(data, sortBy, sortOrder = 'desc') {
  if (!sortBy) {
    return data;
  }
  
  const sorted = [...data];
  const order = sortOrder === 'asc' ? 1 : -1;
  
  sorted.sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'date':
        aVal = new Date(a['Date']);
        bVal = new Date(b['Date']);
        if (isNaN(aVal.getTime())) return 1;
        if (isNaN(bVal.getTime())) return -1;
        return (aVal - bVal) * order;
        
      case 'quantity':
        aVal = parseFloat(a['Quantity']) || 0;
        bVal = parseFloat(b['Quantity']) || 0;
        return (aVal - bVal) * order;
        
      case 'customerName':
        aVal = (a['Customer Name'] || '').toLowerCase();
        bVal = (b['Customer Name'] || '').toLowerCase();
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
        
      default:
        return 0;
    }
  });
  
  return sorted;
}

/**
 * Apply pagination to data
 */
function applyPagination(data, page = 1, pageSize = 10) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const size = Math.max(1, parseInt(pageSize) || 10);
  
  const startIndex = (pageNum - 1) * size;
  const endIndex = startIndex + size;
  
  return {
    items: data.slice(startIndex, endIndex),
    page: pageNum,
    pageSize: size,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / size)
  };
}

/**
 * Main service function to get filtered, sorted, and paginated sales data
 */
export async function getSales(params = {}) {
  // Ensure data is loaded (wait for streaming load if needed)
  if (salesData === null) {
    if (!loadPromise) {
      loadPromise = preloadSalesData();
    }
    try {
      await loadPromise;
    } catch (err) {
      console.error('Failed to load sales data:', err);
      return emptyResult(params);
    }
  }

  const allData = salesData || [];
  if (!allData.length) {
    return emptyResult(params);
  }
  
  // Apply search
  let filtered = applySearch(allData, params.search);
  
  // Apply filters
  const filters = {
    region: params.region ? (Array.isArray(params.region) ? params.region : [params.region]) : undefined,
    gender: params.gender ? (Array.isArray(params.gender) ? params.gender : [params.gender]) : undefined,
    ageMin: params.ageMin,
    ageMax: params.ageMax,
    category: params.category ? (Array.isArray(params.category) ? params.category : [params.category]) : undefined,
    tags: params.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : undefined,
    paymentMethod: params.paymentMethod ? (Array.isArray(params.paymentMethod) ? params.paymentMethod : [params.paymentMethod]) : undefined,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo
  };
  
  filtered = applyFilters(filtered, filters);
  
  // Apply sorting (default: date newest first)
  const sortBy = params.sortBy || 'date';
  const sortOrder = params.sortOrder || (sortBy === 'date' ? 'desc' : 'asc');
  filtered = applySorting(filtered, sortBy, sortOrder);
  
  // Calculate summary statistics from all filtered data
  const totalUnitsSold = filtered.reduce((sum, item) => sum + (parseFloat(item['Quantity']) || 0), 0);
  const totalAmount = filtered.reduce((sum, item) => sum + (parseFloat(item['Total Amount']) || 0), 0);
  const totalDiscount = filtered.reduce((sum, item) => {
    const total = parseFloat(item['Total Amount']) || 0;
    const final = parseFloat(item['Final Amount']) || 0;
    return sum + (total - final);
  }, 0);
  
  // Apply pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const paginationResult = applyPagination(filtered, page, pageSize);
  
  return {
    ...paginationResult,
    summary: {
      totalUnitsSold,
      totalAmount,
      totalDiscount
    }
  };
}

/**
 * Get unique values for filter options
 */
export async function getFilterOptions() {
  // Ensure data is loaded
  if (salesData === null) {
    if (!loadPromise) {
      loadPromise = preloadSalesData();
    }
    try {
      await loadPromise;
    } catch (err) {
      console.error('Failed to load sales data for filter options:', err);
      return {
        regions: [],
        genders: [],
        categories: [],
        tags: [],
        paymentMethods: []
      };
    }
  }
  const data = salesData || [];
  if (!data.length) {
    return {
      regions: [],
      genders: [],
      categories: [],
      tags: [],
      paymentMethods: []
    };
  }
  
  const regions = [...new Set(data.map(item => item['Customer Region']).filter(Boolean))].sort();
  const genders = [...new Set(data.map(item => item['Gender']).filter(Boolean))].sort();
  const categories = [...new Set(data.map(item => item['Product Category']).filter(Boolean))].sort();
  const tags = [...new Set(data.flatMap(item => (item['Tags'] || '').split(',').map(t => t.trim())).filter(Boolean))].sort();
  const paymentMethods = [...new Set(data.map(item => item['Payment Method']).filter(Boolean))].sort();
  
  return {
    regions,
    genders,
    categories,
    tags,
    paymentMethods
  };
}

