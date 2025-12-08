function SortDropdown({ sortBy, sortOrder, onChange }) {
  const handleSortChange = (e) => {
    const value = e.target.value;
    let newSortBy, newSortOrder;
    
    switch (value) {
      case 'date-desc':
        newSortBy = 'date';
        newSortOrder = 'desc';
        break;
      case 'date-asc':
        newSortBy = 'date';
        newSortOrder = 'asc';
        break;
      case 'quantity-desc':
        newSortBy = 'quantity';
        newSortOrder = 'desc';
        break;
      case 'quantity-asc':
        newSortBy = 'quantity';
        newSortOrder = 'asc';
        break;
      case 'customerName-asc':
        newSortBy = 'customerName';
        newSortOrder = 'asc';
        break;
      case 'customerName-desc':
        newSortBy = 'customerName';
        newSortOrder = 'desc';
        break;
      default:
        newSortBy = 'date';
        newSortOrder = 'desc';
    }
    
    onChange(newSortBy, newSortOrder);
  };

  const getCurrentValue = () => {
    return `${sortBy}-${sortOrder}`;
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        value={getCurrentValue()}
        onChange={handleSortChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="quantity-desc">Quantity (High to Low)</option>
        <option value="quantity-asc">Quantity (Low to High)</option>
        <option value="customerName-asc">Customer Name (A-Z)</option>
        <option value="customerName-desc">Customer Name (Z-A)</option>
      </select>
    </div>
  );
}

export default SortDropdown;

