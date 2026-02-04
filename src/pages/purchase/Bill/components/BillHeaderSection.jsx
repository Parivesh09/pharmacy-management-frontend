import React from "react";
import Input from "../../../../componets/common/Input";

const BillHeaderSection = ({ form, setForm }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-gray-50 dark:border-white/5">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Internal Bill ID <span className="text-(--primary-color)/50">(Auto)</span>
        </label>
        <Input
          type="text"
          value={form.billNo}
          onChange={(e) => setForm({ ...form, billNo: e.target.value })}
          placeholder="SYSTEM_GEN"
          className="bg-(--sidebar-active-bg)/10 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) font-mono text-xs font-bold h-12 rounded-2xl transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Record Date
        </label>
        <Input
          type="date"
          value={form.billDate}
          onChange={(e) => setForm({ ...form, billDate: e.target.value })}
          required
          className="bg-(--sidebar-active-bg)/10 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) font-bold h-12 rounded-2xl transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Supplier Invoice #
        </label>
        <Input
          type="text"
          value={form.supplierInvoiceNo}
          onChange={(e) => setForm({ ...form, supplierInvoiceNo: e.target.value })}
          placeholder="BILL_REF_001"
          className="bg-(--sidebar-active-bg)/10 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) font-bold h-12 rounded-2xl transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Invoice Issuance Date
        </label>
        <Input
          type="date"
          value={form.supplierInvoiceDate}
          onChange={(e) => setForm({ ...form, supplierInvoiceDate: e.target.value })}
          className="bg-(--sidebar-active-bg)/10 border border-gray-200 dark:border-white/10 focus:border-(--primary-color) font-bold h-12 rounded-2xl transition-all"
        />
      </div>
    </div>
  );
};

export default BillHeaderSection;
