import Input from "../../../../../components/common/Input";
import SearchableSelect from "../../../../../components/common/SearchableSelect";

const SimpleGeneralInfoForm = ({
  register,
  errors,
  selectedGroup,
  setSelectedGroup,
  setValue,
  watch,
  groupOptions,
  parentLedgersData,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">General Info</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Party Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            className={`w-full ${
              errors.partyName ? "border-red-500" : ""
            }`}
            placeholder="Enter party name"
            {...register("partyName", {
              required: "Party name is required",
              minLength: {
                value: 2,
                message: "Party name must be at least 2 characters",
              },
            })}
          />
          {errors.partyName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.partyName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Group <span className="text-red-500">*</span>
          </label>
          <SearchableSelect
            options={groupOptions}
            value={selectedGroup?.value}
            onChange={(opt) => {
              setSelectedGroup(opt);
              setValue("acgroup", opt?.value || "", { shouldValidate: true });
            }}
            placeholder="Search here.."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Ledger
          </label>
          <SearchableSelect
            options={parentLedgersData?.map((ledger) => ({
              label: ledger.ledgerName,
              value: ledger.id,
            }))}
            value={watch("parentLedger")}
            onChange={(opt) => setValue("parentLedger", opt?.value || "")}
            placeholder="Search here.."
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleGeneralInfoForm; 