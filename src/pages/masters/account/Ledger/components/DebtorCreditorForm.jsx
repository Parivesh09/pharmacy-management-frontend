import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const DebtorCreditorForm = ({ register, errors, selectedGroup }) => {
  const isDebtor = selectedGroup?.label?.toLowerCase().includes("debtor");
  const isCreditor = selectedGroup?.label?.toLowerCase().includes("creditor");

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {isDebtor ? "Debtor" : isCreditor ? "Creditor" : "Party"} Details
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Limit
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              ₹
            </span>
            <Input
              type="number"
              step="0.01"
              className="flex-1 rounded-l-none"
              placeholder="0.00"
              {...register("creditLimit")}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Terms
          </label>
          <Select className="w-full" {...register("paymentTerms")}>
            <option value="">Select payment terms</option>
            <option value="immediate">Immediate</option>
            <option value="7days">7 Days</option>
            <option value="15days">15 Days</option>
            <option value="30days">30 Days</option>
            <option value="45days">45 Days</option>
            <option value="60days">60 Days</option>
            <option value="90days">90 Days</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isDebtor ? "Debtor" : "Creditor"} Type
          </label>
          <Select className="w-full" {...register("partyType")}>
            <option value="">Select type</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
            <option value="distributor">Distributor</option>
            <option value="wholesaler">Wholesaler</option>
            <option value="retailer">Retailer</option>
            <option value="branch">Branch</option>
            <option value="ecommerce">E-commerce</option>
            <option value="fieldstaff">Field Staff</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TDS Applicable
          </label>
          <Select className="w-full" {...register("tdsApplicable")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TDS Rate (%)
          </label>
          <Input
            type="number"
            step="0.01"
            className="w-full"
            placeholder="0.00"
            {...register("tdsRate")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GST Registration Type
          </label>
          <Select className="w-full" {...register("gstRegistrationType")}>
            <option value="unregistered">Unregistered</option>
            <option value="registered">Registered</option>
            <option value="composition">Composition</option>
            <option value="exempted">Exempted</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DebtorCreditorForm; 