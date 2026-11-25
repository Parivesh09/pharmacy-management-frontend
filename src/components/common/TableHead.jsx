export default function TableHead() {
  return (
    <thead className="bg-teal-600 sticky top-0">
      <tr>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[450px]">
          Product
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[120px]">
          Packing
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[100px]">
          Batch
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[130px]">
          Exp. Date
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[80px]">
          Qty
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[80px]">
          Free
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[100px]">
          Rate
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 border-r border-teal-200 min-w-[90px]">
          Disc %
        </th>
        <th className="px-1 py-1 text-left text-sm font-medium text-gray-800 min-w-[120px]">
          Amount
        </th>
      </tr>
    </thead>
  );
}
