import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useGetBillsQuery, useDeleteBillMutation } from "../../../services/purchaseBillApi";
import { useDebounce } from '../../../utils/useDebounce';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CommonPageLayout from "../../../components/layout/CommonPageLayout";
import Button from "../../../components/common/Button";

const PurchaseBillList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useGetBillsQuery({ page, limit, search: debouncedSearch });
  const [deleteBill] = useDeleteBillMutation();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedRow((prev) => {
        if (!prev || !data.data.find((s) => s.id === prev.id)) {
          return data.data[0];
        }
        return prev;
      });
    }
  }, [data]);

  const handleAddBill = () => navigate("/purchase/bill/create");

  const handleEdit = (row) => navigate(`/purchase/bill/edit/${row.id}`);

  const handleDelete = async (row) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await deleteBill(row.id).unwrap();
        toast.success("Bill deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Error deleting bill");
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Received": "bg-green-100 text-green-800",
      "Invoiced": "bg-blue-100 text-blue-800",
      "Draft": "bg-gray-100 text-gray-800",
      "Cancelled": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-yellow-100 text-yellow-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      "Paid": "bg-green-100 text-green-800",
      "Partial": "bg-orange-100 text-orange-800",
      "Unpaid": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-blue-100 text-blue-800";
  };

  const columns = [
    { key: "billNo", title: "Bill No." },
    {
      key: "billDate",
      title: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "supplierLedger",
      title: "Supplier",
      render: (value) => value?.ledgerName || "-",
    },
    { key: "supplierInvoiceNo", title: "Invoice No." },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      title: "Payment",
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "totalAmount",
      title: "Total",
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      key: "dueAmount",
      title: "Due",
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
    },
  ];

  return (
    <CommonPageLayout
      title="Purchase Bills"
      subtitle="Manage your purchase bills"
      actions={[
        <Button key="add" onClick={handleAddBill}>
          <Plus className="w-4 h-4" /> Create Bill
        </Button>,
      ]}
      search={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      tableData={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      selectedRow={selectedRow}
      onRowSelect={setSelectedRow}
      onAdd={handleAddBill}
      onEdit={handleEdit}
      onDelete={handleDelete}
      page={page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
    />
  );
};

export default PurchaseBillList;
