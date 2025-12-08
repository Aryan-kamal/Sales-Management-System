import { useMemo } from 'react';

function Section({ label, children }) {
  return (
    <div className="relative">
      <details className="group">
        <summary className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-md bg-white text-sm text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none">
          <span>{label}</span>
          <svg className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="absolute z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg max-h-72 overflow-auto p-3 space-y-2">
          {children}
        </div>
      </details>
    </div>
  );
}

function CheckboxList({ options, selected, onToggle }) {
  return options.map((opt) => (
    <label key={opt} className="flex items-center text-sm text-gray-700">
      <input
        type="checkbox"
        checked={selected.includes(opt)}
        onChange={() => onToggle(opt)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="ml-2">{opt}</span>
    </label>
  ));
}

function FilterBar({ filters, onFilterChange, filterOptions, onClear }) {
  const safeOptions = useMemo(() => filterOptions || { regions: [], genders: [], categories: [], tags: [], paymentMethods: [] }, [filterOptions]);

  const toggleValue = (field, value) => {
    const current = filters[field] || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [field]: next });
  };

  const handleRange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = () => {
    return (
      (filters.region && filters.region.length) ||
      (filters.gender && filters.gender.length) ||
      (filters.category && filters.category.length) ||
      (filters.tags && filters.tags.length) ||
      (filters.paymentMethod && filters.paymentMethod.length) ||
      filters.ageMin ||
      filters.ageMax ||
      filters.dateFrom ||
      filters.dateTo
    );
  };

  return (
    <div className="flex flex-wrap gap-3 bg-white border border-gray-200 rounded-lg p-3 items-center">
      <Section label="Customer Region">
        <CheckboxList options={safeOptions.regions} selected={filters.region || []} onToggle={(v) => toggleValue('region', v)} />
      </Section>

      <Section label="Gender">
        <CheckboxList options={safeOptions.genders} selected={filters.gender || []} onToggle={(v) => toggleValue('gender', v)} />
      </Section>

      <Section label="Age Range">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.ageMin || ''}
            onChange={(e) => handleRange('ageMin', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.ageMax || ''}
            onChange={(e) => handleRange('ageMax', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </Section>

      <Section label="Product Category">
        <CheckboxList options={safeOptions.categories} selected={filters.category || []} onToggle={(v) => toggleValue('category', v)} />
      </Section>

      <Section label="Tags">
        <CheckboxList options={safeOptions.tags} selected={filters.tags || []} onToggle={(v) => toggleValue('tags', v)} />
      </Section>

      <Section label="Payment Method">
        <CheckboxList options={safeOptions.paymentMethods} selected={filters.paymentMethod || []} onToggle={(v) => toggleValue('paymentMethod', v)} />
      </Section>

      <Section label="Date Range">
        <div className="space-y-2">
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleRange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleRange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </Section>

      {onClear && (
        <button
          onClick={onClear}
          disabled={!hasActiveFilters()}
          className={`ml-auto px-3 py-2 text-sm font-medium rounded-md border ${
            hasActiveFilters()
              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
          }`}
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;

