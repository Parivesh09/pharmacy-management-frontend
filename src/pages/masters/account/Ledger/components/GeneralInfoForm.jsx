import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";
import SearchableSelect from "../../../../../components/common/SearchableSelect";
import { useGetStationsQuery } from "../../../../../services/stationApi";

const GeneralInfoForm = ({
  register,
  errors,
  selectedGroup,
  setSelectedGroup,
  setValue,
  watch,
  groupOptions,
  parentLedgersData,
}) => {
  const { data: stationsResponse = [], isLoading: stationsLoading } = useGetStationsQuery({ limit: 100 });
  const stationsData = stationsResponse.data || [];
  
  const stationOptions = stationsData.map((station) => ({
    label: station.name,
    value: station.id,
  }));
  return (
    <div className="space-y-6">
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
          placeholder="Select account group"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mail to
        </label>
        <Input
          type="text"
          className="w-full"
          placeholder="Enter mail address"
          {...register("mailTo")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter address"
          {...register("address")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          className="w-full"
          placeholder="Enter country"
          {...register("country", { required: "Country is required" })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pincode
        </label>
        <Input
          type="text"
          className="w-full"
          placeholder="Enter pincode"
          {...register("pincode")}
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Station <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={stationOptions} 
          value={watch("station")}
          onChange={(opt) => setValue("station", opt?.value || "")}
          placeholder="Search here.."
          isLoading={stationsLoading}
        />
        {errors.station && (
          <p className="text-red-500 text-sm mt-1">
            {errors.station.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          className="w-full"
          placeholder="Enter state"
          {...register("state", { required: "State is required" })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <Input
          type="text"
          className="w-full"
          placeholder="Enter city"
          {...register("city")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <Select className="w-full" {...register("currency")}>
          <option value="">Select Currency</option>
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </Select>
      </div>
    </div>
  );
};

export default GeneralInfoForm; 