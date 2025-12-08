# Retail Sales Management System

A full-stack application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities. The system provides a clean, intuitive interface for exploring sales transactions across multiple dimensions including customer demographics, product categories, payment methods, and date ranges.

## Tech Stack

- **Backend**: Node.js + Express (no database, in-memory JSON data)
- **Frontend**: React (Vite) + React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Search Implementation Summary

Full-text search is implemented case-insensitively across Customer Name and Phone Number fields. The search query is processed on the backend by filtering records where either field contains the search term as a substring. Search works seamlessly in combination with filters, sorting, and pagination, maintaining state across all operations.

## Filter Implementation Summary

Multi-select and range-based filters are implemented for Customer Region, Gender, Product Category, Tags, and Payment Method (multi-select), along with Age Range and Date Range (range-based). Filters operate independently and can be combined, with all filter states preserved when search, sort, or pagination changes. The backend processes filters sequentially, applying each filter type to progressively narrow the dataset.

## Sorting Implementation Summary

Sorting supports three options: Date (newest first by default), Quantity, and Customer Name (A-Z). The sorting logic handles both ascending and descending orders, with proper handling of missing or invalid values. Sorting is applied after search and filtering but before pagination, ensuring consistent results across page navigation.

## Pagination Implementation Summary

Pagination is implemented with a fixed page size of 10 items per page. The backend calculates total pages based on filtered results, and the frontend provides Previous/Next navigation along with direct page number selection. Pagination state is maintained independently, allowing users to navigate pages while preserving active search, filter, and sort configurations.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Convert CSV to JSON (first time only):
   ```bash
   npm run convert-csv
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### Running the Application

1. Ensure the backend is running on port 3001
2. Start the frontend on port 3000
3. Open `http://localhost:3000` in your browser

The frontend is configured to proxy API requests to the backend automatically.

