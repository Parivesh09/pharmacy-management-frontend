import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import { useGetSaleMastersQuery, useDeleteSaleMasterMutation } from "../../../../services/saleMasterApi";
import { showToast } from "../../../../components/common/Toast";
import { Plus } from "lucide-react";
import Button from "../../../../components/common/Button";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import useConfirmation from "../../../../hooks/useConfirmation";

const SaleMaster = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const limit = 10;

  const { 
    data: saleMastersData, 
    isLoading,
    isFetching,
    refetch 
  } = useGetSaleMastersQuery({
    page,
    limit,
    search,
  });

  const [deleteSaleMaster] = useDeleteSaleMasterMutation();

  const { 
    confirmationState, 
    showConfirmation, 
    hideConfirmation, 
    handleConfirm, 
  } = useConfirmation();

  useEffect(() => {
    if (saleMastersData?.data && saleMastersData.data.length > 0) {
      if (page === 1) {
        setAllData(saleMastersData.data);
        setSelectedRow(saleMastersData.data[0]);
      } else {
        setAllData((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = saleMastersData.data.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [saleMastersData, page]);

  const handleAdd = () => navigate("/master/accounts/sale/create");

  const handleEdit = (row) => navigate(`/master/accounts/sale/edit/${row.id}`);

  const handleDelete = async (row) => {
    try {
      await deleteSaleMaster(row.id).unwrap();
      showToast("Sale master deleted successfully", "success");
      refetch();
    } catch (error) {
      showToast(error?.data?.message || "Failed to delete sale master", "error");
    }
  };

  const handleLoadMore = () => {
    if (saleMastersData?.totalPages && page < saleMastersData.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setAllData([]);
  };

  const columns = [
    {
      key: "salesType",
      title: "Name",
      render: (value, row) => (
        <div className="font-medium text-gray-900 flex items-center gap-2">
          {value}
          {row.isDefault && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Default
            </span>
          )}
        </div>
      ),
    },
    {
      key: "igstPercentage",
      title: "IGST %",
      render: (value, row) => (
        <div className="text-gray-600">{value}%</div>
      ),
    },
    {
      key: "cgstPercentage",
      title: "CGST %",
      render: (value, row) => (
        <div className="text-gray-600">{value}%</div>
      ),
    },
    {
      key: "sgstPercentage",
      title: "SGST %",
      render: (value, row) => (
        <div className="text-gray-600">{value}%</div>
      ),
    },
    {
      key: "cessPercentage",
      title: "Cess %",
      render: (value, row) => (
        <div className="text-gray-600">{value}%</div>
      ),
    },
    {
      key: "taxability",
      title: "Taxability",
      render: (value, row) => (
        <div className="text-gray-600">{value}</div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value, row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    <Button key="add" onClick={handleAdd} variant="primary">
      <Plus size={16} /> Create
    </Button>,
  ];

  const rowInfoPanel = selectedRow && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="font-medium text-gray-700">Sales Type:</span>
        <p className="text-gray-900 flex items-center gap-2">
          {selectedRow.salesType}
          {selectedRow.isDefault && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Default
            </span>
          )}
        </p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Local Sales Ledger:</span>
        <p className="text-gray-900">{selectedRow.localSalesLedger?.ledgerName}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Central Sales Ledger:</span>
        <p className="text-gray-900">{selectedRow.centralSalesLedger?.ledgerName}</p>
      </div>

      <div>
        <span className="font-medium text-gray-700">IGST Ledger:</span>
        <p className="text-gray-900">{selectedRow.igstLedger?.ledgerName}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">CGST Ledger:</span>
        <p className="text-gray-900">{selectedRow.cgstLedger?.ledgerName}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">SGST Ledger:</span>
        <p className="text-gray-900">{selectedRow.sgstLedger?.ledgerName}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">CESS Ledger:</span>
        <p className="text-gray-900">{selectedRow.cessLedger?.ledgerName}</p>
      </div>
      {selectedRow.description && (
        <div className="col-span-2 md:col-span-4">
          <span className="font-medium text-gray-700">Description:</span>
          <p className="text-gray-900">{selectedRow.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <CommonPageLayout
        title="Sale Master (Sales Only)"
        actions={actions}
        search={search}
        onSearchChange={handleSearchChange}
        tableData={allData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedRow={selectedRow}
        onRowSelect={setSelectedRow}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(row) => showConfirmation(() => handleDelete(row))}
        rowInfoPanel={rowInfoPanel}
        enableInfiniteScroll={true}
        hasMore={saleMastersData?.totalPages ? page < saleMastersData.totalPages : false}
        onLoadMore={handleLoadMore}
      />

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title="Delete Sale Master"
        message="Are you sure you want to delete this sale master? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default SaleMaster;