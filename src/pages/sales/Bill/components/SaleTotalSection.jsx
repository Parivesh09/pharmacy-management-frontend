import React from "react";

const SaleTotalSection = ({ calculations, formatCurrency }) => {
  return (
    <div className="flex justify-end">
      <div className="p-8 w-full max-w-sm bg-(--card-bg) rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-(--primary-color) opacity-5 rounded-bl-full transition-all group-hover:scale-110"></div>
        <div className="space-y-4 text-sm relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
            <span className="font-bold text-(--text-main)">
              ₹{formatCurrency(calculations.subtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Discount</span>
            <span className="font-bold text-orange-600">
              -₹
              {formatCurrency(
                calculations.itemDiscount + calculations.billDiscountAmount
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Taxes</span>
            <span className="font-bold text-(--primary-color)">
              +₹
              {formatCurrency(
                calculations.cgstAmount + calculations.sgstAmount
              )}
            </span>
          </div>
          <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10 flex justify-between items-end">
            <span className="text-sm font-black uppercase text-(--text-main) opacity-40">Invoice Value</span>
            <span className="text-3xl font-black text-(--primary-color) tracking-tighter italic">
              ₹{formatCurrency(calculations.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleTotalSection;
