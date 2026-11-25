import React, { useState, useMemo } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import Input from '../../../components/common/Input';
import DataTable from '../../../components/common/DataTable';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import { useGetItemsQuery } from '../../../services/itemApi';
import { Search } from 'lucide-react';

const columns = [
  { title: 'Name', key: 'name', render: (val) => val },
  { title: '₹ M.R.P', key: 'mrp', render: (val) => val ? val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '-' },
  { title: 'Purchase Rate', key: 'purchaseRate', render: (val) => val ? val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '-' },
  { title: '₹ Cost', key: 'cost', render: (val) => val ? val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '-' },
  { title: '₹ S.Rate', key: 'saleRate', render: (val) => val ? val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '-' },
  { title: 'Status', key: 'status', render: (val) => <StatusBadge status={val} /> },
];


const enrichItems = (items) =>
  items.map((item, idx) => ({
    ...item,
    mrp: item.price * 1.2,
    purchaseRate: item.price * 0.8,
    cost: item.price * 0.8,
    saleRate: item.price * 1.1,
    status: item.status || 'Active',
    id: item.id || idx + 1,
  }));

export default function PriceListPage() {
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const { data: itemsData = {}, isLoading } = useGetItemsQuery();
  const items = itemsData?.data || [];


  const enrichItems = (items) =>
    (items || []).map((item, idx) => ({
      ...item,
      mrp: (item.price || 0) * 1.2,
      purchaseRate: (item.price || 0) * 0.8,
      cost: (item.price || 0) * 0.8,
      saleRate: (item.price || 0) * 1.1,
      status: item.status || 'Active',
      id: item.id || idx + 1,
      name: item.productname || item.name || '-',
    }));

  const enrichedItems = useMemo(() => enrichItems(items), [items]);
  const filtered = useMemo(
    () =>
      enrichedItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [enrichedItems, search]
  );
  const selected = selectedRow || filtered[0] || null;

  return (
    <div className="p-4 space-y-4">
      <PageHeader title="Price List" />
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          placeholder="Search here.."
          value={search}
          onChange={e => setSearch(e.target.value)}
          startIcon={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-xs"
        />
        <span className="ml-auto text-sm text-gray-500">Total no of items : {filtered.length}</span>
      </div>
      <DataTable
        title="Items"
        columns={columns}
        data={filtered}
        selectedRow={selectedRow}
        onRowSelect={setSelectedRow}
        loading={isLoading}

      />
      
      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Card className="col-span-1">
            <div className="font-semibold mb-2">Purchase Info</div>
            <div className="text-sm">M.R.P : <span className="font-medium">₹ {selected.mrp?.toFixed(2)}</span></div>
            <div className="text-sm">Pur. Rate : <span className="font-medium">₹ {selected.purchaseRate?.toFixed(2)}</span></div>
            <div className="text-sm">Cost : <span className="font-medium">₹ {selected.cost?.toFixed(2)}</span></div>
            <div className="text-sm">Pur. Disc : <span className="font-medium">0.00</span></div>
          </Card>
          <Card className="col-span-1">
            <div className="font-semibold mb-2">Sale Info</div>
            <div className="text-sm">Rate : <span className="font-medium">{selected.saleRate?.toFixed(2)}</span></div>
            <div className="text-sm">Margin : <span className="font-medium">0.00</span></div>
            <div className="text-sm">Deal Free : <span className="font-medium">0 + 0</span></div>
            <div className="text-sm">W/o Deal : <span className="font-medium">-</span></div>
          </Card>
          <Card className="col-span-1">
            <div className="font-semibold mb-2">Tax Info</div>
            <div className="text-sm">HSN/SAC : <span className="font-medium">30490012</span></div>
            <div className="text-sm">IGST % : <span className="font-medium">12.00</span></div>
            <div className="text-sm">CGST % : <span className="font-medium">6.00</span></div>
            <div className="text-sm">SGST % : <span className="font-medium">6.00</span></div>
          </Card>
          <Card className="col-span-1">
            <div className="font-semibold mb-2">Other Info</div>
            <div className="text-sm">Company : <span className="font-medium">ABBOTT INDIA LTD</span></div>
            <div className="text-sm">Mfr. : <span className="font-medium">-</span></div>
            <div className="text-sm">Conv. : <span className="font-medium">10</span></div>
            <div className="text-sm">Salt : <span className="font-medium">-</span></div>
            <div className="text-sm">Rack No.: <span className="font-medium">-</span></div>
          </Card>
        </div>
      )}
    </div>
  );
}

