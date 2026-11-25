import React from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const PartyTab = ({ register, errors, watch, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Party Classification
        </label>
        <Select className="w-full" {...register("partyType")}>
          <option value="debtor">DEBTOR (Receivable)</option>
          <option value="creditor">CREDITOR (Payable)</option>
          <option value="both">BOTH</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Credit Limit
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("creditLimit")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Credit Period (Days)
        </label>
        <Input
          type="number"
          min="0"
          max="999"
          placeholder="30"
          {...register("creditDays")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Payment Terms
        </label>
        <Input
          type="text"
          placeholder="Net 30 / Net 45 / Due on Receipt"
          maxLength={200}
          {...register("paymentTerms")}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Notes / Special Terms
        </label>
        <textarea
          className="w-full bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm font-bold transition-all no-scrollbar shadow-sm"
          rows="3"
          placeholder="Special credit terms, discount arrangements, etc."
          {...register("notes")}
        />
      </div>
    </div>
  );
};

export default PartyTab;