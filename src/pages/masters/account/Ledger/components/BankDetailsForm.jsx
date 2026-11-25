import Input from "../../../../../components/common/Input";

const BankDetailsForm = ({ register, errors, selectedGroup }) => {

  const shouldShowBankFields = () => {
    if (!selectedGroup) return false;
    const groupName = selectedGroup.label?.toLowerCase() || "";
    return groupName.includes("bank") || groupName.includes("account");
  };

  if (!shouldShowBankFields()) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Detail</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account No <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter account number"
            {...register("accountNo", {
              required: shouldShowBankFields() ? "Account number is required" : false,
            })}
          />
          {errors.accountNo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.accountNo.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RTGS No
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter RTGS number"
            {...register("rtgsNo")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IFSC Code
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter IFSC code"
            {...register("ifscCode")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter branch name"
            {...register("branch")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MICR No.
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter MICR number"
            {...register("micrNo")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone No.(Ofc.)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              +91
            </span>
            <Input
              type="text"
              fullWidth={true}
              className="flex-1 rounded-l-none"
              placeholder="Enter phone number"
              {...register("phoneNo")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsForm; 