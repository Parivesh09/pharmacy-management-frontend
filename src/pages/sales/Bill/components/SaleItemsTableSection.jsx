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
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Products</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 border-b border-gray-200">
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
              <th className="px-3 py-3 text-center font-semibold text-gray-700">
                Stock
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">
                Unit-2
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">
                Unit-1
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
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-blue-50 transition"
              >
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    value={item.product}
                    onFocus={() => onSelectItem(idx)}
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
                    onFocus={() => onSelectBatch && onSelectBatch(idx, item.itemId)}
                    onChange={(e) =>
                      onItemChange(idx, "batch", e.target.value)
                    }
                    className={`text-xs cursor-pointer ${item.batchId ? 'bg-blue-50 border-blue-200' : ''}`}
                    readOnly={!!item.batchId} // Make read-only if batch is selected
                    placeholder={item.batchId ? "Selected from batch" : "Click to select batch"}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="date"
                    value={item.expDate}
                    onChange={(e) =>
                      onItemChange(idx, "expDate", e.target.value)
                    }
                    className={`text-xs ${item.batchId ? 'bg-blue-50 border-blue-200' : ''}`}
                    readOnly={!!item.batchId} // Make read-only if batch is selected
                    placeholder={item.batchId ? "From selected batch" : "Enter expiry"}
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    (item.availableStock || 0) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {item.availableStock || 0}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    value={item.unit2}
                    onChange={(e) =>
                      onItemChange(idx, "unit2", e.target.value)
                    }
                    className="text-xs text-center"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="text"
                    value={item.unit1}
                    onChange={(e) =>
                      onItemChange(idx, "unit1", e.target.value)
                    }
                    className="text-xs text-center"
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
                    onChange={(e) => {
                      const newQuantity = parseFloat(e.target.value) || 1;
                      onItemChange(idx, "quantity", newQuantity);
                    }}
                    className={`text-xs text-center ${
                      // Use batch quantity if available, otherwise use total stock
                      (item.quantity || 0) > (item.batchQuantity || item.availableStock || 0) && 
                      (item.batchQuantity || item.availableStock || 0) > 0
                        ? "border-red-500 bg-red-50"
                        : ""
                    }`}
                    step="1"
                    max={item.batchQuantity || item.availableStock || undefined}
                  />
                  {(item.quantity || 0) > (item.batchQuantity || item.availableStock || 0) && 
                   (item.batchQuantity || item.availableStock || 0) > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {item.batchId ? `Exceeds batch quantity (${item.batchQuantity})!` : "Exceeds stock!"}
                    </div>
                  )}
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
                  ₹{formatCurrency(item.amount || 0)}
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
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Plus size={16} /> Add Product
      </Button>
    </div>
  );
};

export default SaleItemsTableSection;
