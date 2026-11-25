import { useState, useEffect } from "react";
import { Download, Filter } from "lucide-react";
import Button from "../../../components/common/Button";
import { showToast } from "../../../components/common/Toast";
import CommonPageLayout from "../../../components/layout/CommonPageLayout";
import { useSelector } from "react-redux";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import {
  useGetLedgersByCompanyIdQuery,
  useGetLedgerDetailsQuery,
} from "../../../services/ledgerApi";
import { useGetGroupsQuery } from "../../../services/groupApi";

const LedgerReport = () => {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const { currentCompany } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  const {
    data: ledgersData,
    isLoading,
    isFetching,
  } = useGetLedgersByCompanyIdQuery(
    {
      companyId: currentCompany?.id,
      search,
    },
    { skip: !currentCompany?.id }
  );

  const { data: groupsData } = useGetGroupsQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  const { data: ledgerDetailsData } = useGetLedgerDetailsQuery(
    {
      ledgerId: selectedLedger?.id,
      from: dateRange.from,
      to: dateRange.to,
    },
    { skip: !selectedLedger?.id }
  );

  useEffect(() => {
    if (ledgersData?.data) {
      let filteredData = ledgersData.data;

      if (selectedGroup) {
        filteredData = filteredData.filter(
          (ledger) => ledger.acgroup === selectedGroup
        );
      }

      if (search) {
        filteredData = filteredData.filter(
          (ledger) =>
            ledger.ledgerName?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setData(filteredData);
    }
  }, [ledgersData, selectedGroup, search]);

  const handleExportPDF = () => {
    if (!selectedLedger) {
      showToast("Please select a ledger", "error");
      return;
    }

    // Generate PDF content
    const content = generateLedgerReport();
    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-report-${selectedLedger.ledgerName}-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Ledger report exported successfully", "success");
  };

  const generateLedgerReport = () => {
    const transactions = ledgerDetailsData?.data?.transactions || [];
    const openingBalance = selectedLedger?.openingBalance || 0;
    const balanceType = selectedLedger?.balanceType || "Debit";

    let runningBalance = openingBalance;
    let totalDebit = 0;
    let totalCredit = 0;

    const rows = transactions.map((txn) => {
      const debit = txn.type === "Debit" ? txn.amount : 0;
      const credit = txn.type === "Credit" ? txn.amount : 0;

      totalDebit += debit;
      totalCredit += credit;

      if (balanceType === "Debit") {
        runningBalance = runningBalance + debit - credit;
      } else {
        runningBalance = runningBalance + credit - debit;
      }

      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${txn.date}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${txn.description}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${debit.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${credit.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${runningBalance.toFixed(2)}</td>
        </tr>
      `;
    });

    const closingBalance = runningBalance;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ledger Report</title>
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
          .summary-row strong { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${selectedLedger?.ledgerName}</h1>
          <p>Period: ${dateRange.from} to ${dateRange.to}</p>
          <p>Balance Type: ${balanceType}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #f9f9f9;">
              <td colspan="2"><strong>Opening Balance</strong></td>
              <td style="text-align: right;">${balanceType === "Debit" ? openingBalance.toFixed(2) : "0.00"}</td>
              <td style="text-align: right;">${balanceType === "Credit" ? openingBalance.toFixed(2) : "0.00"}</td>
              <td style="text-align: right;"><strong>${openingBalance.toFixed(2)}</strong></td>
            </tr>
            ${rows.join("")}
            <tr style="background-color: #f0f0f0; font-weight: bold;">
              <td colspan="2">Closing Balance</td>
              <td style="text-align: right;">${totalDebit.toFixed(2)}</td>
              <td style="text-align: right;">${totalCredit.toFixed(2)}</td>
              <td style="text-align: right;">${closingBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Opening Balance:</span>
            <strong>${openingBalance.toFixed(2)}</strong>
          </div>
          <div class="summary-row">
            <span>Total Debit:</span>
            <strong>${totalDebit.toFixed(2)}</strong>
          </div>
          <div class="summary-row">
            <span>Total Credit:</span>
            <strong>${totalCredit.toFixed(2)}</strong>
          </div>
          <div class="summary-row" style="border-bottom: 2px solid #000; font-size: 16px;">
            <span>Closing Balance:</span>
            <strong>${closingBalance.toFixed(2)}</strong>
          </div>
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
      key: "balanceType",
      title: "Balance Type",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Debit"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "openingBalance",
      title: "Opening Balance",
      render: (value) => {
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(value || 0);
        return <div className="font-medium text-gray-900">{formatted}</div>;
      },
    },
  ];

  return (
    <>
      <CommonPageLayout
        title="Ledger Report"
        subtitle="View detailed ledger transactions and balances"
        actions={[
          <Button
            key="filter"
            variant="secondary"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>,
          <Button
            key="export"
            onClick={handleExportPDF}
            disabled={!selectedLedger}
          >
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>,
        ]}
        justifyBetween={true}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        tableData={data || []}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowSelect={(row) => setSelectedLedger(row)}
        selectedRow={selectedLedger}
      />

      {/* Ledger Details */}
      {selectedLedger && ledgerDetailsData && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedLedger.ledgerName} - Transactions
          </h3>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Opening Balance</p>
              <p className="text-xl font-bold text-blue-900">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(selectedLedger.openingBalance || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Total Debit</p>
              <p className="text-xl font-bold text-green-900">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(
                  ledgerDetailsData?.data?.totalDebit || 0
                )}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <p className="text-sm text-gray-600">Total Credit</p>
              <p className="text-xl font-bold text-orange-900">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(
                  ledgerDetailsData?.data?.totalCredit || 0
                )}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <p className="text-sm text-gray-600">Closing Balance</p>
              <p className="text-xl font-bold text-purple-900">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2,
                }).format(
                  ledgerDetailsData?.data?.closingBalance || 0
                )}
              </p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Debit</th>
                  <th className="px-4 py-2 text-right">Credit</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledgerDetailsData?.data?.transactions?.map((txn, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{txn.date}</td>
                    <td className="px-4 py-2">{txn.description}</td>
                    <td className="px-4 py-2 text-right">
                      {txn.type === "Debit"
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            minimumFractionDigits: 2,
                          }).format(txn.amount)
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {txn.type === "Credit"
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            minimumFractionDigits: 2,
                          }).format(txn.amount)
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      }).format(txn.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Ledgers"
      >
        <div className="space-y-4">
          <Select
            label="Group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            options={
              groupsData?.data?.map((group) => ({
                value: group.id,
                label: group.groupName,
              })) || []
            }
          />

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

export default LedgerReport;
