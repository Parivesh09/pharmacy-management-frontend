
import React from "react";
import { Search } from "lucide-react";

const PosHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-(--card-bg) flex gap-4 items-center">
      {/* Store Selector - Placeholder for now */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-(--text-main) opacity-80">Store:</label>
        <select className="bg-transparent border border-gray-300 dark:border-gray-600 text-(--text-main) rounded px-2 py-1 text-sm focus:outline-none focus:border-(--primary-color)">
          <option className="bg-(--card-bg)">Main Store</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 text-(--text-main) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:border-transparent transition-all placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PosHeader;
