import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const InvestmentForm = ({ register, errors, selectedGroup }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Type
          </label>
          <Select className="w-full" {...register("investmentType")}>
            <option value="">Select investment type</option>
            <option value="stocks">Stocks</option>
            <option value="bonds">Bonds</option>
            <option value="mutual_funds">Mutual Funds</option>
            <option value="fixed_deposits">Fixed Deposits</option>
            <option value="real_estate">Real Estate</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Date
          </label>
          <Input
            type="date"
            className="w-full"
            {...register("investmentDate")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maturity Date
          </label>
          <Input
            type="date"
            className="w-full"
            {...register("maturityDate")}
          />
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
      </div>
    </div>
  );
};

export default InvestmentForm; 