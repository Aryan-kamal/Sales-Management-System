import {useState, useEffect, useCallback} from "react";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";
import TransactionsTable from "../components/TransactionsTable";
import PaginationControls from "../components/PaginationControls";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import {fetchSales, fetchFilterOptions} from "../services/api";

function Home() {
	const initialFilters = {
		region: [],
		gender: [],
		ageMin: "",
		ageMax: "",
		category: [],
		tags: [],
		paymentMethod: [],
		dateFrom: "",
		dateTo: "",
	};

	// State management
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState(initialFilters);
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState("desc");
	const [page, setPage] = useState(1);

	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [filterOptions, setFilterOptions] = useState(null);
	const [summary, setSummary] = useState({
		totalUnitsSold: 0,
		totalAmount: 0,
		totalDiscount: 0,
	});

	// Load filter options on mount
	useEffect(() => {
		const loadFilterOptions = async () => {
			try {
				const options = await fetchFilterOptions();
				setFilterOptions(options);
			} catch (err) {
				setError(err.message || "Failed to load filter options");
			}
		};
		loadFilterOptions();
	}, []);

	// Fetch sales data
	const loadSalesData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const params = {
				search: search || undefined,
				...filters,
				sortBy,
				sortOrder,
				page,
				pageSize: 10,
			};

			const result = await fetchSales(params);

			setData(result.items || []);
			setTotalPages(result.totalPages || 0);
			setTotalItems(result.totalItems || 0);
			setSummary(
				result.summary || {
					totalUnitsSold: 0,
					totalAmount: 0,
					totalDiscount: 0,
				}
			);
		} catch (err) {
			console.error("Error loading sales data:", err);
			const errorMessage = err.message || "Failed to load sales data";
			setError(errorMessage);
			setData([]);
			setTotalPages(0);
			setTotalItems(0);
			setSummary({
				totalUnitsSold: 0,
				totalAmount: 0,
				totalDiscount: 0,
			});
		} finally {
			setLoading(false);
		}
	}, [search, filters, sortBy, sortOrder, page]);

	// Load data when dependencies change
	useEffect(() => {
		loadSalesData();
	}, [loadSalesData]);

	// Reset to page 1 when search, filters, or sort changes
	useEffect(() => {
		setPage(1);
	}, [search, filters, sortBy, sortOrder]);

	const handleSearchChange = (value) => {
		setSearch(value);
	};

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	const handleClearFilters = () => {
		setFilters(initialFilters);
		setPage(1);
	};

	const handleSortChange = (newSortBy, newSortOrder) => {
		setSortBy(newSortBy);
		setSortOrder(newSortOrder);
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
		window.scrollTo({top: 0, behavior: "smooth"});
	};

	return (
		<div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
			<Sidebar />
			<div className="flex-1 min-w-0 flex flex-col">
				{/* Header */}
				<div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between gap-3 mb-4">
						<h1 className="text-2xl font-bold text-gray-800">
							Sales Management System
						</h1>
						<div className="w-64 max-w-full">
							<SearchBar value={search} onChange={handleSearchChange} />
						</div>
					</div>

					{/* Filters on top */}
					<div className="mt-3">
						<FilterBar
							filters={filters}
							onFilterChange={handleFilterChange}
							filterOptions={filterOptions}
							onClear={handleClearFilters}
						/>
					</div>
				</div>

				<div className="px-4 sm:px-6 lg:px-8 py-6 space-y-4">
					{/* Sort and Summary */}
					<div className="flex flex-wrap items-center justify-between gap-3">
						<SortDropdown
							sortBy={sortBy}
							sortOrder={sortOrder}
							onChange={handleSortChange}
						/>
					</div>

					{/* Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<div className="text-sm text-gray-600 mb-1">Total units sold</div>
							<div className="text-2xl font-bold text-gray-800">
								{summary.totalUnitsSold}
							</div>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<div className="text-sm text-gray-600 mb-1">Total Amount</div>
							<div className="text-2xl font-bold text-gray-800">
								₹{summary.totalAmount.toLocaleString("en-IN")}
							</div>
						</div>
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<div className="text-sm text-gray-600 mb-1">Total Discount</div>
							<div className="text-2xl font-bold text-gray-800">
								₹{summary.totalDiscount.toLocaleString("en-IN")}
							</div>
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
							{error}
						</div>
					)}

					{/* Transactions Table */}
					<div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
						<TransactionsTable data={data} loading={loading} />
					</div>

					{/* Pagination */}
					{!loading && totalPages > 0 && (
						<PaginationControls
							page={page}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Home;
