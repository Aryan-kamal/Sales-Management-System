import { getSales, getFilterOptions } from '../services/sales.service.js';

/**
 * Controller to handle GET /api/sales requests
 * Parses query parameters and returns filtered, sorted, paginated sales data
 */
export async function getSalesController(req, res) {
  try {
    const {
      search,
      region,
      gender,
      ageMin,
      ageMax,
      category,
      tags,
      paymentMethod,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page,
      pageSize
    } = req.query;
    
    const toArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return String(val).split(',').map((v) => v.trim()).filter(Boolean);
    };

    const params = {
      search: search || undefined,
      region: toArray(region),
      gender: toArray(gender),
      ageMin: ageMin || undefined,
      ageMax: ageMax || undefined,
      category: toArray(category),
      tags: toArray(tags),
      paymentMethod: toArray(paymentMethod),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy: sortBy || 'date',
      sortOrder: sortOrder || (sortBy === 'date' ? 'desc' : 'asc'),
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 10
    };

    const result = await getSales(params);
    res.json(result);
  } catch (error) {
    console.error('Error in getSalesController:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Controller to get filter options
 */
export async function getFilterOptionsController(req, res) {
  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error in getFilterOptionsController:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

