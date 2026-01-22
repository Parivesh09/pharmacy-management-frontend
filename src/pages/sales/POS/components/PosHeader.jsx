
import React from "react";
import { Search } from "lucide-react";

const PosHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-white flex gap-4 items-center">
      {/* Store Selector - Placeholder for now */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Store:</label>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500">
          <option>Main Store</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PosHeader;
