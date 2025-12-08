# Frontend - Sales Management System

Frontend application for the Retail Sales Management System built with React, Vite, and Tailwind CSS.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Running the Frontend

1. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

2. Build for production:
   ```bash
   npm run build
   ```

3. Preview production build:
   ```bash
   npm run preview
   ```

## API Configuration

The frontend is configured to communicate with the backend API. By default, it connects to `http://localhost:3001`.

### Environment Variables

You can configure the API base URL using environment variables:

1. Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   ```

2. Or modify the default in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
   ```

## Project Structure

- **Components**: `src/components/` - Reusable UI components
  - `SearchBar.jsx` - Search input component
  - `FiltersPanel.jsx` - Filter controls panel
  - `SortDropdown.jsx` - Sorting dropdown
  - `TransactionsTable.jsx` - Data table display
  - `PaginationControls.jsx` - Pagination navigation

- **Routes**: `src/routes/` - Page components
  - `Home.jsx` - Main sales management page

- **Services**: `src/services/` - API client
  - `api.js` - Axios-based API service

- **Styles**: `src/styles/` - Global styles
  - `index.css` - Tailwind CSS imports and custom styles

- **Hooks**: `src/hooks/` - Custom React hooks (for future use)

- **Utils**: `src/utils/` - Utility functions (for future use)

## Features

- **Search**: Real-time search across Customer Name and Phone Number
- **Filters**: Multi-select and range filters for various dimensions
- **Sorting**: Sort by Date, Quantity, or Customer Name
- **Pagination**: Navigate through paginated results
- **Responsive**: Clean, minimal UI built with Tailwind CSS

