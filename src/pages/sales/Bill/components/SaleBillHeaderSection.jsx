import React from "react";
import Input from "../../../../componets/common/Input";

const SaleBillHeaderSection = ({ form, setForm, onShowLedgerDialog }) => {
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
          Date
        </label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Party Name
        </label>
        <Input
          type="text"
          value={form.partyName}
          onClick={onShowLedgerDialog}
          readOnly
          placeholder="Click to select party"
          className="bg-gray-50 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SaleBillHeaderSection;
