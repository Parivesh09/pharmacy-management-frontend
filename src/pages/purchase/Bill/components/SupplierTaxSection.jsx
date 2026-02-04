import React from "react";
import Input from "../../../../componets/common/Input";

const SupplierTaxSection = ({
  form,
  setForm,
  onShowLedgerDialog,
  onShowPurchaseMasterDialog,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-gray-50 dark:border-white/5">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Creditor / Supplier Entity *
        </label>
        <Input
          type="text"
          value={form.supplierName}
          onClick={onShowLedgerDialog}
          readOnly
          placeholder="IDENTIFY_SUPPLIER_ENTITY"
          className="bg-(--sidebar-active-bg)/10 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) cursor-pointer font-black h-12 rounded-2xl text-(--primary-color) uppercase tracking-tighter transition-all"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Tax Structure Category *
        </label>
        <Input
          type="text"
          value={form.purchaseMasterName}
          onClick={onShowPurchaseMasterDialog}
          readOnly
          placeholder="DETERMINE_TAX_CATEGORY"
          className="bg-(--sidebar-active-bg)/10 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) cursor-pointer font-black h-12 rounded-2xl uppercase tracking-tighter transition-all"
          required
        />
      </div>
    </div>
  );
};

export default SupplierTaxSection;
