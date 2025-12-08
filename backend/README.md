# Backend - Sales Management System

Backend API server for the Retail Sales Management System built with Node.js and Express.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Running the Backend

1. **Convert CSV to JSON** (first time only, or when dataset changes):
   ```bash
   npm run convert-csv
   ```
   
   This script reads the CSV file from `src/data/truestate_assignment_dataset.csv` and converts it to `src/data/sales.json` for faster in-memory access.

2. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001` (or the port specified in the `PORT` environment variable).

## API Endpoints

### GET /api/sales

Retrieve filtered, sorted, and paginated sales data.

**Query Parameters:**
- `search` (string): Search term for Customer Name or Phone Number
- `region` (string[]): Customer Region filter (can be repeated for multiple values)
- `gender` (string[]): Gender filter (can be repeated for multiple values)
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `category` (string[]): Product Category filter (can be repeated for multiple values)
- `tags` (string[]): Tags filter (can be repeated for multiple values)
- `paymentMethod` (string[]): Payment Method filter (can be repeated for multiple values)
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)
- `sortBy` (string): Sort field - `date`, `quantity`, or `customerName`
- `sortOrder` (string): Sort order - `asc` or `desc` (default: `desc` for date, `asc` for others)
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10)

**Response:**
```json
{
  "items": [...],
  "page": 1,
  "pageSize": 10,
  "totalItems": 100,
  "totalPages": 10
}
```

### GET /api/sales/filter-options

Get available filter options (unique values for regions, genders, categories, tags, payment methods).

**Response:**
```json
{
  "regions": [...],
  "genders": [...],
  "categories": [...],
  "tags": [...],
  "paymentMethods": [...]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Data Loading

The backend loads sales data from `src/data/sales.json` into memory on first access. The data is cached for subsequent requests, providing fast response times. The CSV to JSON conversion script handles large files efficiently by processing data in chunks.

## Architecture

- **Routes**: `src/routes/sales.routes.js` - Define API endpoints
- **Controllers**: `src/controllers/sales.controller.js` - Handle HTTP requests and responses
- **Services**: `src/services/sales.service.js` - Business logic for filtering, sorting, pagination
- **Utils**: `src/utils/convertCsvToJson.js` - CSV to JSON conversion utility
- **Data**: `src/data/` - Contains CSV source and generated JSON file

