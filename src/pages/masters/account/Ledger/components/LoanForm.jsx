import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const LoanForm = ({ register, errors, selectedGroup }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Type
          </label>
          <Select className="w-full" {...register("loanType")}>
            <option value="">Select loan type</option>
            <option value="secured">Secured Loan</option>
            <option value="unsecured">Unsecured Loan</option>
            <option value="bank_od">Bank OD</option>
            <option value="term_loan">Term Loan</option>
            <option value="working_capital">Working Capital</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lender Name
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter lender name"
            {...register("lenderName")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount
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
              {...register("loanAmount")}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%)
          </label>
          <Input
            type="number"
            step="0.01"
            className="w-full"
            placeholder="0.00"
            {...register("interestRate")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <Input
            type="date"
            className="w-full"
            {...register("loanStartDate")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            type="date"
            className="w-full"
            {...register("loanEndDate")}
          />
        </div>
      </div>
    </div>
  );
};

export default LoanForm; 