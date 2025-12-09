function TransactionsTable({data, loading}) {
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
			<table className="min-w-full table-fixed divide-y divide-gray-200 border border-gray-200 text-xs">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Transaction ID
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Date
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Customer ID
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Customer Name
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Phone Number
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Gender
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Age
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Customer Region
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Product Category
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Quantity
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Price per Unit
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Total Amount
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Final Amount
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide border-r border-gray-200 break-words">
							Payment Method
						</th>
						<th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wide break-words">
							Order Status
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{data.map((item, index) => (
						<tr key={index} className="hover:bg-gray-50">
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Transaction ID"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Date"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Customer ID"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Customer Name"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Phone Number"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Gender"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Age"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Customer Region"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Product Category"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Quantity"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Price per Unit"] ? `₹${item["Price per Unit"]}` : "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Total Amount"] ? `₹${item["Total Amount"]}` : "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Final Amount"] ? `₹${item["Final Amount"]}` : "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 border-r border-gray-200 align-top break-words">
								{item["Payment Method"] || "-"}
							</td>
							<td className="px-3 py-2 text-gray-900 align-top break-words">
								{item["Order Status"] || "-"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default TransactionsTable;
