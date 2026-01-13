import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, TrendingUp, TrendingDown } from "lucide-react";
import Button from "../../componets/common/Button";
import { showToast } from "../../componets/common/Toast";
import CommonPageLayout from "../../componets/layout/CommonPageLayout";
import { useSelector } from "react-redux";
import Modal from "../../componets/common/Modal";
import Input from "../../componets/common/Input";
import Select from "../../componets/common/Select";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
} from "../../services/itemApi";
import { useGetStoresQuery } from "../../services/storeApi";

const StockManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: "add", // add or reduce
    quantity: 0,
    reason: "",
  });
  const navigate = useNavigate();
  const { currentCompany } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  const {
    data: itemsData,
    isLoading,
    isFetching,
    refetch: refetchItems,
  } = useGetItemsQuery(
    {
      companyId: currentCompany?.id,
      search,
    },
    { skip: !currentCompany?.id }
  );

  const { data: storesData } = useGetStoresQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  const [updateItem] = useUpdateItemMutation();

  useEffect(() => {
    if (itemsData?.data) {
      let filteredData = itemsData.data;

      if (selectedStore) {
        filteredData = filteredData.filter(
          (item) => item.store?.id === selectedStore
        );
      }

      if (search) {
        filteredData = filteredData.filter(
          (item) =>
            item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
            item.itemCode?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setData(filteredData);
    }
  }, [itemsData, selectedStore, search]);

  const handleOpenAdjustmentModal = (item) => {
    setSelectedItem(item);
    setAdjustmentData({
      type: "add",
      quantity: 0,
      reason: "",
    });
    setShowAdjustmentModal(true);
  };

  const handleCloseAdjustmentModal = () => {
    setShowAdjustmentModal(false);
    setSelectedItem(null);
    setAdjustmentData({
      type: "add",
      quantity: 0,
      reason: "",
    });
  };

  const handleAdjustStock = async () => {
    if (!adjustmentData.quantity || adjustmentData.quantity <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    try {
      const newQuantity =
        adjustmentData.type === "add"
          ? (selectedItem.quantity || 0) + adjustmentData.quantity
          : (selectedItem.quantity || 0) - adjustmentData.quantity;

      if (newQuantity < 0) {
        showToast("Stock cannot be negative", "error");
        return;
      }

      await updateItem({
        id: selectedItem.id,
        quantity: newQuantity,
      }).unwrap();

      showToast(
        `Stock ${adjustmentData.type === "add" ? "increased" : "decreased"} successfully`,
        "success"
      );
      handleCloseAdjustmentModal();
      refetchItems();
    } catch (error) {
      showToast(error?.data?.message || "Failed to adjust stock", "error");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Item Name",
      "Item Code",
      "Store",
      "Current Stock",
      "Rate",
      "Stock Value",
    ];
    const rows = data.map((row) => [
      row.itemName,
      row.itemCode,
      row.store?.storeName || "-",
      row.quantity || 0,
      row.rate || 0,
      (row.quantity || 0) * (row.rate || 0),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-management-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Stock data exported successfully", "success");
  };

  const columns = [
    {
      key: "itemName",
      title: "Item Name",
      render: (value) => <div className="font-medium text-gray-900">{value}</div>,
    },
    {
      key: "itemCode",
      title: "Item Code",
      render: (value) => <div className="text-gray-600">{value}</div>,
    },
    {
      key: "storeName",
      title: "Store",
      render: (value, row) => <div className="text-gray-600">{row.store?.storeName || "-"}</div>,
    },
    {
      key: "quantity",
      title: "Current Stock",
      render: (value) => {
        const qty = value || 0;
        const color = qty === 0 ? "text-red-600" : qty < 10 ? "text-orange-600" : "text-green-600";
        return <div className={`font-bold ${color}`}>{qty}</div>;
      },
    },
    {
      key: "rate",
      title: "Rate",
      render: (value) => {
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(value || 0);
        return <div className="font-medium text-gray-900">{formatted}</div>;
      },
    },
    {
      key: "value",
      title: "Stock Value",
      render: (value, row) => {
        const total = (row.quantity || 0) * (row.rate || 0);
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(total);
        return <div className="font-medium text-gray-900">{formatted}</div>;
      },
    },
  ];

  const totalStockValue = data.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );

  const lowStockItems = data.filter((item) => (item.quantity || 0) < 10).length;
  const outOfStockItems = data.filter((item) => (item.quantity || 0) === 0).length;

  return (
    <>
      <CommonPageLayout
        title="Stock Management"
        subtitle="Monitor and adjust inventory levels across stores"
        actions={[
          <Button
            key="export"
            variant="secondary"
            onClick={handleExportCSV}
            disabled={data.length === 0}
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>,
        ]}
        justifyBetween={true}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        tableData={data || []}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        renderRowActions={(row) => (
          <button
            onClick={() => handleOpenAdjustmentModal(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Adjust
          </button>
        )}
      />

      {/* Adjustment Modal */}
      <Modal
        isOpen={showAdjustmentModal}
        onClose={handleCloseAdjustmentModal}
        title={`Adjust Stock - ${selectedItem?.itemName}`}
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="text-2xl font-bold text-gray-900">
              {selectedItem?.quantity || 0}
            </p>
          </div>

          <Select
            label="Adjustment Type"
            value={adjustmentData.type}
            onChange={(e) =>
              setAdjustmentData({ ...adjustmentData, type: e.target.value })
            }
            options={[
              { value: "add", label: "Add Stock" },
              { value: "reduce", label: "Reduce Stock" },
            ]}
          />

          <Input
            label="Quantity"
            type="number"
            step="1"
            value={adjustmentData.quantity}
            onChange={(e) =>
              setAdjustmentData({
                ...adjustmentData,
                quantity: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0"
            required
          />

          <Input
            label="Reason"
            value={adjustmentData.reason}
            onChange={(e) =>
              setAdjustmentData({ ...adjustmentData, reason: e.target.value })
            }
            placeholder="e.g., Damage, Expiry, Recount"
          />

          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-600">New Stock Level</p>
            <p className="text-2xl font-bold text-blue-900">
              {adjustmentData.type === "add"
                ? (selectedItem?.quantity || 0) + adjustmentData.quantity
                : (selectedItem?.quantity || 0) - adjustmentData.quantity}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={handleCloseAdjustmentModal}>
              Cancel
            </Button>
            <Button onClick={handleAdjustStock}>Confirm Adjustment</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StockManagement;
