import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/sales.routes.js';
import { preloadSalesData } from './services/sales.service.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/sales', salesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Pre-load data on startup, then start server
preloadSalesData()
  .then((data) => {
    if (!data.length) {
      console.error('Data pre-load finished but no records were loaded.');
    }
  })
  .catch((error) => {
    console.error('Error pre-loading data:', error);
  })
  .finally(() => {
    app.listen(PORT, () => {
      // Server ready
    });
  });

