import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetLedgerDetailsQuery } from '../../../../services/ledgerApi';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Printer, 
  Share2, 
  MoreHorizontal,
  Filter,
  Calendar
} from 'lucide-react';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import Select from '../../../../components/common/Select';
import Loader from '../../../../components/common/Loader';
import {showToast} from '../../../../components/common/Toast';

const LedgerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), 3, 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear() + 1, 2, 31), 'yyyy-MM-dd')
  });
  const [viewType, setViewType] = useState('Standard');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, refetch } = useGetLedgerDetailsQuery({
    id,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      refetch();
    }
  }, [dateRange, refetch]);

  const handleExport = (type) => {

    console.log(`Exporting as ${type}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {

    console.log('Sharing ledger details');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd-MM-yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading ledger details</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const ledgerData = data?.data;
  if (!ledgerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No ledger data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div className="border-l border-gray-300 h-6" />
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Ledger : {ledgerData.ledger.name}
                </h1>
                {ledgerData.ledger.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ledgerData.ledger.address}
                  </p>
                )}
              </div>
            </div>

            
            <div className="flex items-center space-x-3">
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatDate(dateRange.startDate)} -To- {formatDate(dateRange.endDate)}
                </span>
              </div>

              
              <Select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-32"
              >
                <option value="Standard">Standard</option>
                <option value="Detailed">Detailed</option>
                <option value="Summary">Summary</option>
              </Select>

              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('excel')}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Excel</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">PDF</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <Printer className="h-4 w-4" />
                  <span className="text-xs">Print</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Share</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-xs">Filter</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center space-x-1">
                      <span>Particular</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center space-x-1">
                      <span>Vch/Bill No.</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center space-x-1">
                      <span>Voucher Type</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-end space-x-1">
                      <span>₹ Debit</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-end space-x-1">
                      <span>₹ Credit</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-end space-x-1">
                      <span>₹ Balance</span>
                      <Filter className="h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ledgerData.entries.map((entry, index) => (
                  <tr 
                    key={index} 
                    className={entry.voucherType === 'Purchase' ? 'bg-yellow-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.date ? formatDate(entry.date) : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.particular}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.voucherNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.voucherType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(entry.balance)} {entry.balanceType}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(ledgerData.totals.totalDebits)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(ledgerData.totals.totalCredits)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(ledgerData.totals.finalBalance)} {ledgerData.totals.finalBalanceType}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerDetails; 