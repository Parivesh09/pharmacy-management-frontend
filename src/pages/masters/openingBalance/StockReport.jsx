import { useState, useEffect } from "react";
import { Download, Filter, AlertTriangle } from "lucide-react";
import Button from "../../../components/common/Button";
import { showToast } from "../../../components/common/Toast";
import CommonPageLayout from "../../../components/layout/CommonPageLayout";
import { useSelector } from "react-redux";
import Modal from "../../../components/common/Modal";
import Select from "../../../components/common/Select";
import { useGetItemsQuery } from "../../../services/itemApi";
import { useGetStoresQuery } from "../../../services/storeApi";

const StockReport = () => {
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, low, outofstock
  const { currentCompany } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  const { data: itemsData, isLoading } = useGetItemsQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  const { data: storesData } = useGetStoresQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

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

      if (filterType === "low") {
        filteredData = filteredData.filter((item) => (item.quantity || 0) < 10 && (item.quantity || 0) > 0);
      } else if (filterType === "outofstock") {
        filteredData = filteredData.filter((item) => (item.quantity || 0) === 0);
      }

      setData(filteredData);
    }
  }, [itemsData, selectedStore, search, filterType]);

  const handleExportCSV = () => {
    const headers = [
      "Item Name",
      "Item Code",
      "Store",
      "Current Stock",
      "Rate",
      "Stock Value",
      "Status",
    ];
    const rows = data.map((row) => {
      const qty = row.quantity || 0;
      let status = "In Stock";
      if (qty === 0) status = "Out of Stock";
      else if (qty < 10) status = "Low Stock";

      return [
        row.itemName,
        row.itemCode,
        row.store?.storeName || "-",
        qty,
        row.rate || 0,
        (qty * (row.rate || 0)).toFixed(2),
        status,
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Stock report exported successfully", "success");
  };

  const handleExportPDF = () => {
    const content = generateStockReport();
    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Stock report exported successfully", "success");
  };

  const generateStockReport = () => {
    const rows = data
      .map(
        (item) => {
          const qty = item.quantity || 0;
          let status = "In Stock";
          let statusColor = "#28a745";
          if (qty === 0) {
            status = "Out of Stock";
            statusColor = "#dc3545";
          } else if (qty < 10) {
            status = "Low Stock";
            statusColor = "#ffc107";
          }

          return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.itemName}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.itemCode}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.store?.storeName || "-"}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${qty}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(item.rate || 0).toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${((qty * (item.rate || 0)).toFixed(2))}</td>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: ${statusColor}; color: white; font-weight: bold;">${status}</td>
        </tr>
      `;
        }
      )
      .join("");

    const totalValue = data.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
      0
    );

    const lowStockCount = data.filter((item) => (item.quantity || 0) < 10 && (item.quantity || 0) > 0).length;
    const outOfStockCount = data.filter((item) => (item.quantity || 0) === 0).length;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Stock Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          .summary { margin-top: 20px; }
          .summary-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
          .alert { margin-top: 20px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Stock Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Item Code</th>
              <th>Store</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Stock Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Total Items:</span>
            <strong>${data.length}</strong>
          </div>
          <div class="summary-row">
            <span>Total Stock Value:</span>
            <strong>${totalValue.toFixed(2)}</strong>
          </div>
          <div class="summary-row">
            <span>Low Stock Items:</span>
            <strong>${lowStockCount}</strong>
          </div>
          <div class="summary-row">
            <span>Out of Stock Items:</span>
            <strong>${outOfStockCount}</strong>
          </div>
        </div>

        ${lowStockCount > 0 || outOfStockCount > 0 ? `
          <div class="alert">
            <strong>⚠️ Alert:</strong> You have ${lowStockCount} low stock items and ${outOfStockCount} out of stock items that need attention.
          </div>
        ` : ""}
      </body>
      </html>
    `;
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
        let color = "text-green-600";
        if (qty === 0) color = "text-red-600";
        else if (qty < 10) color = "text-orange-600";

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
    {
      key: "status",
      title: "Status",
      render: (value, row) => {
        const qty = row.quantity || 0;
        let status = "In Stock";
        let bgColor = "bg-green-100";
        let textColor = "text-green-800";

        if (qty === 0) {
          status = "Out of Stock";
          bgColor = "bg-red-100";
          textColor = "text-red-800";
        } else if (qty < 10) {
          status = "Low Stock";
          bgColor = "bg-orange-100";
          textColor = "text-orange-800";
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const totalStockValue = data.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );

  const lowStockItems = data.filter((item) => (item.quantity || 0) < 10 && (item.quantity || 0) > 0).length;
  const outOfStockItems = data.filter((item) => (item.quantity || 0) === 0).length;

  return (
    <>
      <CommonPageLayout
        title="Stock Report"
        subtitle="Comprehensive stock analysis and inventory status"
        actions={[
          <Button
            key="filter"
            variant="secondary"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>,
          <Button
            key="export-csv"
            variant="secondary"
            onClick={handleExportCSV}
            disabled={data.length === 0}
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>,
          <Button
            key="export-pdf"
            onClick={handleExportPDF}
            disabled={data.length === 0}
          >
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>,
        ]}
        justifyBetween={true}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        tableData={data || []}
        columns={columns}
        isLoading={isLoading}
      />


      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Stock Report"
      >
        <div className="space-y-4">
          <Select
            label="Store"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            options={
              storesData?.data?.map((store) => ({
                value: store.id,
                label: store.storeName,
              })) || []
            }
          />

          <Select
            label="Filter Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: "all", label: "All Items" },
              { value: "low", label: "Low Stock Items" },
              { value: "outofstock", label: "Out of Stock Items" },
            ]}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowFilterModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StockReport;
