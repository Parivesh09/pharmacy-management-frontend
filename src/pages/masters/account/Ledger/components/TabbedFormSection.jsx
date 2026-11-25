import { useState } from "react";
import Input from "../../../../../components/common/Input";
import Select from "../../../../../components/common/Select";

const TabbedFormSection = ({ register, selectedGroup, visibleTabs = [] }) => {
  const [activeTab, setActiveTab] = useState(visibleTabs[0] || "license");

  const renderTabContent = () => {
    switch (activeTab) {
      case "gst":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ledger Type
              </label>
              <Select className="w-full" {...register("ledgerType")}>
                <option value="Unregistered">Unregistered</option>
                <option value="Registered">Registered</option>
                <option value="Composition">Composition</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN No.
              </label>
              <Input
                type="text"
                className="w-full"
                placeholder="Enter PAN number"
                {...register("panNo")}
              />
            </div>
          </div>
        );
      case "license":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License No.
              </label>
              <Input
                type="text"
                className="w-full"
                placeholder="Enter license number"
                {...register("licenseNo")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Type
              </label>
              <Input
                type="text"
                className="w-full"
                placeholder="Enter license type"
                {...register("licenseType")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <Input
                type="date"
                className="w-full"
                {...register("expiryDate")}
              />
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <Input
                type="text"
                className="w-full"
                placeholder="Enter contact person name"
                {...register("contactPerson")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                className="w-full"
                placeholder="Enter email address"
                {...register("email")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile
              </label>
              <Input
                type="text"
                className="w-full"
                placeholder="Enter mobile number"
                {...register("mobile")}
              />
            </div>
          </div>
        );
      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <Input
                type="text"
                className="w-full"
                placeholder="Enter UPI ID"
                {...register("upiId")}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case "gst":
        return "GST/Tax Details";
      case "license":
        return "Licence Info";
      case "contact":
        return "Contact Info";
      case "upi":
        return "UPI Details";
      default:
        return tab;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      <div className="flex border-b">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2 rounded-t-lg text-sm font-medium cursor-pointer ${
              activeTab === tab
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>
      <div className="p-4">{renderTabContent()}</div>
    </div>
  );
};

export default TabbedFormSection; 