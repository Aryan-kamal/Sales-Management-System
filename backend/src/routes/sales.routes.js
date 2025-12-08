import express from 'express';
import { getSalesController, getFilterOptionsController } from '../controllers/sales.controller.js';

const router = express.Router();

// GET /api/sales - Get filtered, sorted, paginated sales data
router.get('/', getSalesController);

// GET /api/sales/filter-options - Get available filter options
router.get('/filter-options', getFilterOptionsController);

export default router;

