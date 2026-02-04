import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useGetBillsQuery, useDeleteBillMutation } from "../../../services/salesBillApi";
import { useDebounce } from '../../../utils/useDebounce';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CommonPageLayout from "../../../componets/layout/CommonPageLayout";
import Button from "../../../componets/common/Button";

const BillList = () => {
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

  const handleAddBill = () => navigate("/sales/bill/create");

  const handleEdit = (row) => navigate(`/sales/bill/edit/${row.id}`);

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
      "Paid": "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
      "Pending": "bg-orange-500/10 text-orange-600 border border-orange-500/20",
      "Draft": "bg-gray-500/10 text-gray-600 border border-gray-500/20",
      "Cancelled": "bg-red-500/10 text-red-600 border border-red-500/20",
    };
    return colors[status] || "bg-blue-500/10 text-blue-600 border border-blue-500/20";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      "Paid": "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
      "Partial": "bg-orange-500/10 text-orange-600 border border-orange-500/20",
      "Unpaid": "bg-red-500/10 text-red-600 border border-red-500/20",
    };
    return colors[status] || "bg-blue-500/10 text-blue-600 border border-blue-500/20";
  };

  const columns = [
    { key: "billNo", title: "Bill No." },
    {
      key: "date",
      title: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "patientName", title: "Patient" },
    { key: "partyName", title: "Party" },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      title: "Payment",
      render: (value) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPaymentStatusColor(value)}`}>
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
      title="Sales Bills"
      subtitle="Manage your sales bills"
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

export default BillList; 