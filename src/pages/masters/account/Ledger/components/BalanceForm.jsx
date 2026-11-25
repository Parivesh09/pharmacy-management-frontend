import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";
import { useLedgerPermissions } from "../../../../../hooks/useLedgerPermissions";
import { useDefaultLedgerPermissions } from "../../../../../hooks/useDefaultLedgerPermissions";
import FieldPermissionWarning from "../../../../../components/common/FieldPermissionWarning";

const BalanceForm = ({ register, errors, selectedGroup, ledgerData }) => {
  const { isBalanceEditable } = useLedgerPermissions(selectedGroup);
  const defaultLedgerPermissions = useDefaultLedgerPermissions(ledgerData);

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Balance</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opening Balance
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            ₹
          </span>
          <Input
            type="number"
            step="0.01"
            className={`flex-1 border-r-0 rounded-none ${
              !isBalanceEditable() || !defaultLedgerPermissions.canEditOpeningBalance ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="0.00"
            readOnly={!isBalanceEditable() || !defaultLedgerPermissions.canEditOpeningBalance}
            {...register("openingBalance", {
              min: {
                value: 0,
                message: "Opening balance cannot be negative",
              },
            })}
          />
          <Select
            className="w-20 rounded-l-none"
            {...register("balanceType")}
          >
            <option value="Debit">Dr</option>
            <option value="Credit">Cr</option>
          </Select>
        </div>
        {errors.openingBalance && (
          <p className="text-red-500 text-sm mt-1">
            {errors.openingBalance.message}
          </p>
        )}
        {!isBalanceEditable() && (
          <p className="text-gray-500 text-sm mt-1">
            Opening balance cannot be modified for this account group
          </p>
        )}
        {defaultLedgerPermissions.isDefaultLedger && !defaultLedgerPermissions.canEditOpeningBalance && (
          <FieldPermissionWarning 
            isVisible={true}
            message="Opening balance cannot be modified for default ledgers"
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default BalanceForm; 