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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-lg font-bold text-gray-800">
            {showCreateForm ? "Create New Batch" : `Batch Selection - ${itemName}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search batch number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
                >
                  <Plus size={18} /> Add New Batch
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
                  <thead className="bg-blue-100 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Batch</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Closing Qty.</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Unit 1st</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">₹ M.R.P</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">₹ Billing M.R.P</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Mfg. Date</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Exp. Date</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((batch, index) => (
                      <tr
                        key={batch.id}
                        className={`border-b hover:bg-blue-50 cursor-pointer transition ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                        onClick={() => handleSelectBatch(batch)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-blue-600">
                            {batch.batchNumber}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${
                            parseFloat(batch.quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {parseFloat(batch.quantity || 0).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {batch.unit1st || 'PCS'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {batch.mrp ? `₹${parseFloat(batch.mrp).toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {batch.billingMrp ? `₹${parseFloat(batch.billingMrp).toFixed(2)}` : '0'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {formatDate(batch.mfgDate)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={batch.expiryDate && new Date(batch.expiryDate) < new Date() ? 'text-red-600 font-semibold' : ''}>
                            {formatDate(batch.expiryDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${getStatusColor(batch.status)}`}>
                            {batch.status?.toUpperCase() || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit action
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle info action
                              }}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                              title="Info"
                            >
                              <Info size={16} />
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
