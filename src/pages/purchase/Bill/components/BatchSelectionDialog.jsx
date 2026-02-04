import React, { useState } from "react";
import { X, Search, Plus, Edit, Info } from "lucide-react";
import { useGetBatchesByItemQuery, useCreateBatchMutation } from "../../../../services/batchApi";
import toast from "react-hot-toast";

const BatchSelectionDialog = ({ open, onClose, onSelectBatch, itemId, itemName }) => {
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBatchData, setNewBatchData] = useState({
    batchNumber: "",
    quantity: 0,
    unit1st: "PCS",
    mrp: 0,
    billingMrp: 0,
    mfgDate: "",
    expiryDate: "",
    status: "Active"
  });
  const [isCreating, setIsCreating] = useState(false);

  const { data: batchesData, isLoading, refetch } = useGetBatchesByItemQuery(itemId, {
    skip: !open || !itemId,
  });
  const [createBatch] = useCreateBatchMutation();

  const batches = batchesData?.data || [];

  const filteredBatches = batches.filter((batch) =>
    batch.batchNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectBatch = (batch) => {
    onSelectBatch(batch);
    setSearch("");
  };

  const handleCreateBatch = async () => {
    if (!newBatchData.batchNumber.trim()) {
      toast.error("Please enter a batch number");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createBatch({
        itemId,
        ...newBatchData,
      }).unwrap();

      toast.success("Batch created successfully");
      setNewBatchData({
        batchNumber: "",
        quantity: 0,
        unit1st: "PCS",
        mrp: 0,
        billingMrp: 0,
        mfgDate: "",
        expiryDate: "",
        status: "Active"
      });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Error creating batch");
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600';
      case 'expired': return 'text-red-600';
      case 'inactive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-(--card-bg) rounded-[2.5rem] shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-50 dark:border-white/5 bg-gradient-to-r from-(--header-bg) to-(--header-bg)/90 text-white relative">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Info className="text-white" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">
                  {showCreateForm ? "Initialize Record" : "Batch Repository"}
                </h2>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                  {showCreateForm ? `New Entry for ${itemName}` : `Available Stock for ${itemName}`}
                </p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {showCreateForm ? (
          // Create Batch Form
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batch Number *
                </label>
                <input
                  type="text"
                  value={newBatchData.batchNumber}
                  onChange={(e) => setNewBatchData({...newBatchData, batchNumber: e.target.value})}
                  placeholder="e.g., B1, BATCH001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newBatchData.quantity}
                  onChange={(e) => setNewBatchData({...newBatchData, quantity: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={newBatchData.unit1st}
                  onChange={(e) => setNewBatchData({...newBatchData, unit1st: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PCS">PCS</option>
                  <option value="BOX">BOX</option>
                  <option value="STRIP">STRIP</option>
                  <option value="BOTTLE">BOTTLE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  MRP
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBatchData.mrp}
                  onChange={(e) => setNewBatchData({...newBatchData, mrp: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Billing MRP
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBatchData.billingMrp}
                  onChange={(e) => setNewBatchData({...newBatchData, billingMrp: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={newBatchData.mfgDate}
                  onChange={(e) => setNewBatchData({...newBatchData, mfgDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newBatchData.expiryDate}
                  onChange={(e) => setNewBatchData({...newBatchData, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newBatchData.status}
                  onChange={(e) => setNewBatchData({...newBatchData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewBatchData({
                    batchNumber: "",
                    quantity: 0,
                    unit1st: "PCS",
                    mrp: 0,
                    billingMrp: 0,
                    mfgDate: "",
                    expiryDate: "",
                    status: "Active"
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBatch}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create Batch"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Add Button */}
            <div className="p-6 border-b border-gray-50 dark:border-white/5 bg-(--sidebar-active-bg)/30">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="SCAN_OR_FILTER_BATCH_IDENTIFIER"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 font-bold text-sm tracking-tight"
                  />
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-3 bg-(--primary-color) text-white rounded-2xl hover:brightness-110 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-(--primary-color)/20 flex items-center gap-3 transition-all active:scale-95"
                >
                  <Plus size={18} /> New Batch Entry
                </button>
              </div>
            </div>

            {/* Batch Table */}
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading batches...</div>
              ) : filteredBatches.length === 0 ? (
                <div className="p-8 text-center">
                  {batches.length === 0 ? (
                    <div className="space-y-3">
                      <p className="text-gray-500">No batches available for this item</p>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        <Plus size={18} /> Create First Batch
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No batches match your search</p>
                  )}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-(--sidebar-active-bg)/50 border-b border-gray-50 dark:border-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px]">Identifier</th>
                      <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">Liquidity</th>
                      <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">Unit</th>
                      <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">₹ M.R.P</th>
                      <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">₹ Billing</th>
                      <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">Mfg. Date</th>
                      <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">Expiry</th>
                      <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">Status</th>
                      <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {filteredBatches.map((batch, index) => (
                      <tr
                        key={batch.id}
                        className="hover:bg-(--sidebar-active-bg)/30 cursor-pointer transition-all duration-300 group"
                        onClick={() => handleSelectBatch(batch)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-black text-(--primary-color) uppercase tracking-tighter text-sm">
                            {batch.batchNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                            parseFloat(batch.quantity || 0) > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {parseFloat(batch.quantity || 0).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                          {batch.unit1st || 'PCS'}
                        </td>
                        <td className="px-6 py-4 text-right font-black italic tracking-tighter text-sm">
                          {batch.mrp ? `₹${parseFloat(batch.mrp).toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-black italic tracking-tighter text-sm text-(--primary-color)">
                          {batch.billingMrp ? `₹${parseFloat(batch.billingMrp).toFixed(2)}` : '0'}
                        </td>
                        <td className="px-6 py-4 text-center text-[10px] font-bold text-gray-400">
                          {formatDate(batch.mfgDate)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`${batch.expiryDate && new Date(batch.expiryDate) < new Date() ? 'text-red-500 font-black' : 'font-bold text-xs text-(--text-main)'}`}>
                            {formatDate(batch.expiryDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${getStatusColor(batch.status)}`}>
                            {batch.status?.toUpperCase() || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-2 text-(--primary-color) hover:bg-(--primary-color)/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                              title="Edit Record"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                              title="Information"
                            >
                              <Info size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BatchSelectionDialog;
