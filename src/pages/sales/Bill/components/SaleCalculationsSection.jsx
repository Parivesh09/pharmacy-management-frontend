import React from "react";
import Input from "../../../../componets/common/Input";

const SaleCalculationsSection = ({
  form,
  setForm,
  calculations,
  formatCurrency,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 bg-(--sidebar-active-bg)/30 rounded-2xl border border-(--primary-color)/5">
        <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">
          Discount Applied
        </div>
        <div className="text-sm font-black text-(--text-main)">
          ₹{formatCurrency(calculations.itemDiscount)}
        </div>
      </div>
      <div className="p-4 bg-(--sidebar-active-bg)/30 rounded-2xl border border-(--primary-color)/5">
        <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Tax Breakdown</div>
        <div className="text-xs space-y-1 text-(--text-main) font-bold">
          <div className="flex justify-between">
            <span>CGST ({form.cgstPercent}%):</span> <span>₹{formatCurrency(calculations.cgstAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST ({form.sgstPercent}%):</span> <span>₹{formatCurrency(calculations.sgstAmount)}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-(--sidebar-active-bg)/30 rounded-2xl border border-(--primary-color)/5">
        <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">
          Flat Discount (%)
        </label>
        <Input
          type="number"
          value={form.billDiscountPercent}
          onChange={(e) =>
            setForm({
              ...form,
              billDiscountPercent: parseFloat(e.target.value) || 0,
            })
          }
          className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          step="0.01"
        />
      </div>
      <div className="p-4 bg-(--sidebar-active-bg)/30 rounded-2xl border border-(--primary-color)/5">
        <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">
          Tax Configuration (%)
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={form.cgstPercent}
            onChange={(e) =>
              setForm({ ...form, cgstPercent: parseFloat(e.target.value) || 0 })
            }
            placeholder="CGST"
            className="flex-1 text-xs bg-transparent border-gray-200 dark:border-gray-700"
            step="0.01"
          />
          <Input
            type="number"
            value={form.sgstPercent}
            onChange={(e) =>
              setForm({ ...form, sgstPercent: parseFloat(e.target.value) || 0 })
            }
            placeholder="SGST"
            className="flex-1 text-xs bg-transparent border-gray-200 dark:border-gray-700"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default SaleCalculationsSection;
