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
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl max-h-[85vh] flex flex-col bg-(--card-bg)/90  rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-(--header-bg) to-(--header-bg)/90 text-white relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Search className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Inventory Search</h2>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Locate and allocate products for procurement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-(--sidebar-active-bg) flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="search.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 font-bold text-sm shadow-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 font-black uppercase tracking-widest text-[10px] appearance-none shadow-sm"
          >
            <option value="name">Alpha Sort</option>
            <option value="stock">Inventory Level</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-(--sidebar-active-bg) text-(--primary-color) rounded-2xl hover:bg-(--primary-color) hover:text-white transition-all duration-300 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] border border-(--primary-color)/20"
            title="Refresh stock data"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Sync
          </button>
          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-auto italic">
            Entries Matched: {filteredItems.length}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-(--primary-color)/20 border-t-(--primary-color) rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-(--bg-main) border-b border-gray-200 dark:border-white/5 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[250px]">Product Identification</th>
                  <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[100px]">Packing</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[80px]">Liquidity</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[120px]">Batch Distribution</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[80px]">Unit</th>
                  <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[100px]">Market Value</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[80px]">Commit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="bg-(--sidebar-active-bg) hover:bg-(--sidebar-active-bg)/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => handleItemSelect(item)}
                    >
                      <td className="px-6 py-5 min-w-[250px]">
                        <div className="font-black text-(--text-main) uppercase tracking-tighter text-sm group-hover:text-(--primary-color) transition-colors">{item.productname}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.goods || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-gray-500 uppercase">{item.packing || "-"}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${(item.stock || 0) > 0
                          ? "bg-emerald-500/10 text-emerald-500 shadow-sm shadow-emerald-500/10"
                          : "bg-red-500/10 text-red-500"
                          }`}>
                          {item.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {item.batches?.length || 0} Segment{(item.batches?.length || 0) !== 1 ? 's' : ''}
                        </div>
                        {item.batches && item.batches.length > 0 && (
                          <div className="text-[8px] text-(--primary-color) font-black mt-1 uppercase italic tracking-widest">
                            Active: {item.batches[0]?.batchNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center text-xs font-bold text-gray-400 uppercase">{item.Unit1?.unitName || "-"}</td>
                      <td className="px-6 py-5 text-right font-black italic tracking-tighter text-sm text-(--text-main)">
                        ₹{parseFloat(item.salerate || item.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-center text-xs font-black">
                        <button
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all transform active:scale-95 ${(item.stock || 0) > 0
                            ? "bg-(--primary-color) text-white shadow-lg shadow-(--primary-color)/20 hover:brightness-110"
                            : "bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed uppercase"
                            }`}
                          disabled={(item.stock || 0) === 0}
                        >
                          {(item.stock || 0) > 0 ? "Select" : "Depleted"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
                          <Search size={32} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">No matching assets found in repository</p>
                      </div>
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
