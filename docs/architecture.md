# Architecture Documentation

## Overview

The Retail Sales Management System is a full-stack application with a clear separation between frontend and backend. The system processes sales data in-memory (no database) and provides a RESTful API for the React frontend.

## Backend Architecture

### Layers

The backend follows a layered architecture pattern:

1. **Routes Layer** (`src/routes/sales.routes.js`)
   - Defines API endpoints
   - Maps HTTP methods to controller functions
   - Handles route mounting

2. **Controllers Layer** (`src/controllers/sales.controller.js`)
   - Parses HTTP request parameters
   - Validates input
   - Calls service functions
   - Formats and returns HTTP responses
   - Handles errors

3. **Services Layer** (`src/services/sales.service.js`)
   - Contains business logic
   - Implements search, filtering, sorting, and pagination
   - Loads and manages data in memory
   - Provides reusable, composable functions

4. **Utils Layer** (`src/utils/convertCsvToJson.js`)
   - Utility functions for data conversion
   - CSV parsing and JSON generation

5. **Data Layer** (`src/data/`)
   - Stores CSV source file
   - Contains generated JSON file for fast access

### Data Flow (Backend)

1. HTTP request arrives at route
2. Route forwards to controller
3. Controller parses query parameters
4. Controller calls service function with parameters
5. Service loads data (if not already loaded)
6. Service applies search → filters → sorting → pagination
7. Service returns processed data
8. Controller formats response
9. Response sent to client

### Module Responsibilities

- **sales.routes.js**: Route definitions and endpoint mounting
- **sales.controller.js**: Request/response handling, parameter parsing
- **sales.service.js**: Core business logic, data processing
- **convertCsvToJson.js**: CSV to JSON conversion utility
- **index.js**: Express app setup, middleware configuration, server startup

## Frontend Architecture

### Structure

The frontend uses React with functional components and hooks:

1. **Pages/Routes** (`src/routes/Home.jsx`)
   - Main application page
   - Manages global state (search, filters, sort, pagination)
   - Coordinates component interactions
   - Handles API calls

2. **Components** (`src/components/`)
   - **SearchBar.jsx**: Search input with icon
   - **FiltersPanel.jsx**: Multi-select and range filter controls
   - **SortDropdown.jsx**: Sorting selection dropdown
   - **TransactionsTable.jsx**: Data table with loading and empty states
   - **PaginationControls.jsx**: Page navigation controls

3. **Services** (`src/services/api.js`)
   - Axios-based API client
   - Functions for fetching sales data and filter options
   - Query parameter construction

4. **Styles** (`src/styles/index.css`)
   - Tailwind CSS imports
   - Global styles

### State Management

State is managed in the `Home` component using React hooks:

- `useState` for local state (search, filters, sort, page, data, loading, error)
- `useEffect` for side effects (loading data, resetting page on filter changes)
- `useCallback` for memoized functions (data loading)

### Data Flow (Frontend)

1. User interacts with UI (search, filter, sort, pagination)
2. Component updates local state
3. `useEffect` detects state change
4. API service function called with current parameters
5. Axios sends HTTP request to backend
6. Backend processes and returns data
7. Component updates state with response
8. UI re-renders with new data

## Data Flow (End-to-End)

```
User Action
    ↓
Frontend Component (State Update)
    ↓
API Service (Axios)
    ↓
HTTP Request (GET /api/sales?params)
    ↓
Backend Route
    ↓
Backend Controller (Parse Params)
    ↓
Backend Service (Process Data)
    ├─ Load Data (JSON)
    ├─ Apply Search
    ├─ Apply Filters
    ├─ Apply Sorting
    └─ Apply Pagination
    ↓
Backend Controller (Format Response)
    ↓
HTTP Response (JSON)
    ↓
Frontend API Service
    ↓
Frontend Component (Update State)
    ↓
UI Re-render
```

## Folder Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── sales.controller.js
│   │   ├── services/
│   │   │   └── sales.service.js
│   │   ├── routes/
│   │   │   └── sales.routes.js
│   │   ├── utils/
│   │   │   └── convertCsvToJson.js
│   │   ├── data/
│   │   │   ├── truestate_assignment_dataset.csv
│   │   │   └── sales.json (generated)
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FiltersPanel.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── TransactionsTable.jsx
│   │   │   └── PaginationControls.jsx
│   │   ├── routes/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
└── README.md
```

## Key Design Decisions

1. **No Database**: Data is loaded from JSON into memory for simplicity and performance. Suitable for read-heavy workloads with static or infrequently updated data.

2. **In-Memory Processing**: All filtering, sorting, and pagination happens in memory, providing fast response times for the dataset size.

3. **Composable Service Functions**: Each processing step (search, filter, sort, paginate) is a separate function, making the code maintainable and testable.

4. **State Management in Component**: Using React hooks for state management keeps the architecture simple without requiring external state management libraries.

5. **RESTful API**: Standard REST endpoints with query parameters for filtering, making the API predictable and easy to use.

6. **Separation of Concerns**: Clear boundaries between routes, controllers, and services ensure maintainability and testability.

## Edge Case Handling

- **No Results**: Empty array returned, frontend displays "No results found"
- **Invalid Filters**: Backend validates and ignores invalid values
- **Missing Fields**: Null/undefined values handled gracefully with fallbacks
- **Large Datasets**: CSV conversion processes in chunks to handle large files
- **Concurrent Requests**: Data loaded once and cached in memory

