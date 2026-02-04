import React from "react";
import { Trash2, Plus } from "lucide-react";
import Button from "../../../../componets/common/Button";
import Input from "../../../../componets/common/Input";
import toast from "react-hot-toast";

const ItemsTableSection = ({
  items,
  calculations,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onSelectItem,
  onSelectBatch,
  formatCurrency,
}) => {
  const handleProductClick = (idx) => {
    onSelectItem(idx);
  };

  const handleBatchClick = (idx, itemId) => {
    if (itemId) {
      onSelectBatch(idx, itemId);
    } else {
      toast.error("Please select an item first");
    }
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black italic tracking-tighter text-(--text-main) uppercase">Line Items</h2>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Commitment</div>
      </div>
      <div className="overflow-x-auto border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm bg-(--sidebar-active-bg)/10">
        <table className="w-full text-xs">
          <thead className="bg-(--bg-main) border-b border-gray-50 dark:border-white/5">
            <tr>
              <th className="px-4 py-5 text-left font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Product Inventory
              </th>
              <th className="px-4 py-5 text-left font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Packing
              </th>
              <th className="px-4 py-5 text-left font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Batch #
              </th>
              <th className="px-4 py-5 text-left font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Expiry
              </th>
              <th className="px-4 py-5 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Cost Rate
              </th>
              <th className="px-4 py-5 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Qty
              </th>
              <th className="px-4 py-5 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Disc %
              </th>
              <th className="px-4 py-5 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Net Amount
              </th>
              <th className="px-4 py-5 text-center font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Ops
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {items.length > 0 ? items.map((item, idx) => (
              <tr key={idx} className="hover:bg-(--sidebar-active-bg)/30 transition-colors group">
                <td className="px-4 py-4 min-w-[200px]">
                  <Input
                    type="text"
                    value={item.product || ""}
                    onFocus={() => handleProductClick(idx)}
                    readOnly
                    placeholder="LOCATE_PRODUCT"
                    className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) cursor-pointer font-black text-(--primary-color) uppercase tracking-tighter rounded-xl transition-all"
                  />
                </td>
                <td className="px-4 py-4 w-24">
                  <Input
                    type="text"
                    value={item.packing}
                    onChange={(e) =>
                      onItemChange(idx, "packing", e.target.value)
                    }
                    className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) font-bold text-center rounded-xl transition-all"
                  />
                </td>
                <td className="px-4 py-4 min-w-[150px]">
                  <Input
                    type="text"
                    value={item.batch}
                    onFocus={() => handleBatchClick(idx, item.itemId)}
                    readOnly
                    placeholder="SEL_BATCH"
                    className="bg-(--sidebar-active-bg)/30 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) cursor-pointer font-mono font-bold text-[10px] rounded-xl transition-all"
                  />
                </td>
                <td className="px-4 py-4">
                  <Input
                    type="date"
                    value={item.expDate}
                    onChange={(e) =>
                      onItemChange(idx, "expDate", e.target.value)
                    }
                    className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) font-bold text-xs rounded-xl transition-all"
                  />
                </td>
                <td className="px-4 py-4 w-28">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      onItemChange(idx, "rate", parseFloat(e.target.value) || 0)
                    }
                    className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) font-black text-right text-(--primary-color) rounded-xl transition-all"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-4 w-24">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onItemChange(idx, "quantity", parseFloat(e.target.value) || 1)
                    }
                    className="bg-(--sidebar-active-bg)/50 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) font-black text-center h-10 rounded-xl transition-all"
                    step="1"
                  />
                </td>
                <td className="px-4 py-4 w-20">
                  <Input
                    type="number"
                    value={item.discountPercent}
                    onChange={(e) =>
                      onItemChange(idx, "discountPercent", parseFloat(e.target.value) || 0)
                    }
                    className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) font-bold text-center text-emerald-500 rounded-xl transition-all"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-4 text-right font-black italic text-(--text-main) text-sm tracking-tighter">
                  ₹{formatCurrency(calculations.items?.[idx]?.amount || 0)}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="py-20 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-30">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
                         <Plus size={32} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">No Line Items Defined</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          onClick={onAddItem}
          variant="outline"
          className="bg-transparent border-dashed border-2 border-gray-200 dark:border-white/10 hover:border-(--primary-color) text-(--primary-color) flex items-center gap-2 px-8 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px]"
        >
          <Plus size={16} /> Add Inventory Line
        </Button>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Sub-transactions: {items.length}</p>
      </div>
    </div>
  );
};

export default ItemsTableSection;
