import {
  Home,
  Book,
  Package,
  TrendingUp,
  ShoppingCart,
  BookMinus,
  DollarSign,
  Percent,
  Users,
  FileText,
  Layers,
  Briefcase,
  Settings,
  Globe,
  CreditCard,
  BarChart,
  Clipboard,
  File,
  File as FileIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Clipboard as ClipboardIcon,
} from "lucide-react";

const adminMenu = [
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  {
    title: "Master",
    icon: Book,
    children: [
      {
        title: "Accounts Master",
        icon: BookMinus,
        children: [
          { title: "Ledger", path: "/master/account/ledger" },
          { title: "Group", path: "/master/accounts/group" },
          { title: "Sale", path: "/master/accounts/sale" },
          { title: "Purchase", path: "/master/accounts/purchase" },
        ],
      },
      {
        title: "Inventory Master",
        icon: Package,
        children: [
          { title: "Item", path: "/master/inventory/items" },
          { title: "Store", path: "/master/inventory/stores" },
          { title: "Rack", path: "/master/inventory/racks" },
          { title: "Company", path: "/master/inventory/companies" },
          { title: "Salt", path: "/master/inventory/salts" },
          { title: "HSN/SAC", path: "/master/inventory/sacs" },
          { title: "Unit", path: "/master/inventory/units" },
          { title: "Manufacturer", path: "/master/inventory/manufacturers" },
        ],
      },
      {
        title: "Rate Master",
        icon: DollarSign,
        children: [{ title: "Price List", path: "/master/rates/pricelist" }],
      },
      {
        title: "Discount Master",
        icon: Percent,
        children: [
          { title: "Agency General Discount", path: "/discount/agency" },
          { title: "Item wise Discount", path: "/discount/itemwise" },
        ],
      },
      {
        title: "Other Master",
        icon: Users,
        children: [
          { title: "Patient", path: "/master/other/patient" },
          { title: "Prescription", path: "/master/other/prescription" },
          { title: "Station", path: "/master/other/station" },
        ],
      },
      {
        title: "Opening Balance",
        icon: FileText,
        children: [
          { title: "Ledger", path: "/opening/ledger" },
          { title: "Stock", path: "/opening/stock" },
        ],
      },
      { title: "TDS", icon: Layers, path: "/tds" },
      {
        title: "Currency",
        icon: Globe,
        children: [
          { title: "Multi Currency", path: "/currency/multicurrency" },
          { title: "Exchange Rate", path: "/currency/exchangerate" },
        ],
      },
    ],
  },
  {
    title: "Sale",
    icon: TrendingUp,
    children: [
      { title: "POS", path: "/sales/pos" },
      { title: "Bill", path: "/sales/bill" },
      { title: "Quotation", path: "/sales/quotation" },
      { title: "Counter Sale", path: "/sales/countersale" },
      { title: "Stock Issue", path: "/sales/stockissue" },
      { title: "Order", path: "/sales/orders" },
    ],
  },
  {
    title: "Purchase",
    icon: ShoppingCart,
    children: [
      { title: "Bill", path: "/purchase/bill" },
      { title: "Stock Receive", path: "/purchase/stockreceive" },
      { title: "Order", path: "/purchase/order" },
      { title: "Return", path: "/purchase/return" },
      { title: "Brk/Exp Issue", path: "/purchase/brkexp" },
      { title: "Challan", path: "/purchase/challan" },
    ],
  },
  {
    title: "Accounting Trans.",
    icon: Briefcase,
    children: [
      { title: "Receipt", path: "/accounting/receipt" },
      { title: "Payment", path: "/accounting/payment" },
      { title: "Debit Note", path: "/accounting/debitnote" },
      { title: "Credit Note", path: "/accounting/creditnote" },
      { title: "Contra", path: "/accounting/contra" },
      { title: "Journal", path: "/accounting/journal" },
      { title: "Bank Reconciliation", path: "/accounting/bankreconciliation" },
    ],
  },
  {
    title: "Stock Management",
    icon: Settings,
    children: [
      { title: "Stock Transfer", path: "/stock/transfer" },
      { title: "Physical Stock", path: "/stock/physical" },
    ],
  },
  {
    title: "Daily Cashbook",
    icon: Clipboard,
    children: [
      { title: "Open/Close Cashday", path: "/cashbook/openclose" },
      { title: "Cash Deposits", path: "/cashbook/deposits" },
      { title: "Manage Approvals", path: "/cashbook/approvals" },
      { title: "Cash Transfer", path: "/cashbook/transfer" },
    ],
  },
  {
    title: "Banking",
    icon: CreditCard,
    children: [
      { title: "Online Payment", path: "/banking/onlinepayment" },
      { title: "Online Statement", path: "/banking/onlinestatement" },
      { title: "Cheque Management", path: "/banking/chequemanagement" },
    ],
  },
  { title: "Report", icon: BarChart, path: "/report" },
  { title: "Other Products", icon: FileIcon, path: "/otherproducts" },
  { title: "Utilities & Tools", icon: SettingsIcon, path: "/utilities" },
  { title: "Online Store", icon: GlobeIcon, path: "/onlinestore" },
  {
    title: "CRM",
    icon: Users,
    children: [
      { title: "Home Delivery", path: "/crm/homedelivery" },
      { title: "Prescription Reminder", path: "/crm/prescriptionreminder" },
    ],
  },
];

export const menuConfig = {
  admin: adminMenu,
  user: [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    ...adminMenu.slice(1),
  ],
  manager: [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    ...adminMenu.slice(1),
  ],
};
