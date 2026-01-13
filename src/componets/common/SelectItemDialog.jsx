import React, { useState, useMemo, useEffect } from "react";
import { Search, X, RefreshCw } from "lucide-react";
import { useGetItemsQuery } from "../../services/itemApi";
import BatchSelectionDialog from "../../pages/purchase/Bill/components/BatchSelectionDialog";

const SelectItemDialog = ({ open, onClose, onSelectItem }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [selectedItemForBatch, setSelectedItemForBatch] = useState(null);
  
  const { data: itemsData, isLoading, refetch } = useGetItemsQuery({ 
    limit: 100,
    _refresh: refreshKey // This will force a refetch when refreshKey changes
  });

  console.log(itemsData);

  // Auto-refresh when dialog opens to get latest stock
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const filteredItems = useMemo(() => {
    if (!itemsData?.data) return [];
    
    let filtered = itemsData.data.filter(item =>
      item.productname?.toLowerCase().includes(search.toLowerCase()) ||
      item.goods?.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => (a.productname || "").localeCompare(b.productname || ""));
    } else if (sortBy === "stock") {
      filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }

    return filtered;
  }, [itemsData, search, sortBy]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const handleItemSelect = (item) => {
    // Always select item directly without opening batch dialog
    onSelectItem({
      id: item.id,
      name: item.productname,
      packing: item.packing,
      mrp: item.price || 0,
      rate: item.salerate || item.price || 0, // Use salerate for calculations
      purchasePrice: item.purchasePrice,
      unit: item.Unit1?.unitName,
      stock: item.stock || 0,
      batchId: null, // No batch selected initially
      batch: "",
      expiryDate: "",
      batchQuantity: 0,
      // Add tax information from TaxCategoryDetail
      taxCategory: item.TaxCategoryDetail,
      igstPercent: parseFloat(item.TaxCategoryDetail?.igstPercentage || 0),
      cgstPercent: parseFloat(item.TaxCategoryDetail?.cgstPercentage || 0),
      sgstPercent: parseFloat(item.TaxCategoryDetail?.sgstPercentage || 0),
      cessPercent: parseFloat(item.TaxCategoryDetail?.cessPercentage || 0),
    });
    onClose();
  };

  const handleBatchSelect = (batch) => {
    if (selectedItemForBatch) {
      onSelectItem({
        id: selectedItemForBatch.id,
        name: selectedItemForBatch.productname,
        packing: selectedItemForBatch.packing,
        mrp: batch.mrp || selectedItemForBatch.price,
        purchasePrice: batch.purchaseRate || selectedItemForBatch.purchasePrice,
        unit: selectedItemForBatch.Unit1?.unitName,
        stock: selectedItemForBatch.stock || 0, // Total stock for display
        batchId: batch.id,
        batch: batch.batchNumber,
        expiryDate: batch.expiryDate || "",
        batchQuantity: batch.quantity || 0, // Specific batch quantity for validation
      });
      setShowBatchDialog(false);
      setSelectedItemForBatch(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl max-h-[85vh] flex flex-col bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <h2 className="text-lg font-bold">Select Item</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b bg-gray-25 flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            title="Refresh stock data"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <div className="text-sm text-gray-600 font-medium">
            Total: {filteredItems.length}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="loader"></div>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[250px]">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[100px]">Packing</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[80px]">Stock</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[80px]">Batches</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[80px]">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 min-w-[100px]">Sale Rate</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-blue-50 cursor-pointer transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-4 py-3 min-w-[250px]">
                        <div className="font-medium text-gray-900 truncate">{item.productname}</div>
                        <div className="text-xs text-gray-500 truncate">{item.goods}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.packing || "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (item.stock || 0) > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {item.stock || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-gray-600">
                          {item.batches?.length || 0} batch{(item.batches?.length || 0) !== 1 ? 'es' : ''}
                        </span>
                        {item.batches && item.batches.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Latest: {item.batches[0]?.batchNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">{item.Unit1?.unitName || "-"}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ₹{parseFloat(item.salerate || item.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleItemSelect(item)}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${
                            (item.stock || 0) > 0
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                          disabled={(item.stock || 0) === 0}
                        >
                          {(item.stock || 0) > 0 ? "Select" : "Out of Stock"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <BatchSelectionDialog
        open={showBatchDialog}
        onClose={() => {
          setShowBatchDialog(false);
          setSelectedItemForBatch(null);
        }}
        onSelectBatch={handleBatchSelect}
        itemId={selectedItemForBatch?.id}
        itemName={selectedItemForBatch?.productname || "Unknown Item"}
      />
    </div>
  );
};

export default SelectItemDialog;
