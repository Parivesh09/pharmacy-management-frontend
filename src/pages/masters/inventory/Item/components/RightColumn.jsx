import React, { useState, useEffect } from "react";
import { SelectField, TextField } from "../../../../../componets/common/Fields";
import { validatePricing, calculateProfitMetrics, getPricingSummary } from "../../../../../utils/pricingValidation";

const RightColumn = ({ errors, register, watch }) => {
  const [pricingValidation, setPricingValidation] = useState({
    isValid: true,
    errors: {},
    warnings: {},
    calculations: {}
  });
  const [pricingSummary, setPricingSummary] = useState({});

  // Watch pricing fields for validation
  const mrp = watch?.("price");
  const cp = watch?.("purchasePrice");
  const cost = watch?.("cost");
  const sp = watch?.("salerate");

  // Validate pricing relationships
  useEffect(() => {
    const validation = validatePricing({
      mrp: parseFloat(mrp) || 0,
      cp: parseFloat(cp) || 0,
      cost: parseFloat(cost) || 0,
      sp: parseFloat(sp) || 0
    });

    setPricingValidation(validation);

    // Update pricing summary
    const summary = getPricingSummary({
      mrp: parseFloat(mrp) || 0,
      cp: parseFloat(cp) || 0,
      cost: parseFloat(cost) || 0,
      sp: parseFloat(sp) || 0
    });

    setPricingSummary(summary);
  }, [mrp, cp, cost, sp, watch]);

  return (
    <div className="space-y-5">
      {/* MRP Field */}
      <div>
        <TextField
          register={register}
          errors={errors}
          label="M.R.P (Maximum Retail Price)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
          validation={{
            min: { value: 0, message: "MRP must be greater than 0" },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "MRP must be a valid price"
            }
          }}
        />
        {pricingValidation.warnings.mrp && (
          <p className="text-orange-500 text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
             {pricingValidation.warnings.mrp}
          </p>
        )}
      </div>

      {/* Purchase Price Field */}
      <div>
        <TextField
          register={register}
          errors={errors}
          label="Purchase Rate (Cost Price)"
          name="purchasePrice"
          type="number"
          step="0.01"
          min="0"
          className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
          validation={{
            min: { value: 0, message: "Purchase Price must be greater than 0" },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Purchase Price must be a valid price"
            }
          }}
        />
        {pricingValidation.errors.cp && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">❌ {pricingValidation.errors.cp}</p>
        )}
      </div>

      {/* Cost Field */}
      <div>
        <TextField
          register={register}
          errors={errors}
          label="Inventory Cost"
          name="cost"
          type="number"
          step="0.01"
          min="0"
          className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
          validation={{
            min: { value: 0, message: "Cost must be greater than 0" },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Cost must be a valid price"
            }
          }}
        />
        {pricingValidation.errors.cost && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">❌ {pricingValidation.errors.cost}</p>
        )}
      </div>

      {/* Selling Price Field */}
      <div>
        <TextField
          register={register}
          errors={errors}
          label="S.Rate (Selling Price)"
          name="salerate"
          type="number"
          step="0.01"
          min="0"
          className="bg-transparent border-gray-400 dark:border-gray-700 font-bold text-(--primary-color)"
          validation={{
            min: { value: 0, message: "Selling Price must be greater than 0" },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Selling Price must be a valid price"
            }
          }}
        />
        {pricingValidation.errors.sp && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">❌ {pricingValidation.errors.sp}</p>
        )}
      </div>

      {/* Pricing Summary Card */}
      {(mrp || cp || cost || sp) && (
        <div className="bg-(--sidebar-active-bg) border border-(--primary-color)/10 rounded-2xl p-4 mt-6 relative overflow-hidden group/card transition-all hover:shadow-lg">
          <div className="absolute top-0 right-0 w-2 h-full bg-(--primary-color)/10"></div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-(--primary-color) mb-4">Pricing Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-2 rounded-xl bg-(--card-bg) border border-gray-50 dark:border-white/5">
              <span className="text-gray-400 font-bold uppercase text-[9px]">MRP</span>
              <div className="font-black text-(--text-main) text-sm">₹{pricingSummary.mrp}</div>
            </div>
            <div className="p-2 rounded-xl bg-(--card-bg) border border-gray-50 dark:border-white/5">
              <span className="text-gray-400 font-bold uppercase text-[9px]">Cost</span>
              <div className="font-black text-(--text-main) text-sm">₹{pricingSummary.cost}</div>
            </div>
            
            {pricingSummary.profitPerUnit && (
              <div className="col-span-2 p-3 rounded-xl bg-(--primary-color) text-white shadow-xl shadow-(--primary-color)/20">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-white/60 font-bold uppercase text-[9px]">Profit per Unit</span>
                    <div className="font-black text-xl tracking-tighter">₹{pricingSummary.profitPerUnit}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-white/60 font-bold uppercase text-[9px]">Net Margin</span>
                    <div className="font-black text-xl tracking-tighter">{pricingSummary.margin}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warnings & Errors */}
      <div className="space-y-2">
        {Object.entries(pricingValidation.warnings).map(([key, message]) => (
          <div key={key} className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 animate-fade-in">
             <div className="w-2 h-2 rounded-full bg-orange-500"></div>
             {message}
          </div>
        ))}
        {Object.entries(pricingValidation.errors).map(([key, message]) => (
          <div key={key} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 animate-fade-in">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             {message}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          register={register}
          errors={errors}
          label="Narcotics"
          name="narcotic"
          options={["No", "Yes"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
        <SelectField
          register={register}
          errors={errors}
          label="Schedule H"
          name="scheduleH"
          options={["No", "Yes"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          register={register}
          errors={errors}
          label="Schedule H1"
          name="scheduleH1"
          options={["No", "Yes"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
        <SelectField
          register={register}
          errors={errors}
          label="Schedule Drug"
          name="scheduledrug"
          options={["No", "Yes"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          register={register}
          errors={errors}
          label="Presc. Req."
          name="prescription"
          options={["No", "Yes"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
        <SelectField
          register={register}
          errors={errors}
          label="Storage"
          name="storagetype"
          options={["Normal", "Cold"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          register={register}
          errors={errors}
          label="Status"
          name="status"
          options={["Continue", "Discontinued"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
        <SelectField
          register={register}
          errors={errors}
          label="TB Item"
          name="tbitem"
          options={["Normal", "Special"]}
          className="bg-transparent border-gray-400 dark:border-gray-700"
        />
      </div>
    </div>
  );
};

export default RightColumn;
