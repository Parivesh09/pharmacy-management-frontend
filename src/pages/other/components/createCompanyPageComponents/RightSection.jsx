import { Edit, Trash2, Upload } from "lucide-react";
import React from "react";
import Input from "../../../../components/common/Input";
import SearchableSelect from "../../../../components/common/SearchableSelect";
import Select from "../../../../components/common/Select";

const RightSection = ({
  formData,
  handleChange,
  businessTypes,
  calendarTypes,
  taxTypes,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <h3 className="text-sm font-medium">Company Details</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Branch Code <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="branchCode"
              value={formData.branchCode}
              onChange={handleChange}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Business Type <span className="text-red-500">*</span>
            </label>
            <Select
              name="businessType"
              options={businessTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-2 py-2 text-xs border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Calendar Type
            </label>
            <Select
              name="calendarType"
              options={calendarTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              value={formData.calendarType}
              onChange={handleChange}
              className="w-full px-2 py-2 text-xs border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Financial Year
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">From</span>
                <Input
                  type="date"
                  name="financialYearFrom"
                  value={formData.financialYearFrom}
                  onChange={handleChange}
                  className="text-xs flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">To</span>
                <Input
                  type="date"
                  name="financialYearTo"
                  value={formData.financialYearTo}
                  onChange={handleChange}
                  className="text-xs flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Tax Type</label>
            <Select
              options={taxTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              name="taxType"
              value={formData.taxType}
              onChange={handleChange}
              className="w-full px-2 py-2 text-xs border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Company Logo Section */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <h3 className="text-sm font-medium">Company Logo</h3>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-600 mb-2">Upload Logo</div>
          <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
              <Upload size={24} className="text-gray-400" />
            </div>
            <div className="flex gap-2 justify-center">
              <button className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center">
                <Edit size={12} />
              </button>
              <button className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
