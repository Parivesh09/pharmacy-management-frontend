import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const ExpenseForm = ({ register, errors, selectedGroup }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Category
          </label>
          <Select className="w-full" {...register("expenseCategory")}>
            <option value="">Select expense category</option>
            <option value="direct">Direct Expense</option>
            <option value="indirect">Indirect Expense</option>
            <option value="operational">Operational Expense</option>
            <option value="administrative">Administrative Expense</option>
            <option value="financial">Financial Expense</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Type
          </label>
          <Select className="w-full" {...register("expenseType")}>
            <option value="">Select expense type</option>
            <option value="recurring">Recurring</option>
            <option value="one_time">One Time</option>
            <option value="variable">Variable</option>
            <option value="fixed">Fixed</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Amount
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
              {...register("budgetAmount")}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <Select className="w-full" {...register("expenseFrequency")}>
            <option value="">Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm; 