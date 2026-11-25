import React from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";
import SearchableSelect from "../../../../../components/common/SearchableSelect";

const GeneralTab = ({
  register,
  errors,
  watch,
  setValue,
  setSelectedGroup,
  selectedGroup,
  groupOptions,
  parentLedgersData,
  stationOptions,
  stationsLoading,
  defaultLedgerPermissions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Ledger Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="Enter logical entity name"
          className={errors.ledgerName ? "border-red-500" : ""}
          {...register("ledgerName", {
            required: "Ledger name is required",
            minLength: { value: 2, message: "Min 2 characters" },
          })}
        />
        {errors.ledgerName && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">
            {errors.ledgerName.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Account Group <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={groupOptions}
          value={selectedGroup?.value}
          onChange={(opt) => {
            setSelectedGroup(opt);
            setValue("acgroup", opt?.value || "", { shouldValidate: true });
          }}
          placeholder="Categorize entity"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Parent Hierarchy
        </label>
        <SearchableSelect
          options={parentLedgersData?.map((l) => ({
            label: l.ledgerName,
            value: l.id,
          }))}
          value={watch("parentLedger")}
          onChange={(opt) => setValue("parentLedger", opt?.value || "")}
          placeholder="Optional parent link"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Financial Station
        </label>
        <SearchableSelect
          options={stationOptions}
          value={watch("station")}
          isLoading={stationsLoading}
          onChange={(opt) => setValue("station", opt?.value || "")}
          placeholder="Geographical locus"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Opening Balance & Liquidity
        </label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">
            ₹
          </div>
          <Input
            type="number"
            step="0.01"
            className="flex-1 rounded-r-none pl-10"
            placeholder="0.00"
            readOnly={!defaultLedgerPermissions.canEditOpeningBalance}
            {...register("openingBalance")}
          />
          <Select
            className="w-24 rounded-l-none border-l-0"
            {...register("balanceType")}
          >
            <option value="Debit">DEBIT (DR)</option>
            <option value="Credit">CREDIT (CR)</option>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Settlement Currency
        </label>
        <Select className="w-full" {...register("currency")}>
          <option value="INR">INDIAN RUPEE (₹)</option>
          <option value="USD">US DOLLAR ($)</option>
          <option value="EUR">EURO (€)</option>
          <option value="GBP">BRITISH POUND (£)</option>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Description
        </label>
        <Input
          type="text"
          placeholder="Optional description"
          className="w-full"
          {...register("description")}
        />
      </div>
    </div>
  );
};

export default GeneralTab;