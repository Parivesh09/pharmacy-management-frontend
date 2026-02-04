import React from "react";
import Input from "../../../../componets/common/Input";

const PaymentDetailsSection = ({
  paymentMode,
  setPaymentMode,
  cashDenominations,
  setCashDenominations,
  formatCurrency,
}) => {
  const calculateTotalCash = () => {
    return Object.keys(cashDenominations).reduce(
      (sum, denom) => sum + denom * cashDenominations[denom],
      0
    );
  };

  return (
    <div className="py-8 border-b border-gray-50 dark:border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black italic tracking-tighter text-(--text-main) uppercase">Financial Settlement</h3>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction Mode</div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["cash", "online", "cheque", "credit"].map((mode) => (
            <label key={mode} className={`flex items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              paymentMode === mode 
              ? "bg-(--primary-color)/10 border-(--primary-color) text-(--primary-color) shadow-lg shadow-(--primary-color)/10" 
              : "bg-transparent border-gray-100 dark:border-white/5 text-gray-400 hover:border-gray-200"
            }`}>
              <input
                type="radio"
                value={mode}
                checked={paymentMode === mode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="hidden"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {paymentMode === "cash" && (
        <div className="bg-(--sidebar-active-bg)/30 rounded-[2rem] p-8 border border-gray-100 dark:border-white/5">
          <label className="block text-[10px] font-black uppercase tracking-widest text-(--primary-color) mb-6">
            Currency Denomination Breakdown
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {Object.keys(cashDenominations).map((denomination) => (
              <div key={denomination} className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter text-center">
                  ₹ {denomination}
                </label>
                <Input
                  type="number"
                  min="0"
                  value={cashDenominations[denomination]}
                  onChange={(e) =>
                    setCashDenominations({
                      ...cashDenominations,
                      [denomination]: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="text-center font-black bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:border-(--primary-color) h-11 rounded-xl shadow-inner transition-all"
                />
                <div className="text-[10px] text-gray-400 font-bold mt-1 text-center italic tracking-tighter">
                  val: {formatCurrency(denomination * cashDenominations[denomination])}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex justify-between items-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Tendered Amount</div>
            <div className="text-2xl font-black italic tracking-tighter text-(--primary-color)">
              ₹{calculateTotalCash().toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsSection;
