import React from "react";

const TotalSection = ({ calculations, formatCurrency }) => {
  return (
    <div className="flex justify-end pt-8">
      <div className="p-8 w-full md:w-[450px] bg-(--sidebar-active-bg)/30 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gross Procurement Subtotal</span>
            <span className="font-bold text-(--text-main)">
              ₹{formatCurrency(calculations.subtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center text-emerald-500">
            <span className="text-[10px] font-black uppercase tracking-widest">Aggregate Negotiated Discount</span>
            <span className="font-bold">
              -₹
              {formatCurrency(
                calculations.itemDiscount + calculations.billDiscountAmount
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Statutory Levies (Tax)</span>
            <span className="font-bold text-(--text-main)">
              ₹{formatCurrency(calculations.totalTaxAmount)}
            </span>
          </div>
          <div className="border-t border-gray-50 dark:border-white/5 pt-6 flex justify-between items-end">
            <div>
               <span className="block text-[10px] font-black uppercase tracking-widest text-(--primary-color)">Net Procurement Value</span>
               <span className="text-3xl font-black italic tracking-tighter text-(--text-main) uppercase leading-none">Final Amount</span>
            </div>
            <span className="text-4xl font-black italic tracking-tighter text-(--primary-color)">₹{formatCurrency(calculations.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSection;
