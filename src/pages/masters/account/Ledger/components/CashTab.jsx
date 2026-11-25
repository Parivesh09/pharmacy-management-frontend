import React from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const CashTab = ({ register, errors, watch, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Cash Classification
        </label>
        <Select className="w-full" {...register("cashType")}>
          <option value="cash_in_hand">CASH IN HAND</option>
          <option value="imprest">IMPREST</option>
          <option value="petty_cash">PETTY CASH</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Cash Custodian Location
        </label>
        <Input
          type="text"
          placeholder="Safe / Vault Location"
          maxLength={100}
          {...register("cashLocation")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Designated Cashier
        </label>
        <Input
          type="text"
          placeholder="Cashier Name"
          maxLength={100}
          {...register("cashierName")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Maximum Cash Limit
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("maxLimit")}
        />
      </div>
    </div>
  );
};

export default CashTab;