function TransactionsTable({ data, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">No results found</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Transaction ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Customer ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Customer Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Phone Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Age
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Customer Region
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Product Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Price per Unit
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Total Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Final Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
              Payment Method
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Order Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Transaction ID'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Date'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Customer ID'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Customer Name'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Phone Number'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Gender'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Age'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Customer Region'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Product Category'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Quantity'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Price per Unit'] ? `₹${item['Price per Unit']}` : '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Total Amount'] ? `₹${item['Total Amount']}` : '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Final Amount'] ? `₹${item['Final Amount']}` : '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                {item['Payment Method'] || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {item['Order Status'] || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;

