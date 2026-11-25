import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const CashDetailsForm = ({ register, errors, selectedGroup }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cash Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cash Type
          </label>
          <Select className="w-full" {...register("cashType")}>
            <option value="">Select cash type</option>
            <option value="petty">Petty Cash</option>
            <option value="main">Main Cash</option>
            <option value="branch">Branch Cash</option>
            <option value="operator">Operator Cash</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cash Location
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter cash location"
            {...register("cashLocation")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cashier Name
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter cashier name"
            {...register("cashierName")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Limit
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
              {...register("maxLimit")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashDetailsForm; 