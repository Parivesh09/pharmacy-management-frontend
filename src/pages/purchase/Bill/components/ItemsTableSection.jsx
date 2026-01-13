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
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Products</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-green-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                Product
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                Packing
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                Batch
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                Exp. Date
              </th>
              <th className="px-3 py-3 text-right font-semibold text-gray-700">
                Rate
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">
                Qty
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">
                Disc %
              </th>
              <th className="px-3 py-3 text-right font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-green-50">
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    value={item.product || ""}
                    onFocus={() => handleProductClick(idx)}
                    readOnly
                    placeholder="Click to select"
                    className="bg-gray-50 cursor-pointer text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    value={item.packing}
                    onChange={(e) =>
                      onItemChange(idx, "packing", e.target.value)
                    }
                    className="text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    value={item.batch}
                    onFocus={() => handleBatchClick(idx, item.itemId)}
                    readOnly
                    placeholder="Click to select batch"
                    className="bg-gray-50 cursor-pointer text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="date"
                    value={item.expDate}
                    onChange={(e) =>
                      onItemChange(idx, "expDate", e.target.value)
                    }
                    className="text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      onItemChange(idx, "rate", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs text-right"
                    step="0.01"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onItemChange(idx, "quantity", parseFloat(e.target.value) || 1)
                    }
                    className="text-xs text-center"
                    step="1"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    value={item.discountPercent}
                    onChange={(e) =>
                      onItemChange(idx, "discountPercent", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs text-center"
                    step="0.01"
                  />
                </td>
                <td className="px-3 py-2 text-right font-semibold text-xs text-gray-900">
                  ₹{formatCurrency(calculations.items?.[idx]?.amount || 0)}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        type="button"
        onClick={onAddItem}
        className="mt-3 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Plus size={16} /> Add Product
      </Button>
    </div>
  );
};

export default ItemsTableSection;
