import React from "react";
import Input from "../../../../components/common/Input";
import SearchableSelect from "../../../../components/common/SearchableSelect";
import Select from "../../../../components/common/Select";

const LeftSection = ({
  formData,
  handleChange,
  states,
  sectionEditability,
  toggleSectionEditability,
  activeTab,
  setActiveTab,
  tabs,
  registrationTypes,
  workingStyles,
}) => {
  return (
    <div className="col-span-2 space-y-4">
      {/* Basic Info Section */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <h3 className="text-sm font-medium">Basic Info</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="text-xs w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-2 py-1 text-xs border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="text-xs"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <SearchableSelect
                  name="state"
                  options={states.map((state) => ({
                    label: state,
                    value: state,
                  }))}
                  value={formData.state}
                  onChange={(option) =>
                    handleChange({ name: "state", value: option?.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                maxLength={6}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="bg-gray-100 px-3 py-2 border-b flex items-center gap-2">
          <input
            type="checkbox"
            checked={sectionEditability.contactDetails}
            onChange={() => toggleSectionEditability("contactDetails")}
            className="w-3 h-3"
          />
          <h3 className="text-sm font-medium">Contact Details</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Phone No.
            </label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!sectionEditability.contactDetails}
              className={`text-xs ${
                !sectionEditability.contactDetails
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Website</label>
            <Input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={!sectionEditability.contactDetails}
              className={`text-xs ${
                !sectionEditability.contactDetails
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">
                Email ID
              </label>
              <Input
                type="email"
                name="companyEmail"
                value={formData.email}
                onChange={handleChange}
                disabled={!sectionEditability.contactDetails}
                className={`text-xs ${
                  !sectionEditability.contactDetails
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
            <button
              className={`mt-5 px-2 py-1 text-xs border border-gray-300 rounded ${
                sectionEditability.contactDetails
                  ? "hover:bg-gray-50"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              disabled={!sectionEditability.contactDetails}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* More Info Section */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="bg-gray-100 px-3 py-2 border-b flex items-center gap-2">
          <input
            type="checkbox"
            checked={sectionEditability.moreInfo}
            onChange={() => toggleSectionEditability("moreInfo")}
            className="w-3 h-3"
          />
          <h3 className="text-sm font-medium">More Info</h3>
        </div>
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={!sectionEditability.moreInfo}
                className={`px-4 py-2 text-sm border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                } ${
                  !sectionEditability.moreInfo
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Tax Detail" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Comp. Reg. Type
                </label>
                <select
                  name="companyRegType"
                  value={formData.companyRegType}
                  onChange={handleChange}
                  disabled={!sectionEditability.moreInfo}
                  className={`w-full px-2 py-2 text-xs border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !sectionEditability.moreInfo
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {registrationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Pan No.
                </label>
                <Input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={!sectionEditability.moreInfo}
                  className={`text-xs ${
                    !sectionEditability.moreInfo
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
            </div>
          )}

          {activeTab === "Licence Info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Drug Lic. No
                  </label>
                  <Input
                    type="text"
                    name="drugLicNo"
                    value={formData.drugLicNo}
                    onChange={handleChange}
                    disabled={!sectionEditability.moreInfo}
                    className={`text-xs ${
                      !sectionEditability.moreInfo
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Exp. Date
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      disabled={!sectionEditability.moreInfo}
                      className={`text-xs ${
                        !sectionEditability.moreInfo
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <button
                      className={`px-2 py-1 text-xs bg-teal-500 text-white rounded ${
                        sectionEditability.moreInfo
                          ? "hover:bg-teal-600"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!sectionEditability.moreInfo}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Other Info" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Jurisdiction
                </label>
                <Input
                  type="text"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  disabled={!sectionEditability.moreInfo}
                  className={`text-xs ${
                    !sectionEditability.moreInfo
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Working Style
                </label>
                <SearchableSelect
                  name="workingStyle"
                  options={workingStyles.map((style) => ({
                    label: style,
                    value: style,
                  }))}
                  value={formData.workingStyle}
                  onChange={handleChange}
                  disabled={!sectionEditability.moreInfo}
                  className={`w-full px-2 py-2 text-xs border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !sectionEditability.moreInfo
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {/* {workingStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))} */}
                </SearchableSelect>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
