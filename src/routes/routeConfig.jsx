import React from "react";
import HierarchicalGroupManager from "../pages/masters/account/group/HierarchicalGroupManager";
import Group from "../pages/masters/account/group/Group";
import Station from "../pages/masters/other/station/Station";

const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const GenericPage = React.lazy(() => import("../pages/GenericPage"));
const CompanyList = React.lazy(() => import("../pages/other/CompanyList")); 
const ItemsPage = React.lazy(() =>
  import("../pages/masters/inventory/Item/Item")
);
const ItemDetails = React.lazy(() =>
  import("../pages/masters/inventory/Item/ItemDetails")
);
const StorePage = React.lazy(() =>
  import("../pages/masters/inventory/store/Store")
);
const RackPage = React.lazy(() =>
  import("../pages/masters/inventory/rack/Rack")
);
const Company = React.lazy(() =>
  import("../pages/masters/inventory/company/Company")
);
const SaltPage = React.lazy(() =>
  import("../pages/masters/inventory/salt/Salt")
);
const UnitPage = React.lazy(() =>
  import("../pages/masters/inventory/unit/Unit")
);
const HSNPage = React.lazy(() => import("../pages/masters/inventory/hsn/HSN"));
const MFRPage = React.lazy(() =>
  import("../pages/masters/inventory/menufcurer/MFR")
);
const Price = React.lazy(() => import("../pages/masters/rate/Price"));
const Viewledger = React.lazy(() =>
  import("../pages/masters/account/Ledger/Viewledger")
);
const CreateLedger = React.lazy(() =>
  import("../pages/masters/account/Ledger/CreateLedger")
);
const LedgerDetails = React.lazy(() =>
  import("../pages/masters/account/Ledger/LedgerDetails")
);
const TransactionList = React.lazy(() =>
  import("../pages/masters/account/Transaction/TransactionList")
);
const CreateTransaction = React.lazy(() =>
  import("../pages/masters/account/Transaction/CreateTransaction")
);
const CreateCompanyPage = React.lazy(() =>
  import("../pages/masters/inventory/company/CreateCompanyPage")
);
const CreateItemPage = React.lazy(() =>
  import("../pages/masters/inventory/Item/CreateItemPage")
);
const CreateSaltPage = React.lazy(() =>
  import("../pages/masters/inventory/salt/AddSalt")
);
const CompanyForm = React.lazy(() =>
  import("../pages/masters/inventory/company/CreateCompanyPage")
);
const ItemForm = React.lazy(() =>
  import("../pages/masters/inventory/Item/CreateItemPage")
);
const SaltForm = React.lazy(() =>
  import("../pages/masters/inventory/salt/AddSalt")
);
const CreateManufacturerPage = React.lazy(() =>
  import("../pages/masters/inventory/menufcurer/AddMFR")
);
const Patient = React.lazy(() =>
  import("../pages/masters/other/patient/Patient")
);
const AddPatient = React.lazy(() =>
  import("../pages/masters/other/patient/AddPatient")
);
const PatientForm = React.lazy(() =>
  import("../pages/masters/other/patient/AddPatient")
);
const PrescriptionList = React.lazy(() =>
  import("../pages/masters/other/prescription/Prescription")
);
const CreatePrescriptionPage = React.lazy(() =>
  import("../pages/masters/other/prescription/CreatePrescriptionPage")
);
const BillList = React.lazy(() => import("../pages/sales/Bill/BillList"));
const BillForm = React.lazy(() => import("../pages/sales/Bill/BillForm"));
const SaleMaster = React.lazy(() =>
  import("../pages/masters/account/SaleMaster/SaleMaster")
);
const CreateSaleMaster = React.lazy(() =>
  import("../pages/masters/account/SaleMaster/CreateSaleMaster")
);
const PurchaseMaster = React.lazy(() =>
  import("../pages/masters/account/PurchaseMaster/PurchaseMaster")
);
const CreatePurchaseMaster = React.lazy(() =>
  import("../pages/masters/account/PurchaseMaster/CreatePurchaseMaster")
);

const OpeningBalanceLedger = React.lazy(() =>
  import("../pages/masters/openingBalance/ledger/Ledger")
);
const OpeningBalanceStock = React.lazy(() =>
  import("../pages/masters/openingBalance/stock/Stock")
);
const StockManagement = React.lazy(() =>
  import("../pages/stock/StockManagement")
);
const Bill = React.lazy(() =>
  import("../pages/sales/Bill/BillList")
);
const PurchaseBill = React.lazy(() =>
  import("../pages/purchase/Bill/Bill")
);
const PurchaseBillList = React.lazy(() =>
  import("../pages/purchase/Bill/Bill")
);
const PurchaseBillForm = React.lazy(() =>
  import("../pages/purchase/Bill/PurchaseBillForm")
);
const LedgerReport = React.lazy(() =>
  import("../pages/masters/openingBalance/LedgerReport")
);
const TrialBalanceReport = React.lazy(() =>
  import("../pages/masters/openingBalance/TrialBalanceReport")
);
const ProfitLossReport = React.lazy(() =>
  import("../pages/masters/openingBalance/ProfitLossReport")
);
const StockReport = React.lazy(() =>
  import("../pages/masters/openingBalance/StockReport")
);
const POSPage = React.lazy(() => import("../pages/sales/POS/POSPage"));

export const routeConfig = [
  {
    path: "/dashboard",
    module: "dashboard",
    action: "V",
    element: <Dashboard />,
  },
  {
    path: "/master/account/ledger",
    module: "accounting_ledgers",
    action: "V",
    element: <Viewledger />,
  },
  {
    path: "/master/account/ledger/add",
    module: "accounting_ledgers",
    action: "C",
    element: <CreateLedger />,
  },
  {
    path: "/master/account/ledger/edit/:id",
    module: "accounting_ledgers",
    action: "E",
    element: <CreateLedger />,
  },
  {
    path: "/master/account/ledger/details/:id",
    module: "accounting_ledgers",
    action: "V",
    element: <LedgerDetails />,
  },
  {
    path: "/master/account/transaction",
    module: "accounting_transactions",
    action: "V",
    element: <TransactionList />,
  },
  {
    path: "/master/account/transaction/create",
    module: "accounting_transactions",
    action: "C",
    element: <CreateTransaction />,
  },
  {
    path: "/master/account/transaction/edit/:id",
    module: "accounting_transactions",
    action: "E",
    element: <CreateTransaction />,
  },
  {
    path: "/master/accounts/group",
    module: "accounting_groups",
    action: "V",
    element: <Group />,
  },
  {
    path: "/master/accounts/group/hierarchical",
    module: "accounting_groups",
    action: "V",
    element: <HierarchicalGroupManager />,
  },
  {
    path: "/master/accounts/sale",
    module: "gst_billing",
    action: "V",
    element: <SaleMaster />,
  },
  {
    path: "/master/accounts/sale/create",
    module: "gst_billing",
    action: "C",
    element: <CreateSaleMaster />,
  },
  {
    path: "/master/accounts/sale/edit/:id",
    module: "gst_billing",
    action: "E",
    element: <CreateSaleMaster />,
  },
  {
    path: "/master/accounts/purchase",
    module: "purchase_masters",
    action: "V",
    element: <PurchaseMaster />,
  },
  {
    path: "/master/accounts/purchase/create",
    module: "purchase_masters",
    action: "C",
    element: <CreatePurchaseMaster />,
  },
  {
    path: "/master/accounts/purchase/edit/:id",
    module: "purchase_masters",
    action: "E",
    element: <CreatePurchaseMaster />,
  },

  {
    path: "/master/inventory/items",
    module: "inventory",
    action: "V",
    element: <ItemsPage />,
  },
  {
    path: "/master/inventory/items/:id",
    module: "inventory",
    action: "V",
    element: <ItemDetails />,
  },
  {
    path: "/master/inventory/items/create",
    module: "inventory",
    action: "C",
    element: <CreateItemPage />,
  },
  {
    path: "/master/inventory/items/edit/:id",
    module: "inventory",
    action: "E",
    element: <ItemForm isEditMode={true} />,
  },

  {
    path: "/master/inventory/stores",
    module: "inventory",
    action: "V",
    element: <StorePage />,
  },
  {
    path: "/master/inventory/units",
    module: "inventory",
    action: "V",
    element: <UnitPage />,
  },
  {
    path: "/master/inventory/racks",
    module: "inventory",
    action: "V",
    element: <RackPage />,
  },
  {
    path: "/master/inventory/companies",
    module: "inventory",
    action: "V",
    element: <Company />,
  },
  {
    path: "/master/inventory/company/create",
    module: "inventory",
    action: "C",
    element: <CreateCompanyPage />,
  },
  {
    path: "/master/inventory/companies/edit/:id",
    module: "inventory",
    action: "E",
    element: <CompanyForm isEditMode={true} />,
  },

  {
    path: "/master/inventory/salts",
    module: "inventory",
    action: "V",
    element: <SaltPage />,
  },
  {
    path: "/master/inventory/salt/create",
    module: "inventory",
    action: "C",
    element: <CreateSaltPage />,
  },
  {
    path: "/master/inventory/salt/edit/:id",
    module: "inventory",
    action: "E",
    element: <SaltForm isEditMode={true} />,
  },

  {
    path: "/master/inventory/sacs",
    module: "inventory",
    action: "V",
    element: <HSNPage />,
  },
  {
    path: "/master/inventory/manufacturers",
    module: "inventory",
    action: "V",
    element: <MFRPage />,
  },
  {
    path: "/master/inventory/manufacturers/create",
    module: "inventory",
    action: "C",
    element: <CreateManufacturerPage />,
  },
  {
    path: "/master/rates/pricelist",
    module: "rate_master",
    action: "V",
    element: <Price />,
  },

  {
    path: "/master/inventory/:type",
    module: "inventory",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/sales/bill",
    module: "gst_billing",
    action: "V",
    element: <BillList />,
  },
  {
    path: "/sales/pos",
    module: "gst_billing",
    action: "C",
    element: <POSPage />,
  },
  {
    path: "/sales/bill/create",
    module: "gst_billing",
    action: "C",
    element: <BillForm />,
  },
  {
    path: "/sales/bill/edit/:id",
    module: "gst_billing",
    action: "E",
    element: <BillForm />,
  },
  {
    path: "/purchase/bill",
    module: "purchase_orders",
    action: "V",
    element: <PurchaseBillList />,
  },
  {
    path: "/purchase/bill/create",
    module: "purchase_orders",
    action: "C",
    element: <PurchaseBillForm />,
  },
  {
    path: "/purchase/bill/edit/:id",
    module: "purchase_orders",
    action: "E",
    element: <PurchaseBillForm />,
  },
  {
    path: "/purchase/:type",
    module: "purchase_orders",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/master/other/patient",
    module: "other",
    action: "V",
    element: <Patient />,
  },
  {
    path: "/master/other/patient/create",
    module: "other",
    action: "C",
    element: <AddPatient />,
  },
  {
    path: "/master/other/patient/edit/:id",
    module: "other",
    action: "E",
    element: <PatientForm isEditMode={true} />,
  },
  {
    path: "/master/other/prescription",
    module: "other",
    action: "V",
    element: <PrescriptionList />,
  },
  {
    path: "/masters/other/prescription/create",
    module: "other",
    action: "C",
    element: <CreatePrescriptionPage />,
  },
  {
    path: "/master/other/station",
    module: "other",
    action: "V",
    element: <Station />,
  },
  {
    path: "/master/opening-balance/ledger",
    module: "accounting_ledgers",
    action: "V",
    element: <OpeningBalanceLedger />,
  },
  {
    path: "/master/opening-balance/stock",
    module: "inventory",
    action: "V",
    element: <OpeningBalanceStock />,
  },
  {
    path: "/stock/management",
    module: "inventory",
    action: "V",
    element: <StockManagement />,
  },
  {
    path: "/sales/bill/enhanced",
    module: "gst_billing",
    action: "V",
    element: <Bill />,
  },
  {
    path: "/purchase/bill/enhanced",
    module: "purchase_masters",
    action: "V",
    element: <PurchaseBill />,
  },
  {
    path: "/opening/ledger",
    module: "financial_reports",
    action: "V",
    element: <LedgerReport />,
  },
  {
    path: "/opening/trial-balance",
    module: "financial_reports",
    action: "V",
    element: <TrialBalanceReport />,
  },
  {
    path: "/opening/profit-loss",
    module: "financial_reports",
    action: "V",
    element: <ProfitLossReport />,
  },
  {
    path: "/opening/stock",
    module: "inventory",
    action: "V",
    element: <StockReport />,
  },
  {
    path: "/opening/:type",
    module: "inventory",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/accounting/:type",
    module: "financial_reports",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/stock/:type",
    module: "inventory",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/cashbook/:type",
    module: "financial_reports",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/banking/:type",
    module: "financial_reports",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/discount/:type",
    module: "gst_billing",
    action: "V",
    element: <GenericPage />,
  },
  {
    path: "/crm/:type",
    module: "inventory",
    action: "V",
    element: <GenericPage />,
  },

  {
    path: "/report",
    module: "dashboard",
    action: "V",
    element: <GenericPage title="Report" />,
  },
  {
    path: "/otherproducts",
    module: "inventory",
    action: "V",
    element: <GenericPage title="Other Products" />,
  },
  {
    path: "/utilities",
    module: "settings",
    action: "V",
    element: <GenericPage title="Utilities & Tools" />,
  },
  {
    path: "/onlinestore",
    module: "inventory",
    action: "V",
    element: <GenericPage title="Online Store" />,
  },
];

export default routeConfig;
