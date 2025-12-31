import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../componets/common/Button";
import { useForm } from "react-hook-form";
import { showToast } from "../../../../componets/common/Toast";
import { useGetGroupsQuery } from "../../../../services/groupApi";
import {
  useGetLedgerByIdQuery,
  useCreateLedgerMutation,
  useUpdateLedgerMutation,
  useGetLedgersQuery,
} from "../../../../services/ledgerApi";
import { useGetStationsQuery } from "../../../../services/stationApi";
import { flattenGroups } from "../../../../utils/groupUtils";
import Input from "../../../../componets/common/Input";
import Select from "../../../../componets/common/Select";
import SearchableSelect from "../../../../componets/common/SearchableSelect";
import { useLedgerPermissions } from "../../../../hooks/useLedgerPermissions";
import { useDefaultLedgerPermissions } from "../../../../hooks/useDefaultLedgerPermissions";
import DefaultLedgerIndicator from "../../../../componets/common/DefaultLedgerIndicator";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep"
];

const DEFAULT_FORM_VALUES = {
  ledgerName: "",
  acgroup: "",
  parentLedger: "",
  balanceType: "Debit",
  openingBalance: 0,
  description: "",
  isActive: true,
  mailTo: "",
  address: "",
  country: "India",
  pincode: "",
  state: "Delhi",
  city: "",
  currency: "INR",
  station: "",
  ledgerType: "Unregistered",
  panNo: "",
  gstNo: "",
  contactPerson: "",
  email: "",
  mobile: "",
  upiId: "",
  licenseNo: "",
  licenseType: "",
  expiryDate: "",
  accountNo: "",
  rtgsNo: "",
  ifscCode: "",
  branch: "",
  micrNo: "",
  phoneNo: "",
  bankName: "",
  cashType: "",
  cashLocation: "",
  cashierName: "",
  maxLimit: "",
  creditLimit: "",
  creditDays: 0,
  paymentTerms: "",
  partyType: "",
  tdsApplicable: "no",
  tdsRate: "",
  gstRegistrationType: "unregistered",
  assetType: "",
  purchaseDate: "",
  depreciationRate: "",
  investmentType: "",
  investmentDate: "",
  maturityDate: "",
  interestRate: "",
  loanType: "",
  lenderName: "",
  loanAmount: "",
  loanStartDate: "",
  loanEndDate: "",
  expenseCategory: "",
  expenseType: "",
  budgetAmount: "",
  expenseFrequency: "",
  incomeCategory: "",
  incomeType: "",
  expectedAmount: "",
  incomeFrequency: "",
  taxApplicable: "no",
};

const CreateLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("general");

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const watchedGroup = watch("acgroup");
  const watchedTdsApplicable = watch("tdsApplicable");

  const { data: hierarchicalGroups = [], isLoading: groupsLoading } = useGetGroupsQuery({ limit: 100 });
  const flattenedGroups = flattenGroups(hierarchicalGroups);
  const groupOptions = flattenedGroups.map((group) => ({
    label: group.originalGroupName,
    value: group.id,
    groupType: group.groupType,
  }));

  const { data: ledgerData, isLoading: ledgerLoading } = useGetLedgerByIdQuery(id, { skip: !isEditMode });
  const defaultLedgerPermissions = useDefaultLedgerPermissions(ledgerData);
  
  const { data: parentLedgersResponse = [], isLoading: parentLedgersLoading } = useGetLedgersQuery(
    { groupId: watchedGroup, limit: 100 },
    { skip: !watchedGroup }
  );
  const parentLedgersData = parentLedgersResponse.data || [];

  const { data: stationsResponse = [], isLoading: stationsLoading } = useGetStationsQuery({ limit: 100 });
  const stationsData = stationsResponse.data || [];
  const stationOptions = stationsData.map((station) => ({ label: station.name, value: station.id }));

  const [createLedger, { isLoading: createLoading }] = useCreateLedgerMutation();
  const [updateLedger, { isLoading: updateLoading }] = useUpdateLedgerMutation();

  const { isReadOnly } = useLedgerPermissions(selectedGroup);

  // Determine which sections to show based on selected group
  const groupName = selectedGroup?.label?.toLowerCase() || "";
  const groupType = selectedGroup?.groupType?.toLowerCase() || "";
  
  const showBankDetails = groupName.includes("bank") || groupName.includes("account");
  const showCashDetails = groupName.includes("cash") && !groupName.includes("cash-in-hand") && !groupName.includes("cash in hand");
  const showDebtorCreditorDetails = groupName.includes("debtor") || groupName.includes("creditor") || groupName.includes("sundry");
  const showFixedAssetDetails = groupName.includes("fixed") || groupName.includes("asset");
  const showInvestmentDetails = groupName.includes("investment");
  const showLoanDetails = groupName.includes("loan") || groupName.includes("secured") || groupName.includes("unsecured");
  const showExpenseDetails = groupType === "expense" || groupName.includes("expense") || groupName.includes("indirect");
  const showIncomeDetails = groupType === "income" || groupName.includes("income") || groupName.includes("revenue") || groupName.includes("sales");
  const isCashInHand = groupName.includes("cash-in-hand") || groupName.includes("cash in hand");
  const showGstDetails = !isCashInHand && !showBankDetails && !showCashDetails;
  const showLicenseDetails = !isCashInHand;
  const showContactDetails = showDebtorCreditorDetails || groupName.includes("party");

  useEffect(() => {
    if (ledgerData && isEditMode) {
      const formData = { ...DEFAULT_FORM_VALUES };
      Object.keys(formData).forEach(key => {
        if (ledgerData[key] !== undefined && ledgerData[key] !== null) {
          formData[key] = ledgerData[key];
        }
      });
      reset(formData);

      const selectedGroupData = flattenedGroups.find((group) => group.id === ledgerData.acgroup);
      if (selectedGroupData) {
        setSelectedGroup({
          label: selectedGroupData.originalGroupName,
          value: selectedGroupData.id,
          groupType: selectedGroupData.groupType,
        });
      }
    }
  }, [ledgerData, isEditMode, reset, flattenedGroups]);

  const onSubmit = async (data) => {
    try {
      if (!data.ledgerName || data.ledgerName.trim().length < 2) {
        showToast("Ledger name is required and must be at least 2 characters", "error");
        return;
      }
      if (!selectedGroup?.value) {
        showToast("Account group is required", "error");
        return;
      }

      const submitData = { ...data, acgroup: selectedGroup.value, groupId: selectedGroup.value };

      if (isEditMode) {
        await updateLedger({ id, ...submitData }).unwrap();
        showToast("Ledger updated successfully", "success");
      } else {
        await createLedger(submitData).unwrap();
        showToast("Ledger created successfully", "success");
      }
      navigate("/master/account/ledger");
    } catch (error) {
      const errorMessage = error?.data?.message || (isEditMode ? "Failed to update ledger" : "Failed to create ledger");
      showToast(errorMessage, "error");
    }
  };

  const handleClear = () => {
    reset(DEFAULT_FORM_VALUES);
    setSelectedGroup(null);
  };

  const handleBack = () => navigate("/master/account/ledger");

  const isLoading = groupsLoading || ledgerLoading || parentLedgersLoading || stationsLoading || createLoading || updateLoading;

  // Tab configuration
  const tabs = [
    { id: "general", label: "General Info", show: true },
    { id: "address", label: "Address & Contact", show: !!selectedGroup && !isCashInHand },
    { id: "gst", label: "GST/Tax Details", show: showGstDetails },
    { id: "license", label: "License Info", show: showLicenseDetails },
    { id: "bank", label: "Bank Details", show: showBankDetails },
    { id: "cash", label: "Cash Details", show: showCashDetails },
    { id: "party", label: "Party Details", show: showDebtorCreditorDetails },
    { id: "asset", label: "Asset Details", show: showFixedAssetDetails },
    { id: "investment", label: "Investment", show: showInvestmentDetails },
    { id: "loan", label: "Loan Details", show: showLoanDetails },
    { id: "expense", label: "Expense Details", show: showExpenseDetails },
    { id: "income", label: "Income Details", show: showIncomeDetails },
  ].filter(tab => tab.show);

  const renderGeneralTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Name <span className="text-red-500">*</span></label>
        <Input type="text" placeholder="Enter ledger name" className={errors.ledgerName ? "border-red-500" : ""}
          {...register("ledgerName", { required: "Ledger name is required", minLength: { value: 2, message: "Min 2 characters" } })} />
        {errors.ledgerName && <p className="text-red-500 text-xs mt-1">{errors.ledgerName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Group <span className="text-red-500">*</span></label>
        <SearchableSelect options={groupOptions} value={selectedGroup?.value}
          onChange={(opt) => { setSelectedGroup(opt); setValue("acgroup", opt?.value || "", { shouldValidate: true }); }}
          placeholder="Select account group" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Ledger</label>
        <SearchableSelect options={parentLedgersData?.map((l) => ({ label: l.ledgerName, value: l.id }))}
          value={watch("parentLedger")} onChange={(opt) => setValue("parentLedger", opt?.value || "")} placeholder="Select parent ledger" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
        <SearchableSelect options={stationOptions} value={watch("station")} isLoading={stationsLoading}
          onChange={(opt) => setValue("station", opt?.value || "")} placeholder="Select station" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₹</span>
          <Input type="number" step="0.01" className="flex-1 rounded-none" placeholder="0.00"
            readOnly={!defaultLedgerPermissions.canEditOpeningBalance} {...register("openingBalance")} />
          <Select className="w-20 rounded-l-none" {...register("balanceType")}>
            <option value="Debit">Dr</option>
            <option value="Credit">Cr</option>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <Select className="w-full" {...register("currency")}>
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </Select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2" placeholder="Enter description" {...register("description")} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" className="h-4 w-4 text-blue-600 rounded" {...register("isActive")} />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </div>
  );

  const renderAddressTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mail To</label>
        <Input type="email" placeholder="Enter email address" {...register("mailTo")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
        <Input type="text" placeholder="Enter contact person name" {...register("contactPerson")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input type="email" placeholder="Enter email" {...register("email")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
          <Input type="text" className="flex-1 rounded-l-none" placeholder="Enter mobile number" {...register("mobile")} />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2" placeholder="Enter address" {...register("address")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <Input type="text" placeholder="Enter country" {...register("country")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
        <Select className="w-full" {...register("state")}>
          <option value="">Select State</option>
          {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <Input type="text" placeholder="Enter city" {...register("city")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
        <Input type="text" placeholder="Enter pincode" {...register("pincode")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
        <Input type="text" placeholder="Enter UPI ID" {...register("upiId")} />
      </div>
    </div>
  );

  const renderGstTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Type</label>
        <Select className="w-full" {...register("ledgerType")}>
          <option value="Unregistered">Unregistered</option>
          <option value="Registered">Registered</option>
          <option value="Composition">Composition</option>
          <option value="Consumer">Consumer</option>
          <option value="SEZ">SEZ</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GST Registration Type</label>
        <Select className="w-full" {...register("gstRegistrationType")}>
          <option value="unregistered">Unregistered</option>
          <option value="registered">Registered - Regular</option>
          <option value="composition">Composition</option>
          <option value="exempted">Exempted</option>
          <option value="sez">SEZ Developer/Unit</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
        <Input type="text" placeholder="Enter GST number (15 digits)" maxLength={15} {...register("gstNo")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PAN No.</label>
        <Input type="text" placeholder="Enter PAN number" maxLength={10} {...register("panNo")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">TDS Applicable</label>
        <Select className="w-full" {...register("tdsApplicable")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </div>
      {watchedTdsApplicable === "yes" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">TDS Rate (%)</label>
          <Input type="number" step="0.01" placeholder="Enter TDS rate" {...register("tdsRate")} />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Applicable</label>
        <Select className="w-full" {...register("taxApplicable")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </div>
    </div>
  );

  const renderLicenseTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">License No.</label>
        <Input type="text" placeholder="Enter license number" {...register("licenseNo")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
        <Select className="w-full" {...register("licenseType")}>
          <option value="">Select License Type</option>
          <option value="drug">Drug License</option>
          <option value="retail">Retail License</option>
          <option value="wholesale">Wholesale License</option>
          <option value="manufacturing">Manufacturing License</option>
          <option value="import">Import License</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
        <Input type="date" {...register("expiryDate")} />
      </div>
    </div>
  );

  const renderBankTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <Input type="text" placeholder="Enter bank name" {...register("bankName")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account No. <span className="text-red-500">*</span></label>
        <Input type="text" placeholder="Enter account number" {...register("accountNo", { required: showBankDetails ? "Account number is required" : false })} />
        {errors.accountNo && <p className="text-red-500 text-xs mt-1">{errors.accountNo.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
        <Input type="text" placeholder="Enter IFSC code" maxLength={11} {...register("ifscCode")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
        <Input type="text" placeholder="Enter branch name" {...register("branch")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">RTGS No.</label>
        <Input type="text" placeholder="Enter RTGS number" {...register("rtgsNo")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MICR No.</label>
        <Input type="text" placeholder="Enter MICR number" {...register("micrNo")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone No. (Office)</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
          <Input type="text" className="flex-1 rounded-l-none" placeholder="Enter phone number" {...register("phoneNo")} />
        </div>
      </div>
    </div>
  );

  const renderCashTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cash Type</label>
        <Select className="w-full" {...register("cashType")}>
          <option value="">Select Cash Type</option>
          <option value="petty">Petty Cash</option>
          <option value="main">Main Cash</option>
          <option value="counter">Counter Cash</option>
          <option value="safe">Safe Cash</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cash Location</label>
        <Input type="text" placeholder="Enter cash location" {...register("cashLocation")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cashier Name</label>
        <Input type="text" placeholder="Enter cashier name" {...register("cashierName")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Limit</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₹</span>
          <Input type="number" step="0.01" className="flex-1 rounded-l-none" placeholder="0.00" {...register("maxLimit")} />
        </div>
      </div>
    </div>
  );

  const renderPartyTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Party Type</label>
        <Select className="w-full" {...register("partyType")}>
          <option value="">Select Type</option>
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
          <option value="distributor">Distributor</option>
          <option value="wholesaler">Wholesaler</option>
          <option value="retailer">Retailer</option>
          <option value="branch">Branch</option>
          <option value="ecommerce">E-commerce</option>
          <option value="fieldstaff">Field Staff</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₹</span>
          <Input type="number" step="0.01" className="flex-1 rounded-l-none" placeholder="0.00" {...register("creditLimit")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Credit Days</label>
        <Input type="number" placeholder="Enter credit days" {...register("creditDays")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
        <Select className="w-full" {...register("paymentTerms")}>
          <option value="">Select Payment Terms</option>
          <option value="immediate">Immediate</option>
          <option value="7days">7 Days</option>
          <option value="15days">15 Days</option>
          <option value="30days">30 Days</option>
          <option value="45days">45 Days</option>
          <option value="60days">60 Days</option>
          <option value="90days">90 Days</option>
          <option value="custom">Custom</option>
        </Select>
      </div>
    </div>
  );

  const renderAssetTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
        <Select className="w-full" {...register("assetType")}>
          <option value="">Select Asset Type</option>
          <option value="land">Land</option>
          <option value="building">Building</option>
          <option value="machinery">Plant & Machinery</option>
          <option value="furniture">Furniture & Fixtures</option>
          <option value="vehicle">Vehicles</option>
          <option value="computer">Computer & Equipment</option>
          <option value="intangible">Intangible Assets</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
        <Input type="date" {...register("purchaseDate")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Rate (%)</label>
        <Input type="number" step="0.01" placeholder="Enter depreciation rate" {...register("depreciationRate")} />
      </div>
    </div>
  );

  const renderInvestmentTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
        <Select className="w-full" {...register("investmentType")}>
          <option value="">Select Investment Type</option>
          <option value="fd">Fixed Deposit</option>
          <option value="rd">Recurring Deposit</option>
          <option value="shares">Shares</option>
          <option value="bonds">Bonds</option>
          <option value="mutual_fund">Mutual Fund</option>
          <option value="nsc">NSC</option>
          <option value="ppf">PPF</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Investment Date</label>
        <Input type="date" {...register("investmentDate")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Date</label>
        <Input type="date" {...register("maturityDate")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
        <Input type="number" step="0.01" placeholder="Enter interest rate" {...register("interestRate")} />
      </div>
    </div>
  );

  const renderLoanTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
        <Select className="w-full" {...register("loanType")}>
          <option value="">Select Loan Type</option>
          <option value="term">Term Loan</option>
          <option value="working_capital">Working Capital</option>
          <option value="overdraft">Overdraft</option>
          <option value="vehicle">Vehicle Loan</option>
          <option value="property">Property Loan</option>
          <option value="personal">Personal Loan</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lender Name</label>
        <Input type="text" placeholder="Enter lender name" {...register("lenderName")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₹</span>
          <Input type="number" step="0.01" className="flex-1 rounded-l-none" placeholder="0.00" {...register("loanAmount")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
        <Input type="number" step="0.01" placeholder="Enter interest rate" {...register("interestRate")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Start Date</label>
        <Input type="date" {...register("loanStartDate")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan End Date</label>
        <Input type="date" {...register("loanEndDate")} />
      </div>
    </div>
  );

  const renderExpenseTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
        <Select className="w-full" {...register("expenseCategory")}>
          <option value="">Select Category</option>
          <option value="direct">Direct Expense</option>
          <option value="indirect">Indirect Expense</option>
          <option value="administrative">Administrative</option>
          <option value="selling">Selling & Distribution</option>
          <option value="financial">Financial</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
        <Select className="w-full" {...register("expenseType")}>
          <option value="">Select Type</option>
          <option value="salary">Salary & Wages</option>
          <option value="rent">Rent</option>
          <option value="utilities">Utilities</option>
          <option value="travel">Travel</option>
          <option value="maintenance">Maintenance</option>
          <option value="insurance">Insurance</option>
          <option value="depreciation">Depreciation</option>
          <option value="interest">Interest</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₹</span>
          <Input type="number" step="0.01" className="flex-1 rounded-l-none" placeholder="0.00" {...register("budgetAmount")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Frequency</label>
        <Select className="w-full" {...register("expenseFrequency")}>
          <option value="">Select Frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="one_time">One Time</option>
        </Select>
      </div>
    </div>
  );

  const renderIncomeTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Income Category</label>
        <Select className="w-full" {...register("incomeCategory")}>
          <option value="">Select Category</option>
          <option value="direct">Direct Income</option>
          <option value="indirect">Indirect Income</option>
          <option value="operating">Operating Income</option>
          <option value="non_operating">Non-Operating Income</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Income Type</label>
        <Select className="w-full" {...register("incomeType")}>
          <option value="">Select Type</option>
          <option value="sales">Sales</option>
          <option value="service">Service Income</option>
          <option value="commission">Commission</option>
          <option value="interest">Interest Income</option>
          <option value="dividend">Dividend</option>
          <option value="rent">Rent Income</option>
          <option value="discount">Discount Received</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Amount</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₹</span>
          <Input type="number" step="0.01" className="flex-1 rounded-l-none" placeholder="0.00" {...register("expectedAmount")} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Income Frequency</label>
        <Select className="w-full" {...register("incomeFrequency")}>
          <option value="">Select Frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="one_time">One Time</option>
        </Select>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralTab();
      case "address": return renderAddressTab();
      case "gst": return renderGstTab();
      case "license": return renderLicenseTab();
      case "bank": return renderBankTab();
      case "cash": return renderCashTab();
      case "party": return renderPartyTab();
      case "asset": return renderAssetTab();
      case "investment": return renderInvestmentTab();
      case "loan": return renderLoanTab();
      case "expense": return renderExpenseTab();
      case "income": return renderIncomeTab();
      default: return renderGeneralTab();
    }
  };

  return (
    <div className="flex w-full justify-start items-start min-h-[calc(100vh-100px)] bg-gray-100 p-2">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{isEditMode ? "Edit Ledger" : "Create Ledger"}</h1>
            {isEditMode && defaultLedgerPermissions.isDefaultLedger && <DefaultLedgerIndicator ledger={ledgerData} />}
          </div>
          <Button type="button" variant="secondary" onClick={handleBack}>← Back</Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex flex-wrap gap-1 -mb-px">
              {tabs.map((tab) => (
                <button key={tab.id} type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-gray-50">
            {renderTabContent()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              {selectedGroup && !isCashInHand && (
                <Button type="button" variant="success" onClick={() => showToast("GST verification feature coming soon", "info")}>
                  GST Verification
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={handleClear} disabled={isLoading}>F9 Clear</Button>
              <Button type="submit" loading={isLoading} disabled={isLoading || isReadOnly()}>F10 Save</Button>
              <Button type="button" variant="secondary" onClick={handleBack} disabled={isLoading}>Esc Close</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLedger;
