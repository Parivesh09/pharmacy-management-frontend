import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import Button from "../../../../components/common/Button";
import { showToast } from "../../../../components/common/Toast";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import { useSelector } from "react-redux";
import { useGetItemsQuery } from "../../../../services/itemApi";
import { useGetStoresQuery } from "../../../../services/storeApi";

const OpeningBalanceStock = () => {
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { currentCompany } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const prevDataRef = useRef([]);

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
      title: "Opening Qty",
      render: (value) => (
        <div className="font-medium text-gray-900">{value || 0}</div>
      ),
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
      title: "Total Value",
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

  const {
    data: itemsData,
    isLoading,
    isFetching,
    refetch: refetchItems,
  } = useGetItemsQuery(
    {
      companyId: currentCompany?.id,
      search,
      page,
      limit,
    },
    { skip: !currentCompany?.id }
  );

  const { data: storesData } = useGetStoresQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  // Note: Create/Update/Delete operations should be done through the Item master page
  // This is a read-only opening balance view

  useEffect(() => {
    setPage(1);
    setData([]);
    prevDataRef.current = [];
  }, [search, selectedStore]);

  useEffect(() => {
    if (itemsData?.data && itemsData.data.length > 0) {
      let filteredData = itemsData.data;

      if (selectedStore) {
        filteredData = filteredData.filter(
          (item) => item.store?.id === selectedStore
        );
      }

      const uniqueIncomingData = Array.from(
        new Map(filteredData.map((item) => [item.id, item])).values()
      );

      if (page === 1) {
        setData(uniqueIncomingData);
        prevDataRef.current = uniqueIncomingData;
      } else {
        const existingIds = new Set(prevDataRef.current.map((item) => item.id));
        const uniqueNewData = uniqueIncomingData.filter(
          (item) => !existingIds.has(item.id)
        );

        if (uniqueNewData.length > 0) {
          const updatedData = [...prevDataRef.current, ...uniqueNewData];
          setData(updatedData);
          prevDataRef.current = updatedData;
        }
      }
    }
  }, [itemsData, page, selectedStore]);

  const handleOpenModal = (item = null) => {
    // This is a read-only view - navigate to Item master for editing
    showToast("Please edit items from the Item Master page", "info");
  };

  const handleExportCSV = () => {
    const headers = ["Item Name", "Item Code", "Store", "Opening Qty", "Rate", "Total Value"];
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
    a.download = `opening-balance-stock-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Stock data exported successfully", "success");
  };

  const totalValue = data.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );

  const pagination = itemsData?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  const loadMore = () => {
    if (pagination && page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Show message if no company is selected
  if (!currentCompany?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Please select a company first</p>
      </div>
    );
  }

  return (
    <>
      <CommonPageLayout
        title="Opening Balance - Stock"
        subtitle="Manage opening stock quantities and rates by store"
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
        hasMore={hasMore}
        onLoadMore={loadMore}
        tableData={data || []}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        renderRowActions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenModal(row)}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              View
            </button>
          </div>
        )}
      />

      {/* Summary Card */}
      {data.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(totalValue)}
              </p>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default OpeningBalanceStock;
