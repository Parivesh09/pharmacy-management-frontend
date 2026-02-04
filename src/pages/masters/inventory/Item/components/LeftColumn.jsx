import React from "react";
import { SelectField, TextField } from "../../../../../componets/common/Fields";
import SearchableSelect from "../../../../../componets/common/SearchableSelect";

const LeftColumn = ({
  errors,
  register,
  allData,
  states,
  setters,
  setValue,
  onCreateRack,
  onCreateUnit,
  onCreateHSN,
  onCreateCompany,
  onCreateSalt,
  onCreateTaxCategory,
}) => {
  
  return (
    <div className="space-y-5">
      <TextField
        errors={errors}
        register={register}
        label={"Contraindications"}
        name="contraindications"
        className="bg-transparent border-gray-400 dark:border-gray-700 font-medium"
      />
      <TextField
        errors={errors}
        register={register}
        label={"Relative Contraindications"}
        name="relativeContraindications"
        className="bg-transparent border-gray-400 dark:border-gray-700 font-medium"
      />
      <TextField
        errors={errors}
        register={register}
        required
        label="Packing"
        name="packing"
        className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
      />

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          Rack Storage <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={allData?.rackData?.data?.map((s) => ({
            label: s.rackname,
            value: s.id,
          }))}
          value={states?.selectedRack}
          allowCreate={true}
          onChange={(opt) => {
            if (opt.isNew) {
              onCreateRack && onCreateRack();
              return;
            }
            setters.setSelectedRack(opt.value);
            setValue("rack", opt.value, { shouldValidate: true });
          }}
          placeholder="Select Rack Location"
        />
        {errors.rack && (
          <div className="text-red-500 font-bold text-[10px] mt-1 uppercase tracking-wider">
            Required field
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          Manufacturer / Company <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={allData?.companyData?.data?.map((s) => ({
            label: s.companyname,
            value: s.id,
          }))}
          value={states?.selectedCompany}
          allowCreate={true}
          onChange={(opt) => {
            if (opt.isNew) {
              onCreateCompany && onCreateCompany();
              return;
            }
            setters.setSelectedCompany(opt.value);
            setValue("company", opt.value, { shouldValidate: true });
          }}
          placeholder="Select Manufacturer"
        />
        {errors.company && (
          <div className="text-red-500 font-bold text-[10px] mt-1 uppercase tracking-wider">
            Required field
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          Medicine Composition
        </label>
        <SearchableSelect
          options={allData?.saltData?.data?.map((s) => ({
            label: s.saltname,
            value: s.id,
          }))}
          value={states?.selectedSalt}
          allowCreate={true}
          onChange={(opt) => {
            if (opt.isNew) {
              onCreateSalt && onCreateSalt();
              return;
            }
            setters.setSelectedSalt(opt.value);
            setValue("salt", opt.value, { shouldValidate: true });
          }}
          placeholder="Select Salt/Composition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Base Unit <span className="text-red-500">*</span>
          </label>
          <SearchableSelect
            options={allData?.unitData?.data?.map((s) => ({
              label: s.unitName,
              value: s.id,
            }))}
            value={states?.selectedUnit}
            allowCreate={true}
            onChange={(opt) => {
              if (opt.isNew) {
                onCreateUnit && onCreateUnit();
                return;
              }
              setters.setSelectedUnit(opt.value);
              setValue("unit1", opt.value, { shouldValidate: true });
            }}
            placeholder="Primary Unit"
          />
          {errors.unit1 && (
            <div className="text-red-500 font-bold text-[10px] mt-1 uppercase tracking-wider">
              Required
            </div>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Secondary Unit
          </label>
          <SearchableSelect
            options={allData?.unitData?.data?.map((s) => ({
              label: s.unitName,
              value: s.id,
            }))}
            value={states?.selectedUnit2}
            allowCreate={true}
            onChange={(opt) => {
              if (opt.isNew) {
                onCreateUnit && onCreateUnit();
                return;
              }
              setters.setSelectedUnit2(opt.value);
              setValue("unit2", opt.value, { shouldValidate: true });
            }}
            placeholder="Secondary"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          HSN / SAC Code <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={allData?.hsnData?.data?.map((s) => ({
            label: s.hsnsacname,
            value: s.id,
          }))}
          value={states?.selectedHSN}
          allowCreate={true}
          onChange={(opt) => {
            if (opt.isNew) {
              onCreateHSN && onCreateHSN();
              return;
            }
            setters.setSelectedHSN(opt.value);
            setValue("hsnsac", opt.value, { shouldValidate: true });
          }}
          placeholder="Search HSN/SAC"
        />
        {errors.hsnsac && (
          <div className="text-red-500 font-bold text-[10px] mt-1 uppercase tracking-wider">
            Required field
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <TextField
            register={register}
            errors={errors}
            label="Conversion Factor"
            name="conversion"
            className="bg-transparent border-gray-400 dark:border-gray-700"
          />
        </div>
        <div className="flex-1">
          <SelectField
            register={register}
            errors={errors}
            label="Allow Decimals"
            name="unitindecimal"
            options={["No", "Yes"]}
            className="bg-transparent border-gray-400 dark:border-gray-700"
          />
        </div>
      </div>

      <div>
        <label
          className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2"
          htmlFor="taxcategory"
        >
          GST Tax Category <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={allData?.taxcategoryData?.data?.map((s) => ({
            label: s.purchaseType,
            value: s.id,
          }))}
          value={states?.selectedTaxCategory}
          allowCreate={true}
          onChange={(opt) => {
            if (opt.isNew) {
              onCreateTaxCategory && onCreateTaxCategory();
              return;
            }
            setters.setSelectedTaxCategory(opt.value);
            setValue("taxcategory", opt.value, { shouldValidate: true });
          }}
          placeholder="Select GST Category"
        />
      </div>
    </div>
  );
};

export default LeftColumn;
