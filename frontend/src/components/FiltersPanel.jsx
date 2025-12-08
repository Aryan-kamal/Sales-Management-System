import { useState, useEffect } from 'react';
import { fetchFilterOptions } from '../services/api';

function FiltersPanel({ filters, onFilterChange, filterOptions }) {
  const [localFilters, setLocalFilters] = useState({
    region: filters.region || [],
    gender: filters.gender || [],
    ageMin: filters.ageMin || '',
    ageMax: filters.ageMax || '',
    category: filters.category || [],
    tags: filters.tags || [],
    paymentMethod: filters.paymentMethod || [],
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
  });

  useEffect(() => {
    setLocalFilters({
      region: filters.region || [],
      gender: filters.gender || [],
      ageMin: filters.ageMin || '',
      ageMax: filters.ageMax || '',
      category: filters.category || [],
      tags: filters.tags || [],
      paymentMethod: filters.paymentMethod || [],
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || '',
    });
  }, [filters]);

  const handleMultiSelectChange = (field, value) => {
    const current = localFilters[field] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    const newFilters = { ...localFilters, [field]: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRangeChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      region: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      category: [],
      tags: [],
      paymentMethod: [],
      dateFrom: '',
      dateTo: '',
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = () => {
    return (
      localFilters.region.length > 0 ||
      localFilters.gender.length > 0 ||
      localFilters.ageMin !== '' ||
      localFilters.ageMax !== '' ||
      localFilters.category.length > 0 ||
      localFilters.tags.length > 0 ||
      localFilters.paymentMethod.length > 0 ||
      localFilters.dateFrom !== '' ||
      localFilters.dateTo !== ''
    );
  };

  if (!filterOptions) {
    return <div className="p-4">Loading filter options...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Customer Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Region
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
          {filterOptions.regions?.map((region) => (
            <label key={region} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.region.includes(region)}
                onChange={() => handleMultiSelectChange('region', region)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <div className="space-y-2">
          {filterOptions.genders?.map((gender) => (
            <label key={gender} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.gender.includes(gender)}
                onChange={() => handleMultiSelectChange('gender', gender)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.ageMin}
            onChange={(e) => handleRangeChange('ageMin', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.ageMax}
            onChange={(e) => handleRangeChange('ageMax', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Product Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Category
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
          {filterOptions.categories?.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.category.includes(category)}
                onChange={() => handleMultiSelectChange('category', category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
          {filterOptions.tags?.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.tags.includes(tag)}
                onChange={() => handleMultiSelectChange('tags', tag)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="space-y-2">
          {filterOptions.paymentMethods?.map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.paymentMethod.includes(method)}
                onChange={() => handleMultiSelectChange('paymentMethod', method)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="space-y-2">
          <input
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => handleDateChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => handleDateChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default FiltersPanel;

