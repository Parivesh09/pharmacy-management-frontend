import React from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const GSTTab = ({ register, errors, watch, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          GST Registration Type
        </label>
        <Select className="w-full" {...register("gstRegistrationType")}>
          <option value="unregistered">UNREGISTERED</option>
          <option value="regular">REGULAR</option>
          <option value="composition">COMPOSITION</option>
          <option value="casual">CASUAL TAXABLE PERSON</option>
          <option value="nri">NON-RESIDENT TAXABLE PERSON</option>
          <option value="sez">SEZ DEVELOPER/UNIT</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          GSTIN / UIN
        </label>
        <Input
          type="text"
          placeholder="29AAAAA0000A1Z5"
          maxLength={15}
          {...register("gstNo", { pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: "Invalid GST format" } })}
        />
        {errors.gstNo && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">
            {errors.gstNo.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          PAN (Permanent Account Number)
        </label>
        <Input
          type="text"
          placeholder="AAAAA0000A"
          maxLength={10}
          {...register("panNo", { pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, message: "Invalid PAN format (e.g., ABCDE1234F)" } })}
        />
        {errors.panNo && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">
            {errors.panNo.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          TDS Applicable
        </label>
        <Select className="w-full" {...register("tdsApplicable")}>
          <option value="no">NO</option>
          <option value="yes">YES</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          TDS Rate (%)
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="0.00"
          {...register("tdsRate")}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Tax Applicable
        </label>
        <Select className="w-full" {...register("taxApplicable")}>
          <option value="no">NO</option>
          <option value="yes">YES</option>
        </Select>
      </div>
    </div>
  );
};

export default GSTTab;