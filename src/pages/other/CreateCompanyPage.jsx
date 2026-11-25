import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, Edit, Trash2, PowerOff } from "lucide-react";
import Input from "../../components/common/Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/userSlice";
import LeftSection from "./components/createCompanyPageComponents/LeftSection";
import RightSection from "./components/createCompanyPageComponents/RightSection";
import { useCreateUserCompanyMutation } from "../../services/userCompanyApi";
import {
  validateEmail,
  validatePhone,
  validateZipCode,
} from "../../utils/inputValidation";
import { showToast } from "../../components/common/Toast";

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    branchCode: "",
    address: "",
    country: "India",
    state: "",
    pinCode: "",
    businessType: "",
    calendarType: "English",
    financialYearFrom: "",
    financialYearTo: "",
    taxType: "GST",
    phone: "",
    website: "",
    email: "",
    companyRegType: "Unregistered",
    panNumber: "",
    drugLicNo: "",
    expDate: "",
    jurisdiction: "",
    workingStyle: "Secondary (Batch/Mrp/Size)",
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [createCompany, { isLoading, isError, isSuccess }] =
    useCreateUserCompanyMutation();
  const userId = user?.id;

  const handleCreateCompany = async () => {
    if (!formData.companyName) {
      showToast("Company Name is required", "error");
      return;
    }
    if (!formData.address) {
      showToast("Address is required", "error");
      return;
    }
    if (!formData.state) {
      showToast("State is required", "error");
      return;
    }
    if (!formData.branchCode) {
      showToast("Branch code is required", "error");
      return;
    }
    const { isValid, message } = validateZipCode(formData.pinCode);
    const { isValid: isPhn, message: phnMessage } = validatePhone(
      formData.phone
    );
    const { isValid: isEmail, message: emailMessage } = validateEmail(
      formData.email
    );

    if (!isValid) {
      showToast(message, "error");
      return;
    }
    if (!isPhn) {
      showToast(phnMessage, "error");
      return;
    }
    if (!isEmail) {
      showToast(emailMessage, "error");
      return;
    }

    try {
      const result = await createCompany({
        userId,
        companyData: { ...formData },
      }).unwrap();
      navigate("/company-list");
      // if (isSuccess || result.data.success || result.success) {
      // }
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...user }));
  }, [user]);

  const showBack = user?.userCompanies && user?.userCompanies?.length > 0;

  const [activeTab, setActiveTab] = useState("Tax Detail");
  const [sectionEditability, setSectionEditability] = useState({
    contactDetails: true,
    moreInfo: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target
      ? e.target
      : { name: e.name, value: e.value };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSectionEditability = (section) => {
    setSectionEditability((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const businessTypes = [
    "Billing [General]",
    "Chemist [Pharmacy]",
    "Pharma Distribution [Batch]",
    "Automobile",
    "Garment",
    "Mobile Trade",
    "Supermarket/Grocery",
    "Computer Hardware",
  ];

  const calendarTypes = ["English", "Hindi", "Gujarati"];
  const taxTypes = ["GST", "VAT", "IGST", "Other"];
  const registrationTypes = [
    "Unregistered",
    "Private Limited",
    "Partnership",
    "LLP",
    "Proprietorship",
  ];
  const workingStyles = ["Secondary (Batch/Mrp/Size)", "Primary", "Tertiary"];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const tabs = ["Tax Detail", "Licence Info", "Other Info"];

  return (
    <div className="w-full max-w-6xl mx-auto h-full bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate("/company-list")}
              className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          <h1 className="text-lg font-medium">Create Company</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCreateCompany}
            className="px-4 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-1"
          >
            <span>F18</span> Save
          </button>
          <button className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
            <span>F9</span> Clear
          </button>
          <button
            onClick={() => navigate("/company-list")}
            className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <span>Esc</span> Close
          </button>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="px-4 py-1 text-sm bg-amber-400 cursor-pointer border border-gray-300 rounded hover:bg-amber-300 flex items-center gap-1"
          >
            <span>
              <PowerOff size={16} />
            </span>{" "}
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Left Section - Basic Info */}

        <LeftSection
          formData={formData}
          handleChange={handleChange}
          states={states}
          sectionEditability={sectionEditability}
          toggleSectionEditability={toggleSectionEditability}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          registrationTypes={registrationTypes}
          workingStyles={workingStyles}
        />

        {/* Right Section - Company Details */}
        <RightSection
          formData={formData}
          handleChange={handleChange}
          businessTypes={businessTypes}
          calendarTypes={calendarTypes}
          taxTypes={taxTypes}
        />
      </div>
    </div>
  );
};

export default CreateCompanyPage;