import React from "react";
import { Trash2, Plus } from "lucide-react";
import Button from "../../../../componets/common/Button";
import Input from "../../../../componets/common/Input";

const SaleItemsTableSection = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onSelectItem,
  onSelectBatch,
  formatCurrency,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-(--text-main) tracking-tight flex items-center gap-2">
        <span className="w-2 h-6 bg-(--primary-color) rounded-full"></span>
        Products
      </h2>
      <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-2xl bg-(--card-bg) shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-(--sidebar-active-bg) border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-4 text-left font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Product
              </th>
              <th className="px-4 py-4 text-left font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Packing
              </th>
              <th className="px-4 py-4 text-left font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Batch
              </th>
              <th className="px-4 py-4 text-left font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Exp. Date
              </th>
              <th className="px-4 py-4 text-center font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Stock
              </th>
              <th className="px-4 py-4 text-center font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Unit-2
              </th>
              <th className="px-4 py-4 text-center font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Unit-1
              </th>
              <th className="px-4 py-4 text-right font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Rate
              </th>
              <th className="px-4 py-4 text-center font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Qty
              </th>
              <th className="px-4 py-4 text-center font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Disc %
              </th>
              <th className="px-4 py-4 text-right font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Amount
              </th>
              <th className="px-4 py-4 text-center font-bold text-(--text-main) opacity-70 uppercase text-[10px] tracking-widest">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-(--sidebar-active-bg) transition-colors group"
              >
                <td className="px-3 py-3">
                  <Input
                    type="text"
                    value={item.product}
                    onFocus={() => onSelectItem(idx)}
                    readOnly
                    placeholder="Search Product..."
                    className="bg-transparent cursor-pointer text-xs font-bold"
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="text"
                    value={item.packing}
                    onChange={(e) =>
                      onItemChange(idx, "packing", e.target.value)
                    }
                    className="text-xs bg-transparent"
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="text"
                    value={item.batch}
                    onFocus={() => onSelectBatch && onSelectBatch(idx, item.itemId)}
                    onChange={(e) =>
                      onItemChange(idx, "batch", e.target.value)
                    }
                    className={`text-xs cursor-pointer bg-transparent ${item.batchId ? 'text-(--primary-color) font-black' : ''}`}
                    readOnly={!!item.batchId}
                    placeholder={item.batchId ? "Selected" : "Select Batch"}
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="date"
                    value={item.expDate}
                    onChange={(e) =>
                      onItemChange(idx, "expDate", e.target.value)
                    }
                    className="text-xs bg-transparent"
                    readOnly={!!item.batchId}
                  />
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    (item.availableStock || 0) > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-500"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-500"
                  }`}>
                    {item.availableStock || 0}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="text"
                    value={item.unit2}
                    onChange={(e) =>
                      onItemChange(idx, "unit2", e.target.value)
                    }
                    className="text-xs text-center bg-transparent"
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="text"
                    value={item.unit1}
                    onChange={(e) =>
                      onItemChange(idx, "unit1", e.target.value)
                    }
                    className="text-xs text-center bg-transparent"
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      onItemChange(idx, "rate", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs text-right bg-transparent font-mono"
                    step="0.01"
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseFloat(e.target.value) || 1;
                      onItemChange(idx, "quantity", newQuantity);
                    }}
                    className={`text-xs text-center bg-transparent font-black ${
                      (item.quantity || 0) > (item.batchQuantity || item.availableStock || 0) && 
                      (item.batchQuantity || item.availableStock || 0) > 0
                        ? "text-red-500 !border-red-500"
                        : ""
                    }`}
                    step="1"
                    max={item.batchQuantity || item.availableStock || undefined}
                  />
                </td>
                <td className="px-3 py-3">
                  <Input
                    type="number"
                    value={item.discountPercent}
                    onChange={(e) =>
                      onItemChange(idx, "discountPercent", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs text-center bg-transparent font-bold text-orange-600"
                    step="0.01"
                  />
                </td>
                <td className="px-3 py-3 text-right font-black text-xs text-(--text-main)">
                  ₹{formatCurrency(item.amount || 0)}
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAddItem}
        className="mt-2 text-(--primary-color) hover:text-(--primary-dark) font-bold text-sm flex items-center gap-2 group transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-(--sidebar-active-bg) flex items-center justify-center group-hover:bg-(--primary-color) group-hover:text-white transition-all">
          <Plus size={16} />
        </div>
        Add Another Product
      </button>
    </div>
  );
};

export default SaleItemsTableSection;
