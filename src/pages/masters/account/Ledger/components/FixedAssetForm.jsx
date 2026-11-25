import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const FixedAssetForm = ({ register, errors, selectedGroup }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Fixed Asset Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset Type
          </label>
          <Select className="w-full" {...register("assetType")}>
            <option value="">Select asset type</option>
            <option value="building">Building</option>
            <option value="machinery">Machinery</option>
            <option value="equipment">Equipment</option>
            <option value="vehicle">Vehicle</option>
            <option value="furniture">Furniture</option>
            <option value="computer">Computer</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Date
          </label>
          <Input
            type="date"
            className="w-full"
            {...register("purchaseDate")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Depreciation Rate (%)
          </label>
          <Input
            type="number"
            step="0.01"
            className="w-full"
            placeholder="0.00"
            {...register("depreciationRate")}
          />
        </div>
      </div>
    </div>
  );
};

export default FixedAssetForm; 