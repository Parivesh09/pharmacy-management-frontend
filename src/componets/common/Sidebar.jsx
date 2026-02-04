import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  HelpCircle,
  LogOut,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuConfig } from "../../data/menuData";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../services/userSlice";
import Input from "./Input";
import Logo from "./Logo";
import { hasPermission } from "../../data/permissions";

const pathToPermission = {
  "/dashboard": "dashboard",
  "/master/account/ledger": "accounting_ledgers",
  "/master/account/ledger/create": "accounting_ledgers",
  "/master/account/ledger/edit": "accounting_ledgers",
  "/master/account/transaction": "accounting_transactions",
  "/master/account/transaction/create": "accounting_transactions",
  "/master/account/transaction/edit": "accounting_transactions",
  "/master/accounts/group": "accounting_groups",
  "/master/accounts/sale": "gst_billing",
  "/master/accounts/purchase": "purchase_orders",
  "/master/inventory/items": "inventory",
  "/master/inventory/stores": "inventory",
  "/master/inventory/units": "inventory",
  "/master/inventory/racks": "inventory",
  "/master/inventory/companies": "inventory",
  "/master/inventory/salts": "inventory",
  "/master/inventory/sacs": "inventory",
  "/master/inventory/manufacturers": "inventory",
  "/sales/orders": "gst_billing",
  "/sales/pos": "gst_billing",
  "/sales/bill": "gst_billing",
  "/sales/quotation": "gst_billing",
  "/sales/countersale": "gst_billing",
  "/sales/stockissue": "inventory",
  "/purchase/order": "purchase_orders",
  "/purchase/bill": "gst_billing",
  "/purchase/stockreceive": "inventory",
  "/purchase/return": "return_expiry",
  "/purchase/brkexp": "return_expiry",
  "/master/rates/pricelist": "inventory",
  "/discount/agency": "gst_billing",
  "/discount/itemwise": "gst_billing",
  "/master/other/patient": "other",
  "/master/other/prescription": "other",
  "/master/other/station": "other",
  "/opening/ledger": "inventory",
  "/opening/stock": "inventory",
  "/tds": "financial_reports",
  "/currency/multicurrency": "inventory",
  "/currency/exchangerate": "inventory",
};

function filterMenuByPermission(items, role) {
  return items
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterMenuByPermission(item.children, role);
        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }
      if (item.path) {
        const permKey = pathToPermission[item.path] || "dashboard";
        if (hasPermission(role, permKey, "V")) {
          return item;
        }
        return null;
      }
      return item;
    })
    .filter(Boolean);
}

const useIsLargeScreen = () => {
  const [isLarge, setIsLarge] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isLarge;
};

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const [expandedItems, setExpandedItems] = useState(["Dashboard"]);
  const [isHovered, setIsHovered] = useState(false);
  const isLargeScreen = useIsLargeScreen();
  const isSidebarExpanded =
    (!isLargeScreen && mobileOpen) ||
    (isLargeScreen && (!isCollapsed || isHovered));
  const user = useSelector((state) => state.user.user);
  console.log('Current user role:', user?.role);
  const dispatch = useDispatch();
  const logout = () => dispatch(logoutAction());
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = filterMenuByPermission(
    menuConfig[user?.role] || [],
    user?.role
  );

  const toggleExpanded = (title, level = 0, parentTitles = []) => {
    setExpandedItems((prev) => {
      if (prev.includes(title)) {
        return prev.filter((item) => item !== title);
      }
      return [...parentTitles, title];
    });
  };

  const handleItemClick = (title, path) => {
    if (path) {
      navigate(path, { state: { title } });
    }
  };

  const isItemActive = (item) => {
    if (item.path === location.pathname) return true;
    if (item.children) {
      return item.children.some((child) => isItemActive(child));
    }
    return false;
  };

  const renderMenuItem = (item, level = 0, parentTitles = []) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const isActive = isItemActive(item);
    const isDirectActive = location.pathname === item.path;

    const indentClass =
      level === 0 ? "" : level === 1 ? "ml-4" : level === 2 ? "ml-8" : "ml-12";

    return (
      <div key={`${item.title}-${level}`} className="mb-1">
        <div
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${indentClass} ${
            isDirectActive
              ? "bg-(--sidebar-active-bg) text-(--primary-color) border-r-2 border-(--primary-color)"
              : isActive && !isDirectActive
              ? "bg-(--sidebar-active-bg) text-(--primary-color) opacity-80"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          onClick={() => {
            if (hasChildren && isSidebarExpanded) {
              toggleExpanded(item.title, level, parentTitles);
            } else if (item.path) {
              handleItemClick(item.title, item.path);
            }
          }}
        >
          <div className="flex items-center gap-3">
            {Icon && level === 0 && (
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isDirectActive
                    ? "text-(--primary-color)"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              />
            )}

            {level > 0 && !Icon && (
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isDirectActive ? "bg-(--primary-color)" : "bg-gray-300"
                }`}
              ></div>
            )}

            {Icon && level > 0 && (
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isDirectActive
                    ? "text-(--primary-color)"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              />
            )}

            {isSidebarExpanded && (
              <span className={`font-medium transition-colors text-sm`}>
                {item.title}
              </span>
            )}
          </div>

          {isSidebarExpanded && hasChildren && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarExpanded && isExpanded
              ? "h-auto opacity-100 mt-1"
              : "h-0 opacity-0"
          }`}
        >
          {isSidebarExpanded && isExpanded && (
            <div className="space-y-1 pl-2">
              {item?.children?.map((child) =>
                renderMenuItem(child, level + 1, [...parentTitles, item.title])
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 left-0 h-full z-60 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 lg:static lg:z-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isLargeScreen ? (isCollapsed ? "w-16 hover:w-64" : "w-64") : "w-64"
        } overflow-x-hidden`}
        style={{ maxWidth: "100vw" }}
        onMouseEnter={() => isLargeScreen && isCollapsed && setIsHovered(true)}
        onMouseLeave={() => isLargeScreen && isCollapsed && setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 p-4 border-b border-gray-200">
            <Logo className="w-8 h-8 !bg-(--primary-color)" textClassName="text-white" />
            {isSidebarExpanded && (
              <span className="font-bold text-gray-800 text-lg">
                ASR Pharmacy
              </span>
            )}
            <button
              className="lg:hidden ml-auto p-2 rounded hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          {isSidebarExpanded && (
            <div className="px-4 py-2">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg">
                <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
            </div>
          )}
          {isSidebarExpanded && (
            <div className="p-4">
              <div className="relative">
                <Input
                  label="Search"
                  type="text"
                  startIcon={<Search className="w-4 h-4 text-gray-400" />}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <nav className="flex-1 px-2 pt-2 pb-10 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => renderMenuItem(item))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
