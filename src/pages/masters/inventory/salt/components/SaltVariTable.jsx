import React from "react";
import Input from "../../../../../componets/common/Input";
import Select from "../../../../../componets/common/Select";
import { Plus, X } from "lucide-react";
import Button from "../../../../../componets/common/Button";
import { showToast } from "../../../../../componets/common/Toast";

const SaltVariTable = ({
  variants,
  handleVariantChange,
  removeVariant,
  addVariant,
}) => {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold tracking-tight text-(--text-main)">Composition Variations</h3>
        <Button
          onClick={addVariant}
          variant="primary"
          size="sm"
          startIcon={<Plus className="w-4 h-4" />}
          className="shadow-lg shadow-(--primary-color)/20"
        >
          Add New Variation
        </Button>
      </div>
      <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
        <table className="min-w-full text-xs bg-transparent">
          <thead>
            <tr className="bg-(--header-bg)/5 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">Strength</th>
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">Dosage Form</th>
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">Brand Name</th>
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">Pack Size</th>
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">MRP</th>
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">DPCO</th>
              <th className="px-4 py-4 text-left font-black uppercase tracking-widest text-gray-400">DPCO MRP</th>
              <th className="px-4 py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="border-0">
            {variants.map((variant, idx) => (
              <tr key={idx} className="border-b border-gray-50 dark:border-white/5 group hover:bg-(--sidebar-active-bg)/30 transition-colors">
                <td className="px-4 py-3">
                  <Input
                    className="w-24 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-(--primary-color)"
                    value={variant.strength}
                    onChange={(e) =>
                      handleVariantChange(idx, "strength", e.target.value)
                    }
                    placeholder="500mg"
                  />
                </td>
                <td className="px-4 py-3">
                  <Select
                    className="w-28 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800"
                    value={variant.dosageForm}
                    onChange={(e) =>
                      handleVariantChange(idx, "dosageForm", e.target.value)
                    }
                  >
                    <option disabled value="">
                      Select
                    </option>
                    <option value="Tablet">Tablet</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Other">Other</option>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Input
                    className="w-28 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800"
                    value={variant.brandName}
                    onChange={(e) =>
                      handleVariantChange(idx, "brandName", e.target.value)
                    }
                    placeholder="Brand"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    className="w-20 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800"
                    value={variant.packSize}
                    onChange={(e) =>
                      handleVariantChange(idx, "packSize", e.target.value)
                    }
                    placeholder="1x10"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    className="w-20 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800 text-(--primary-color)"
                    type="number"
                    value={variant.mrp}
                    onChange={(e) =>
                      handleVariantChange(idx, "mrp", e.target.value)
                    }
                    placeholder="MRP"
                  />
                </td>
                <td className="px-4 py-3">
                  <Select
                    className="w-20 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800"
                    value={variant.dpco_applicable}
                    onChange={(e) =>
                      handleVariantChange(
                        idx,
                        "dpco_applicable",
                        e.target.value === "true"
                      )
                    }
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Input
                    className="w-24 text-xs font-bold bg-transparent border-gray-100 dark:border-gray-800"
                    type="number"
                    value={variant.dpco_mrp}
                    onChange={(e) =>
                      handleVariantChange(idx, "dpco_mrp", e.target.value)
                    }
                    placeholder="DPCO"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => removeVariant(idx)}
                    title="Remove Variant"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaltVariTable;
