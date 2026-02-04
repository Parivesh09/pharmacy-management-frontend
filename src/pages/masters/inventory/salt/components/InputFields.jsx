import React from "react";
import Input from "../../../../../componets/common/Input";
import Select from "../../../../../componets/common/Select";
import { SelectField, TextField } from "../../../../../componets/common/Fields";
import { showToast } from "../../../../../componets/common/Toast";

const InputFields = ({ register, errors }) => {
  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-(--sidebar-active-bg)/30 rounded-3xl border border-(--primary-color)/5 mb-8">
      
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField
          label="Detailed Salt Name"
          name="saltname"
          type="text"
          register={register}
          errors={errors}
          className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
        />
        <TextField
          label="Internal Salt Code"
          name="saltcode"
          type="text"
          register={register}
          errors={errors}
          className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
        />
        <TextField
          label="Composition Type"
          name="salttype"
          type="text"
          register={register}
          errors={errors}
          className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
        />
        <TextField
          label="Therapeutic Group"
          name="saltgroup"
          type="text"
          register={register}
          errors={errors}
          className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
        />
        <TextField
          label="Sub-Therapeutic"
          name="saltsubgroup"
          type="text"
          register={register}
          errors={errors}
          className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
        />
        <TextField
          label="Specific Sub-Group"
          name="saltsubsubgroup"
          type="text"
          register={register}
          errors={errors}
          className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
        />
        <div className="md:col-span-2">
          <SelectField
            label="Inventory Category (TB Item)"
            name="tbitem"
            options={["Normal", "Tb", "Tramadol"]}
            register={register}
            errors={errors}
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-(--card-bg) border border-(--primary-color)/10 rounded-2xl p-6 space-y-5 shadow-lg">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-(--primary-color) border-b border-gray-50 dark:border-white/5 pb-3">
            Regulatory Control
          </h3>

          <SelectField
            label="Narcotic Content"
            name="narcotic"
            options={["Yes", "No"]}
            register={register}
            errors={errors}
            className="bg-transparent border-gray-200 dark:border-gray-700"
          />

          <SelectField
            label="Schedule H2"
            name="scheduleh2"
            options={["Yes", "No"]}
            register={register}
            errors={errors}
            className="bg-transparent border-gray-200 dark:border-gray-700"
          />

          <SelectField
            label="Schedule H3"
            name="scheduleh3"
            options={["Yes", "No"]}
            register={register}
            errors={errors}
            className="bg-transparent border-gray-200 dark:border-gray-700"
          />
        </div>

        
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Status"
            name="nowstatus"
            options={["Continue", "Discontinue"]}
            register={register}
            errors={errors}
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          />
          <SelectField
            label="Prohibited"
            name="prohibited"
            options={["Yes", "No"]}
            register={register}
            errors={errors}
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default InputFields;
