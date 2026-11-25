import React from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli",
  "Daman and Diu", "Lakshadweep",
];

const AddressTab = ({ register, errors, watch, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Official Correspondent Email
        </label>
        <Input
          type="email"
          placeholder="correspondence@entity.com"
          {...register("mailTo")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Primary Nodal Officer
        </label>
        <Input
          type="text"
          placeholder="Authorized Person Name"
          {...register("contactPerson")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Institutional Email
        </label>
        <Input
          type="email"
          placeholder="official@entity.com"
          {...register("email")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Mobile Connectivity
        </label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">
            +91
          </div>
          <Input
            type="text"
            className="flex-1 pl-12"
            placeholder="00000 00000"
            {...register("mobile")}
          />
        </div>
      </div>
      <div className="md:col-span-2 space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Geographical Residency (Address)
        </label>
        <textarea
          className="w-full bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm font-bold transition-all no-scrollbar shadow-sm"
          rows="3"
          placeholder="Registered office or premise location details..."
          {...register("address")}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Sovereign State (Country)
        </label>
        <Input type="text" placeholder="e.g. India" {...register("country")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Provincial Jurisdiction (State)
        </label>
        <Select className="w-full bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm font-bold transition-all appearance-none shadow-sm" {...register("state")}>
          <option value="">-- DETERMINE STATE --</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Municipal Region (City)
        </label>
        <Input type="text" placeholder="City Name" {...register("city")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Postal Index Number (PIN)
        </label>
        <Input
          type="text"
          placeholder="110001"
          maxLength={6}
          {...register("pincode", { pattern: { value: /^\d{6}$/, message: "PIN must be 6 digits" } })}
        />
      </div>
    </div>
  );
};

export default AddressTab;