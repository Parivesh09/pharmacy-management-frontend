import React from "react";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart,
  FileText,
  TrendingUp,
  CreditCard,
  RefreshCcw,
  Calendar,
  Settings,
  ChevronDown,
  Maximize2,
  PieChart as PieChartIcon,
//   PlayListAdd,
  History,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  Cell
} from "recharts";
import Button from '../common/Button';
import Card from '../common/Card';
import IconButton from '../common/IconButton';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetPatientsQuery } from "../../services/patientApi";
import { useGetItemsQuery } from "../../services/itemApi";
import { useGetBillsQuery as useGetSalesBillsQuery } from "../../services/salesBillApi";
import { useGetBillsQuery as useGetPurchaseBillsQuery } from "../../services/purchaseBillApi";
import { useGetManufacturersQuery } from "../../services/mfrApi";
import { useGetCompaniesQuery } from "../../services/companyApi";
import { useGetPrescriptionsQuery } from "../../services/prescriptionApi";

const DashboardMain = () => {
  const { currentCompany } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { data: salesData, isLoading: salesLoading } = useGetSalesBillsQuery({ limit: 100 });
  const { data: purchaseData, isLoading: purchaseLoading } = useGetPurchaseBillsQuery({ limit: 100 });
  const { data: patientsData, isLoading: patientsLoading } = useGetPatientsQuery({ limit: 100 });
  const { data: itemsData, isLoading: itemsLoading } = useGetItemsQuery({ limit: 100 });
  const { data: mfrData, isLoading: mfrLoading } = useGetManufacturersQuery({ limit: 100 });
  const { data: companiesData, isLoading: companiesLoading } = useGetCompaniesQuery({ limit: 100 });
  const { data: prescriptionsData, isLoading: prescriptionsLoading } = useGetPrescriptionsQuery({ limit: 5 });

  const totalSale = salesData?.data?.reduce((acc, bill) => acc + (parseFloat(bill.totalAmount) || 0), 0) || 0;
  const totalPurchase = purchaseData?.data?.reduce((acc, bill) => acc + (parseFloat(bill.totalAmount) || 0), 0) || 0;
  const patientCount = patientsData?.totalCount || patientsData?.data?.length || 0;
  const itemCount = itemsData?.totalCount || itemsData?.data?.length || 0;
  const agencyCount = mfrData?.totalCount || mfrData?.data?.length || 0;
  const companyCount = companiesData?.totalCount || companiesData?.data?.length || 0;

  const miniChartData = [
    { name: '27-02 Dec', value: 0 },
    { name: '03-09 Jan', value: 0 },
    { name: '10-16 Jan', value: 0 },
    { name: '17-23 Jan', value: 0 },
    { name: '24-26 Jan', value: 0 },
  ];

  const cashFlowData = [
    { name: 'Cash', value: 0 },
    { name: 'UPI App', value: 0 },
    { name: 'Bank', value: 0 },
  ];

  const SummaryCard = ({ title, value, percentage, comparison }) => (
    <Card className="p-4 relative overflow-hidden group hover:shadow-xl transition-all duration-500 border-t-4 border-(--primary-color) bg-(--card-bg)">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-(--text-main)/60 font-black uppercase tracking-widest text-[10px]">{title}</h3>
        <div className="flex items-center gap-1">
          <span className="text-emerald-500 text-[10px] font-black">↑ {percentage}%</span>
          <IconButton icon={Maximize2} size="xs" variant="ghost" title="Expand" className="text-gray-400 hover:text-(--primary-color)" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-black italic tracking-tighter text-(--text-main)">₹ {parseFloat(value).toLocaleString()}</span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">vs ₹ {comparison}</span>
      </div>
      <div className="h-24 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={miniChartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary-color)" 
              strokeWidth={2} 
              dot={false} 
            />
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[-1.0, 1.0]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-1 text-[8px] text-gray-400 font-medium">
        <span>27-02 Dec</span>
        <span>24-26 Jan</span>
      </div>
    </Card>
  );

  const InfoCard = ({ title, children, showInValue = true }) => (
    <Card className="p-6 bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl group">
      <div className="flex justify-between items-center mb-6 border-b border-gray-50 dark:border-white/5 pb-3">
        <h3 className="text-(--primary-color) font-black italic tracking-tighter text-lg uppercase group-hover:scale-105 transition-transform origin-left">{title}</h3>
        {showInValue && <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">In Value</span>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );

  const ListItem = ({ label, value, color = "text-(--text-main)/60" }) => (
    <div className="flex justify-between items-center text-xs group/item py-1">
      <span className={`${color} font-bold uppercase tracking-tight group-hover/item:text-(--text-main) transition-colors`}>{label}</span>
      <span className="font-black text-(--text-main) bg-(--sidebar-active-bg)/30 px-2 py-0.5 rounded-lg group-hover/item:bg-(--primary-color)/10 transition-colors">
        {typeof value === 'number' ? `₹ ${value.toLocaleString()}` : value}
      </span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-(--bg-main) selection:bg-(--primary-color) selection:text-white">
      {/* Custom Header Section following the image */}
      <div className="bg-(--header-bg) text-white p-6 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <RefreshCcw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase drop-shadow-lg">Dashboard</h1>
              <div className="flex items-center gap-2 text-white/70 mt-1 font-bold">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Last Sync : {new Date().toLocaleDateString('en-GB')} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 px-3 py-1.5 gap-2 cursor-pointer hover:bg-white/20 transition-colors">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Last 30 Days</span>
                <ChevronDown className="w-4 h-4" />
             </div>
             <IconButton 
                icon={Settings} 
                variant="ghost" 
                size="sm" 
                className="text-white bg-white/10 border-white/20 hover:bg-white/20" 
                onClick={() => navigate('/settings/theme')}
              />
             <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 px-3 py-1.5 gap-2">
                <span className="text-xs text-white/80 px-1">Financial Year : </span>
                <span className="text-sm font-bold">{currentCompany?.financialYearFrom} - {currentCompany?.financialYearTo}</span>
                <ChevronDown className="w-4 h-4" />
             </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center gap-4 mt-8">
            <Button className="flex items-center gap-2 bg-white text-(--header-bg) px-6 py-2 rounded-full font-bold shadow-lg hover:bg-teal-50 transition-all uppercase text-xs tracking-wider border-none">
               Revise MRP <span className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white"><Clock className="w-3 h-3" /></span>
            </Button>
            <Button className="flex items-center gap-2 bg-white text-(--header-bg) px-6 py-2 rounded-full font-bold shadow-lg hover:bg-teal-50 transition-all uppercase text-xs tracking-wider border border-teal-200"
              style={{ color: 'var(--header-bg)' }}>
               MRP History
            </Button>
        </div>
      </div>

      <div className="p-6 -mt-4 relative z-20">
        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard title="Net Sale" value={totalSale} percentage="0.00" comparison="0.00" />
          <SummaryCard title="Net Purchase" value={totalPurchase} percentage="0.00" comparison="0.00" />
          <SummaryCard title="Gross Profit" value={totalSale - totalPurchase} percentage="0.00" comparison="0.00" />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-t-4 border-(--primary-color) bg-(--card-bg) shadow-lg rounded-3xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black italic tracking-tighter text-(--text-main) uppercase text-lg">PATIENT METRICS</h3>
                <IconButton icon={Maximize2} size="xs" variant="ghost" className="text-gray-400 hover:text-(--primary-color)" />
             </div>
             <div className="grid grid-cols-2 gap-6 bg-(--sidebar-active-bg)/30 p-4 rounded-2xl border border-gray-50 dark:border-white/5">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Census</p>
                   <p className="text-3xl font-black italic tracking-tighter text-(--text-main)">{patientCount}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Avg Ticket</p>
                   <p className="text-xl font-black italic tracking-tighter text-(--primary-color)">₹ {(totalSale / (patientCount || 1)).toFixed(2)}</p>
                </div>
             </div>
             <div className="mt-4 flex items-center justify-between">
                <div className="w-1/2 h-20 border-l border-b border-gray-100"></div>
                <div className="space-y-2 w-1/2 pl-4">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-(--primary-dark)"></span> New Patients:</span>
                      <span className="font-bold">0</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Repeat Patients:</span>
                      <span className="font-bold">0</span>
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-6 border-t-4 border-(--primary-color) bg-(--card-bg) shadow-lg rounded-3xl flex flex-col">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-black italic tracking-tighter text-(--text-main) uppercase text-lg">CASH FLOW</h3>
                <div className="flex items-center gap-1">
                   <span className="text-emerald-500 text-[10px] font-black">↑ 0.00%</span>
                   <IconButton icon={Maximize2} size="xs" variant="ghost" className="text-gray-400 hover:text-(--primary-color)" />
                </div>
             </div>
             <div className="mb-6">
                <span className="text-3xl font-black italic tracking-tighter text-(--text-main)">₹ 0.00</span>
             </div>
             <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] text-gray-400">Total Payment In</p>
                      <p className="text-sm font-bold">₹ 0.00</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400">Total Payment Out</p>
                      <p className="text-sm font-bold">₹ 0.00</p>
                   </div>
                </div>
                <div className="h-24">
                   <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={cashFlowData}>
                         <CartesianGrid vertical={false} strokeDasharray="3 3" />
                         <XAxis dataKey="name" hide />
                         <YAxis hide />
                         <Bar dataKey="value" fill="var(--primary-color)" />
                      </ReBarChart>
                   </ResponsiveContainer>
                   <div className="flex justify-between text-[8px] text-gray-400 mt-1 uppercase font-bold">
                      <span>Cash</span>
                      <span>UPI</span>
                      <span>Bank</span>
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-6 border-t-4 border-(--primary-color) bg-(--card-bg) shadow-lg rounded-3xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black italic tracking-tighter text-(--text-main) uppercase text-lg">PRESCRIPTION REMINDER</h3>
                <IconButton icon={Maximize2} size="xs" variant="ghost" className="text-gray-400 hover:text-(--primary-color)" />
             </div>
             <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar">
                {prescriptionsData?.data?.length > 0 ? (
                   prescriptionsData.data.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-(--sidebar-active-bg)/20 transition-all cursor-pointer border border-transparent hover:border-(--primary-color)/10 group">
                       <div className="w-10 h-10 rounded-2xl bg-(--sidebar-active-bg) flex items-center justify-center text-(--primary-color) font-black text-sm shadow-inner transition-transform group-hover:scale-110">
                          {p.patientName?.[0] || 'P'}
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-black text-(--text-main) uppercase tracking-tighter">{p.patientName}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{p.mobileNo}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-(--text-main)/40 font-black italic tracking-widest uppercase">Valid: {p.validUntil || 'N/A'}</p>
                       </div>
                    </div>
                   ))
                ) : (
                   <div className="h-32 flex flex-col items-center justify-center text-gray-400 italic text-[10px] uppercase font-black tracking-widest gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">!</div>
                      No Active Prescriptions
                   </div>
                )}
             </div>
             <button className="w-full text-center text-(--primary-color) text-[10px] font-black uppercase tracking-widest mt-6 hover:underline">View Entire Database »</button>
          </Card>
        </div>

        {/* Grid Sections Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-(--card-bg) border-t-4 border-(--primary-color) shadow-lg rounded-3xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black italic tracking-tighter text-(--text-main) uppercase text-lg">DUE PAYMENTS</h3>
             </div>
             <div className="flex items-center gap-2 mb-4">
                <Button className="px-3 py-1 bg-(--primary-color) text-white rounded-full text-[10px] font-bold border-none">Patients</Button>
                <Button className="px-3 py-1 bg-(--primary-color) text-white rounded-full text-[10px] font-bold border-none">Party</Button>
                <div className="ml-auto text-right">
                   <p className="text-[10px] text-gray-400">Total Due</p>
                   <p className="text-xs font-bold text-(--primary-color)">₹ 0.00</p>
                </div>
             </div>
             <div className="h-32 flex flex-col items-center justify-center text-gray-400 italic text-xs">
                No Data Available
             </div>
          </Card>

          <InfoCard title="Fund Summary">
             <ListItem label="Bank Balance" value="0.00" />
             <ListItem label="Cash Balance" value="0.00" />
             <ListItem label="Cash Deposited" value="0.00" />
             <ListItem label="Withdrawal" value="0.00" />
             <ListItem label="Cheque For Deposit" value="0.00" />
          </InfoCard>

          <InfoCard title="Outstanding">
             <ListItem label="Current Receivable" value="0.00" />
             <ListItem label="Overdue Receivable" value="0.00" />
             <ListItem label="Current Payable" value="0.00" />
             <ListItem label="Overdue Payable" value="0.00" />
          </InfoCard>
        </div>

        {/* Grid Sections Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="Business">
             <ListItem label="CGST Payable" value="0.00" />
             <ListItem label="SGST Payable" value="0.00" />
             <ListItem label="IGST Payable" value="0.00" />
          </InfoCard>

          <InfoCard title="NEW ASSETS" showInValue={false}>
             <ListItem label="Total Inventory Items" value={itemCount.toString()} />
             <ListItem label="Active Agencies" value={agencyCount.toString()} />
             <ListItem label="Registered Customers" value={patientCount.toString()} />
             <ListItem label="Sister Companies" value={companyCount.toString()} />
             <ListItem label="Wholesale Suppliers" value="0" />
          </InfoCard>

          <InfoCard title="Stock" showInValue={false}>
             <ListItem label="Expired" value="7.00" color="text-red-600 dark:text-red-400" />
             <ListItem label="Near Expired" value="1.00" color="text-orange-600 dark:text-orange-400" />
             <ListItem label="Reorder" value="0.00" />
             <ListItem label="Dump Stock" value="134.00" />
             <ListItem label="Minimum Stock" value="3.00" />
          </InfoCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
           <InfoCard title="Pending" showInValue={false}>
             <ListItem label="Sales Challan" value="0.00" />
             <ListItem label="Sales Order" value="0.00" />
             <ListItem label="Purchase Order" value="0.00" />
             <ListItem label="Purchase Challan" value="0.00" />
          </InfoCard>
        </div>
      </div>
      
      <div className="p-8 text-center border-t border-gray-50 dark:border-white/5 mt-12 bg-(--sidebar-active-bg)/10">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Data Migration Instance Key <span className="text-(--primary-color) underline cursor-pointer ml-2 hover:text-(--secondary-color) transition-colors">Click to Copy Key</span></p>
      </div>
    </div>
  );
};

export default DashboardMain;
