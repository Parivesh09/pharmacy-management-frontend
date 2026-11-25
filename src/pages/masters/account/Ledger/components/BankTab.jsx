import React from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const BankTab = ({ register, errors, watch, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Bank Name
        </label>
        <Input
          type="text"
          placeholder="State Bank of India"
          maxLength={100}
          {...register("bankName")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Branch Name
        </label>
        <Input
          type="text"
          placeholder="Main Branch"
          maxLength={100}
          {...register("branch")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Account Number
        </label>
        <Input
          type="text"
          placeholder="12345678901"
          maxLength={18}
          {...register("accountNo", { pattern: { value: /^[0-9]{9,18}$/, message: "Account number must be 9-18 digits" } })}
        />
        {errors.accountNo && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">
            {errors.accountNo.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          IFSC Code
        </label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">
            IFSC
          </div>
          <Input
            type="text"
            className="flex-1 pl-12 uppercase"
            placeholder="SBIN0001234"
            maxLength={11}
            {...register("ifscCode", { pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/i, message: "Invalid IFSC format" } })}
          />
        </div>
        {errors.ifscCode && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">
            {errors.ifscCode.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          MICR Code
        </label>
        <Input
          type="text"
          placeholder="110002001"
          maxLength={9}
          {...register("micrNo", { pattern: { value: /^[0-9]{9}$/, message: "MICR must be 9 digits" } })}
        />
        {errors.micrNo && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">
            {errors.micrNo.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Account Type
        </label>
        <Select className="w-full" {...register("accountType")}>
          <option value="savings">SAVINGS</option>
          <option value="current">CURRENT</option>
          <option value="cc">CASH CREDIT</option>
          <option value="od">OVERDRAFT</option>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          RTGS / NEFT Code
        </label>
        <Input type="text" placeholder="Optional" {...register("rtgsNo")} />
      </div>
    </div>
  );
};

export default BankTab;