import React, { useEffect, useState } from "react";
import { ArrowLeft, PowerOff, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} from "../../services/userCompanyApi";
import { logout, setCurrentCompany } from "../../services/userSlice";
import { showToast } from "../../components/common/Toast";
import LeftSection from "./components/createCompanyPageComponents/LeftSection";
import RightSection from "./components/createCompanyPageComponents/RightSection";

const UpdateCompanyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const { user, isPrimaryCompanyAvailable } = useSelector(
    (state) => state.user
  );

  const { data: companyData } = useGetCompanyByIdQuery(companyId);
  const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("Tax Detail");
  const [sectionEditability, setSectionEditability] = useState({
    contactDetails: true,
    moreInfo: true,
  });

  useEffect(() => {
    if (companyData?.data) {
      setFormData(companyData.data);
    }
  }, [companyData]);

  const handleChange = (e) => {
    const { name, value } = e.target
      ? e.target
      : { name: e.name, value: e.value };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCompany = async () => {
    try {
      await updateCompany({ id: companyId, ...formData }).unwrap();
      showToast("Company updated successfully!", "success");
      navigate("/company-list");
    } catch (error) {
      console.error("Error updating company:", error);
      showToast("Failed to update company", "error");
    }
  };

  const handleMakePrimary = async () => {
    if (formData.isPrimary) {
      showToast("Already primary company", "info");
      return;
    }
    if (isPrimaryCompanyAvailable) {
      showToast("Another primary company already exists!", "error");
      return;
    }

    try {
      await updateCompany({
        id: companyId,
        ...formData,
        isPrimary: true,
      }).unwrap();
      dispatch(setCurrentCompany({ ...formData, isPrimary: true }));
      showToast("Company marked as primary!", "success");
      navigate("/company-list");
    } catch (error) {
      console.error("Error making company primary:", error);
      showToast("Failed to set company as primary", "error");
    }
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
          <button
            onClick={() => navigate("/company-list")}
            className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-lg font-medium">Edit Company</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUpdateCompany}
            className="px-4 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-1"
          >
            Update
          </button>
          <button
            onClick={handleMakePrimary}
            disabled={formData.isPrimary}
            className={`px-4 py-1 text-sm rounded flex items-center gap-1 ${
              formData.isPrimary
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <Star size={16} />
            Make Primary
          </button>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="px-4 py-1 text-sm bg-amber-400 cursor-pointer border border-gray-300 rounded hover:bg-amber-300 flex items-center gap-1"
          >
            <PowerOff size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-full">
        <LeftSection
          formData={formData}
          handleChange={handleChange}
          states={states}
          sectionEditability={sectionEditability}
          toggleSectionEditability={(section) =>
            setSectionEditability((prev) => ({
              ...prev,
              [section]: !prev[section],
            }))
          }
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          registrationTypes={registrationTypes}
          workingStyles={workingStyles}
        />

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

export default UpdateCompanyPage;
