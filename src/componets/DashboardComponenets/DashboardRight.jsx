import React from "react";
import { Keyboard } from "lucide-react";

const DashboardRight = () => {
  const shortcutKeys = [
    { label: "SALE BILL", key: "Alt + N" },
    { label: "SALE BILL LIST", key: "Alt + M" },
    { label: "PURCHASE BILL", key: "Alt + P" },
    { label: "ITEM LIST", key: "Alt + I" },
    { label: "LEDGER LIST", key: "Alt + L" },
    { label: "PARTY WISE OUTSTANDING", key: "Alt + O" },
    { label: "RE-ORDER", key: "Ctrl + F1" },
    { label: "RECEIPT", key: "Alt + R" },
    { label: "PAYMENT", key: "Ctrl + F2" },
    { label: "CASH A/C AND BANK A/C", key: "Alt + B" },
    { label: "SALE BILL CHALLAN", key: "Alt + C" },
    { label: "STOCK ISSUE", key: "Alt + K" },
    { label: "STOCK RECEIVE", key: "Alt + U" },
    { label: "BREAKAGE/EXP RECEIVE", key: "Alt + X" },
    { label: "COUNTER SALE", key: "Alt + A" },
    { label: "HOME/DASHBOARD", key: "Alt + H" },
    { label: "SETTINGS", key: "Ctrl + I" },
  ];

  return (
    <div className="hidden border-l border-gray-200 bg-[#f8fafc] xl:block w-72 flex-shrink-0 relative overflow-hidden h-full shadow-inner">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-center gap-3 mb-6 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <Keyboard className="w-5 h-5 text-(--primary-color)" />
          <span className="font-bold text-gray-700 tracking-wide uppercase text-sm">Shortcut Keys</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-6">
          {shortcutKeys.map((item, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-(--primary-color) hover:shadow-md transition-all group flex flex-col items-center justify-center text-center cursor-default"
            >
              <div className="text-[10px] font-bold text-gray-800 tracking-wider mb-1 group-hover:text-black">
                {item.label}
              </div>
              <div className="text-(--primary-color) font-extrabold text-sm font-sans tracking-tight opacity-90 group-hover:opacity-100">
                {item.key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardRight;
