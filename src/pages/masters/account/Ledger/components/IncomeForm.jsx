import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const IncomeForm = ({ register, errors, selectedGroup }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Income Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Income Category
          </label>
          <Select className="w-full" {...register("incomeCategory")}>
            <option value="">Select income category</option>
            <option value="direct">Direct Income</option>
            <option value="indirect">Indirect Income</option>
            <option value="operational">Operational Income</option>
            <option value="investment">Investment Income</option>
            <option value="other">Other Income</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Income Type
          </label>
          <Select className="w-full" {...register("incomeType")}>
            <option value="">Select income type</option>
            <option value="recurring">Recurring</option>
            <option value="one_time">One Time</option>
            <option value="variable">Variable</option>
            <option value="fixed">Fixed</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Amount
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
              {...register("expectedAmount")}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <Select className="w-full" {...register("incomeFrequency")}>
            <option value="">Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Applicable
          </label>
          <Select className="w-full" {...register("taxApplicable")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm; 