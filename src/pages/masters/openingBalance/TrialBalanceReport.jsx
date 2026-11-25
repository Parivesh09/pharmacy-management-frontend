import { useState, useEffect } from "react";
import { Download, Filter } from "lucide-react";
import Button from "../../../components/common/Button";
import { showToast } from "../../../components/common/Toast";
import CommonPageLayout from "../../../components/layout/CommonPageLayout";
import { useSelector } from "react-redux";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import { useGetLedgersByCompanyIdQuery } from "../../../services/ledgerApi";
import { useGetGroupsQuery } from "../../../services/groupApi";

const TrialBalanceReport = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { currentCompany } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  const { data: ledgersData, isLoading } = useGetLedgersByCompanyIdQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  const { data: groupsData } = useGetGroupsQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  useEffect(() => {
    if (ledgersData?.data) {
      const processedData = ledgersData.data.map((ledger) => {
        const openingBalance = ledger.openingBalance || 0;
        const balanceType = ledger.balanceType || "Debit";

        return {
          ...ledger,
          debitBalance: balanceType === "Debit" ? openingBalance : 0,
          creditBalance: balanceType === "Credit" ? openingBalance : 0,
        };
      });

      setData(processedData);
    }
  }, [ledgersData]);

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    data.forEach((ledger) => {
      totalDebit += ledger.debitBalance || 0;
      totalCredit += ledger.creditBalance || 0;
    });

    return {
      totalDebit,
      totalCredit,
      difference: Math.abs(totalDebit - totalCredit),
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
    };
  };

  const totals = calculateTotals();

  const handleExportPDF = () => {
    const content = generateTrialBalanceReport();
    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Trial balance report exported successfully", "success");
  };

  const generateTrialBalanceReport = () => {
    const rows = data
      .map(
        (ledger) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${ledger.ledgerName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${ledger.accountGroup?.groupName || "-"}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(ledger.debitBalance || 0).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(ledger.creditBalance || 0).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Trial Balance Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          .total-row { background-color: #f0f0f0; font-weight: bold; }
          .status { margin-top: 20px; padding: 10px; border-radius: 4px; }
          .balanced { background-color: #d4edda; color: #155724; }
          .unbalanced { background-color: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Trial Balance Report</h1>
          <p>Period: ${dateRange.from} to ${dateRange.to}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Ledger Name</th>
              <th>Group</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row">
              <td colspan="2">TOTAL</td>
              <td style="text-align: right;">${totals.totalDebit.toFixed(2)}</td>
              <td style="text-align: right;">${totals.totalCredit.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="status ${totals.isBalanced ? "balanced" : "unbalanced"}">
          <strong>${totals.isBalanced ? "✓ Trial Balance is BALANCED" : "✗ Trial Balance is NOT BALANCED"}</strong>
          ${!totals.isBalanced ? `<p>Difference: ${totals.difference.toFixed(2)}</p>` : ""}
        </div>
      </body>
      </html>
    `;
  };

  const columns = [
    {
      key: "ledgerName",
      title: "Ledger Name",
      render: (value) => <div className="font-medium text-gray-900">{value}</div>,
    },
    {
      key: "groupName",
      title: "Group",
      render: (value, row) => <div className="text-gray-600">{row.accountGroup?.groupName || "-"}</div>,
    },
    {
      key: "debitBalance",
      title: "Debit",
      render: (value) => {
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(value || 0);
        return <div className="text-right font-medium text-gray-900">{formatted}</div>;
      },
    },
    {
      key: "creditBalance",
      title: "Credit",
      render: (value) => {
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(value || 0);
        return <div className="text-right font-medium text-gray-900">{formatted}</div>;
      },
    },
  ];

  return (
    <>
      <CommonPageLayout
        title="Trial Balance Report"
        subtitle="Verify that total debits equal total credits"
        actions={[
          <Button
            key="filter"
            variant="secondary"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>,
          <Button key="export" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>,
        ]}
        tableData={data || []}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Summary Section */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Debit</p>
            <p className="text-3xl font-bold text-blue-900">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
              }).format(totals.totalDebit)}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Credit</p>
            <p className="text-3xl font-bold text-green-900">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
              }).format(totals.totalCredit)}
            </p>
          </div>
          <div
            className={`p-4 border rounded-lg ${
              totals.isBalanced
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-sm text-gray-600">Status</p>
            <p
              className={`text-3xl font-bold ${
                totals.isBalanced ? "text-green-900" : "text-red-900"
              }`}
            >
              {totals.isBalanced ? "✓ BALANCED" : "✗ UNBALANCED"}
            </p>
            {!totals.isBalanced && (
              <p className="text-sm text-red-600 mt-1">
                Difference: {totals.difference.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Trial Balance"
      >
        <div className="space-y-4">
          <Input
            label="From Date"
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />

          <Input
            label="To Date"
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange({ ...dateRange, to: e.target.value })
            }
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

export default TrialBalanceReport;
