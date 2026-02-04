import React from "react";
import Input from "../../../../componets/common/Input";

const CalculationsSection = ({ form, setForm, calculations, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-gray-50 dark:border-white/5">
      <div className="p-6 bg-(--sidebar-active-bg)/20 rounded-3xl border border-gray-100 dark:border-white/5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">
          Aggregate Bill Discount %
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
          className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) font-black text-2xl text-emerald-500 rounded-2xl h-14 transition-all"
          step="0.01"
        />
      </div>
      <div className="p-6 bg-(--sidebar-active-bg)/20 rounded-3xl border border-gray-100 dark:border-white/5">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
          Statutory Tax Categorization
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white dark:bg-white/5 rounded-2xl">
             <span className="block text-[8px] font-black text-gray-400 uppercase">IGST ({calculations.igstPercent}%)</span>
             <span className="font-bold text-xs text-(--text-main)">₹{formatCurrency(calculations.igstAmount)}</span>
          </div>
          <div className="p-3 bg-white dark:bg-white/5 rounded-2xl">
             <span className="block text-[8px] font-black text-gray-400 uppercase">CGST ({calculations.cgstPercent}%)</span>
             <span className="font-bold text-xs text-(--text-main)">₹{formatCurrency(calculations.cgstAmount)}</span>
          </div>
          <div className="p-3 bg-white dark:bg-white/5 rounded-2xl">
             <span className="block text-[8px] font-black text-gray-400 uppercase">SGST ({calculations.sgstPercent}%)</span>
             <span className="font-bold text-xs text-(--text-main)">₹{formatCurrency(calculations.sgstAmount)}</span>
          </div>
          <div className="p-3 bg-white dark:bg-white/5 rounded-2xl">
             <span className="block text-[8px] font-black text-gray-400 uppercase">CESS ({calculations.cessPercent}%)</span>
             <span className="font-bold text-xs text-(--text-main)">₹{formatCurrency(calculations.cessAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationsSection;
