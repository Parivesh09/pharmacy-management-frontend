import React from "react";
import Input from "../../../../componets/common/Input";

const BillHeaderSection = ({ form, setForm }) => {
  return (
    <div className="grid grid-cols-4 gap-4 pb-6 border-b border-gray-200">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bill No. <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <Input
          type="text"
          value={form.billNo}
          onChange={(e) => setForm({ ...form, billNo: e.target.value })}
          placeholder="Auto-generated if empty"
          className="placeholder:text-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bill Date
        </label>
        <Input
          type="date"
          value={form.billDate}
          onChange={(e) => setForm({ ...form, billDate: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Supplier Invoice No.
        </label>
        <Input
          type="text"
          value={form.supplierInvoiceNo}
          onChange={(e) => setForm({ ...form, supplierInvoiceNo: e.target.value })}
          placeholder="Supplier invoice number"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Supplier Invoice Date
        </label>
        <Input
          type="date"
          value={form.supplierInvoiceDate}
          onChange={(e) => setForm({ ...form, supplierInvoiceDate: e.target.value })}
        />
      </div>
    </div>
  );
};

export default BillHeaderSection;
