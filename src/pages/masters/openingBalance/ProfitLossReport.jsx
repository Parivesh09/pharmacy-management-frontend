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

const ProfitLossReport = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { currentCompany } = useSelector((state) => state.user);
  const [reportData, setReportData] = useState({
    income: [],
    expenses: [],
    totals: {},
  });

  const { data: ledgersData, isLoading } = useGetLedgersByCompanyIdQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  const { data: groupsData } = useGetGroupsQuery(
    { companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );

  useEffect(() => {
    if (ledgersData?.data && groupsData?.data) {
      const incomeGroups = ["Income", "Sales", "Service Income"];
      const expenseGroups = ["Expenses", "Cost of Goods Sold", "Administrative Expenses"];

      const income = ledgersData.data.filter((ledger) =>
        incomeGroups.includes(ledger.accountGroup?.groupName)
      );

      const expenses = ledgersData.data.filter((ledger) =>
        expenseGroups.includes(ledger.accountGroup?.groupName)
      );

      const totalIncome = income.reduce(
        (sum, ledger) => sum + (ledger.openingBalance || 0),
        0
      );

      const totalExpenses = expenses.reduce(
        (sum, ledger) => sum + (ledger.openingBalance || 0),
        0
      );

      const profit = totalIncome - totalExpenses;

      setReportData({
        income,
        expenses,
        totals: {
          totalIncome,
          totalExpenses,
          profit,
          profitMargin: totalIncome > 0 ? (profit / totalIncome) * 100 : 0,
        },
      });
    }
  }, [ledgersData, groupsData]);

  const handleExportPDF = () => {
    const content = generateProfitLossReport();
    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-loss-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Profit & Loss report exported successfully", "success");
  };

  const generateProfitLossReport = () => {
    const incomeRows = reportData.income
      .map(
        (ledger) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${ledger.ledgerName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(ledger.openingBalance || 0).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const expenseRows = reportData.expenses
      .map(
        (ledger) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${ledger.ledgerName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(ledger.openingBalance || 0).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Profit & Loss Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin-top: 20px; }
          .section-title { font-weight: bold; font-size: 14px; background-color: #e8e8e8; padding: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          .total-row { background-color: #f0f0f0; font-weight: bold; }
          .summary { margin-top: 30px; }
          .summary-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
          .profit { color: green; font-weight: bold; }
          .loss { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Profit & Loss Statement</h1>
          <p>Period: ${dateRange.from} to ${dateRange.to}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
          <div class="section-title">INCOME</div>
          <table>
            <thead>
              <tr>
                <th>Particulars</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${incomeRows}
              <tr class="total-row">
                <td>Total Income</td>
                <td style="text-align: right;">${reportData.totals.totalIncome?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">EXPENSES</div>
          <table>
            <thead>
              <tr>
                <th>Particulars</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows}
              <tr class="total-row">
                <td>Total Expenses</td>
                <td style="text-align: right;">${reportData.totals.totalExpenses?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary">
          <div class="summary-row">
            <span>Total Income:</span>
            <strong>${reportData.totals.totalIncome?.toFixed(2)}</strong>
          </div>
          <div class="summary-row">
            <span>Total Expenses:</span>
            <strong>${reportData.totals.totalExpenses?.toFixed(2)}</strong>
          </div>
          <div class="summary-row" style="border-bottom: 2px solid #000; font-size: 16px;">
            <span>Net Profit/Loss:</span>
            <strong class="${reportData.totals.profit >= 0 ? "profit" : "loss"}">
              ${reportData.totals.profit?.toFixed(2)}
            </strong>
          </div>
          <div class="summary-row">
            <span>Profit Margin:</span>
            <strong>${reportData.totals.profitMargin?.toFixed(2)}%</strong>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profit & Loss Report</h1>
            <p className="text-gray-600 mt-1">
              Period: {dateRange.from} to {dateRange.to}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
          </div>
        </div>

        {/* Income Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
            INCOME
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Particulars</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {reportData.income.map((ledger) => (
                  <tr key={ledger.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{ledger.ledgerName}</td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      }).format(ledger.openingBalance || 0)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-2">Total Income</td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 2,
                    }).format(reportData.totals.totalIncome || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-500">
            EXPENSES
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Particulars</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {reportData.expenses.map((ledger) => (
                  <tr key={ledger.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{ledger.ledgerName}</td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      }).format(ledger.openingBalance || 0)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-2">Total Expenses</td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 2,
                    }).format(reportData.totals.totalExpenses || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-blue-900">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              }).format(reportData.totals.totalIncome || 0)}
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-900">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              }).format(reportData.totals.totalExpenses || 0)}
            </p>
          </div>
          <div
            className={`p-4 border rounded-lg ${
              reportData.totals.profit >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-sm text-gray-600">Net Profit/Loss</p>
            <p
              className={`text-2xl font-bold ${
                reportData.totals.profit >= 0
                  ? "text-green-900"
                  : "text-red-900"
              }`}
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              }).format(reportData.totals.profit || 0)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-2xl font-bold text-purple-900">
              {reportData.totals.profitMargin?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter P&L Report"
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

export default ProfitLossReport;
