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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Ledger Name <span className="text-red-500">*</span></label>
        <Input type="text" placeholder="Enter logical entity name" className={errors.ledgerName ? "border-red-500" : ""}
          {...register("ledgerName", { required: "Ledger name is required", minLength: { value: 2, message: "Min 2 characters" } })} />
        {errors.ledgerName && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">{errors.ledgerName.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Account Group <span className="text-red-500">*</span></label>
        <SearchableSelect options={groupOptions} value={selectedGroup?.value}
          onChange={(opt) => { setSelectedGroup(opt); setValue("acgroup", opt?.value || "", { shouldValidate: true }); }}
          placeholder="Categorize entity" />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Parent Hierarchy</label>
        <SearchableSelect options={parentLedgersData?.map((l) => ({ label: l.ledgerName, value: l.id }))}
          value={watch("parentLedger")} onChange={(opt) => setValue("parentLedger", opt?.value || "")} placeholder="Optional parent link" />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Financial Station</label>
        <SearchableSelect options={stationOptions} value={watch("station")} isLoading={stationsLoading}
          onChange={(opt) => setValue("station", opt?.value || "")} placeholder="Geographical locus" />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Opening Balance & Liquidity</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">₹</div>
          <Input type="number" step="0.01" className="flex-1 rounded-r-none pl-10" placeholder="0.00"
            readOnly={!defaultLedgerPermissions.canEditOpeningBalance} {...register("openingBalance")} />
          <Select className="w-24 rounded-l-none border-l-0" {...register("balanceType")}>
            <option value="Debit">DEBIT (DR)</option>
            <option value="Credit">CREDIT (CR)</option>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Settlement Currency</label>
        <Select className="w-full" {...register("currency")}>
          <option value="INR">INDIAN RUPEE (₹)</option>
          <option value="USD">US DOLLAR ($)</option>
          <option value="EUR">EURO (€)</option>
          <option value="GBP">BRITISH POUND (£)</option>
        </Select>
      </div>
      <div className="md:col-span-2 space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Categorization & Memo</label>
        <textarea className="w-full bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm font-bold transition-all no-scrollbar shadow-sm"
          rows="3" placeholder="Additional entity properties or remarks..." {...register("description")} />
      </div>
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 w-fit">
        <input type="checkbox" id="isActive" className="w-5 h-5 text-(--primary-color) border-gray-400 rounded-lg focus:ring-(--primary-color)" {...register("isActive")} />
        <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-(--text-main) cursor-pointer">Entity Operational Status (Active)</label>
      </div>
    </div>
  );

  const renderAddressTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Official Correspondent Email</label>
        <Input type="email" placeholder="correspondence@entity.com" {...register("mailTo")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Primary Nodal Officer</label>
        <Input type="text" placeholder="Authorized Person Name" {...register("contactPerson")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Institutional Email</label>
        <Input type="email" placeholder="official@entity.com" {...register("email")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Mobile Connectivity</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">+91</div>
          <Input type="text" className="flex-1 pl-12" placeholder="00000 00000" {...register("mobile")} />
        </div>
      </div>
      <div className="md:col-span-2 space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Geographical Residency (Address)</label>
        <textarea className="w-full bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm font-bold transition-all no-scrollbar shadow-sm"
          rows="3" placeholder="Registered office or premise location details..." {...register("address")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sovereign State (Country)</label>
        <Input type="text" placeholder="e.g. India" {...register("country")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Provincial Jurisdiction (State)</label>
        <Select className="w-full uppercase" {...register("state")}>
          <option value="">-- DETERMINE STATE --</option>
          {INDIAN_STATES.map(state => <option key={state} value={state}>{state.toUpperCase()}</option>)}
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Urban Center (City)</label>
        <Input type="text" placeholder="City identification" {...register("city")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Postal Index Number (PIN)</label>
        <Input type="text" placeholder="Zip / Pin Code" {...register("pincode")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Digital Payment ID (UPI)</label>
        <Input type="text" placeholder="entity@upi" {...register("upiId")} />
      </div>
    </div>
  );

  const renderGstTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Ledger Classification</label>
        <Select className="w-full" {...register("ledgerType")}>
          <option value="Unregistered">UNREGISTERED</option>
          <option value="Registered">REGISTERED</option>
          <option value="Composition">COMPOSITION</option>
          <option value="Consumer">CONSUMER</option>
          <option value="SEZ">SEZ (SPECIAL ECONOMIC ZONE)</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Statutory Registration Type</label>
        <Select className="w-full" {...register("gstRegistrationType")}>
          <option value="unregistered">UNREGISTERED</option>
          <option value="registered">REGISTERED - REGULAR</option>
          <option value="composition">COMPOSITION SCHEME</option>
          <option value="exempted">EXEMPTED ENTITY</option>
          <option value="sez">SEZ DEVELOPER/UNIT</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Goods & Services Tax Identifier (GSTIN)</label>
        <Input type="text" placeholder="15-DIGIT ALPHANUMERIC" maxLength={15} {...register("gstNo")} className="uppercase" />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Permanent Account Number (PAN)</label>
        <Input type="text" placeholder="ALPHANUMERIC IDENTIFIER" maxLength={10} {...register("panNo")} className="uppercase" />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Tax Deducted at Source (TDS) Applicability</label>
        <Select className="w-full" {...register("tdsApplicable")}>
          <option value="no">NOT APPLICABLE</option>
          <option value="yes">APPLICABLE (YES)</option>
        </Select>
      </div>
      {watchedTdsApplicable === "yes" && (
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Negotiated TDS Levy Rate (%)</label>
          <Input type="number" step="0.01" placeholder="Determined percentage" {...register("tdsRate")} />
        </div>
      )}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">General Tax Applicability</label>
        <Select className="w-full" {...register("taxApplicable")}>
          <option value="no">NOT APPLICABLE (NO)</option>
          <option value="yes">APPLICABLE (YES)</option>
        </Select>
      </div>
    </div>
  );

  const renderLicenseTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Statutory License Number</label>
        <Input type="text" placeholder="Reg. Identifier" {...register("licenseNo")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">License Classification</label>
        <Select className="w-full" {...register("licenseType")}>
          <option value="">-- SELECT CLASSIFICATION --</option>
          <option value="drug">DRUG LICENSE</option>
          <option value="retail">RETAIL LICENSE</option>
          <option value="wholesale">WHOLESALE LICENSE</option>
          <option value="manufacturing">MANUFACTURING LICENSE</option>
          <option value="import">IMPORT LICENSE</option>
          <option value="other">OTHER STATUTORY LICENSE</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Regulatory Expiration Date</label>
        <Input type="date" {...register("expiryDate")} />
      </div>
    </div>
  );

  const renderBankTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Financial Institution Name</label>
        <Input type="text" placeholder="e.g. State Bank of India" {...register("bankName")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Account Identifier <span className="text-red-500">*</span></label>
        <Input type="text" placeholder="Bank Account Number" {...register("accountNo", { required: showBankDetails ? "Account number is required" : false })} />
        {errors.accountNo && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 px-1 tracking-wider">{errors.accountNo.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">IFSC Code (Swift Alternate)</label>
        <Input type="text" placeholder="11-CHARACTER CODE" maxLength={11} {...register("ifscCode")} className="uppercase text-sm" />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch Nomenclature</label>
        <Input type="text" placeholder="Location Name" {...register("branch")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">RTGS Identifier</label>
        <Input type="text" placeholder="Settlement Number" {...register("rtgsNo")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">MICR Identification</label>
        <Input type="text" placeholder="Magnetic Ink Character Recognition" {...register("micrNo")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Institutional Telephony</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">+91</div>
          <Input type="text" className="flex-1 pl-12" placeholder="Phone Number" {...register("phoneNo")} />
        </div>
      </div>
    </div>
  );

  const renderCashTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Liquid Asset Category</label>
        <Select className="w-full" {...register("cashType")}>
          <option value="">-- SELECT ASSET TYPE --</option>
          <option value="petty">PETTY CASH RESERVES</option>
          <option value="main">MAIN TREASURY CASH</option>
          <option value="counter">FRONT-DESK / COUNTER CASH</option>
          <option value="safe">VAULT / SAFE DEPOSIT</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Physical Asset Location</label>
        <Input type="text" placeholder="Premise or Safe Identification" {...register("cashLocation")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Designated Custodian</label>
        <Input type="text" placeholder="Cashier / Manager Name" {...register("cashierName")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Maximum Retention Limit</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">₹</div>
          <Input type="number" step="0.01" className="flex-1 pl-10" placeholder="0.00" {...register("maxLimit")} />
        </div>
      </div>
    </div>
  );

  const renderPartyTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">External Party Category</label>
        <Select className="w-full" {...register("partyType")}>
          <option value="">-- SELECT PARTY TYPE --</option>
          <option value="customer">RETAIL CUSTOMER</option>
          <option value="supplier">SUPPLY-CHAIN VENDOR</option>
          <option value="distributor">REGIONAL DISTRIBUTOR</option>
          <option value="wholesaler">WHOLE-SALE OPERATOR</option>
          <option value="retailer">RETAILER PARTNER</option>
          <option value="branch">INTERNAL BRANCH ENTITY</option>
          <option value="ecommerce">E-COMMERCE CHANNEL</option>
          <option value="fieldstaff">FIELD REPRESENTATIVE</option>
          <option value="hospital">HEALTHCARE INSTITUTION</option>
          <option value="clinic">MEDICAL CLINIC</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Approved Credit Allocation</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">₹</div>
          <Input type="number" step="0.01" className="flex-1 pl-10" placeholder="0.00" {...register("creditLimit")} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Permissible Credit Tenure (Days)</label>
        <Input type="number" placeholder="Days until settlement" {...register("creditDays")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Contractual Settlement Terms</label>
        <Select className="w-full" {...register("paymentTerms")}>
          <option value="">-- DEFINE PAYMENT CYCLE --</option>
          <option value="immediate">IMMEDIATE SETTLEMENT</option>
          <option value="7days">NET 7 DAYS</option>
          <option value="15days">NET 15 DAYS</option>
          <option value="30days">MONTHLY (30 DAYS)</option>
          <option value="45days">QUARTER-MID (45 DAYS)</option>
          <option value="60days">BIMONTHLY (60 DAYS)</option>
          <option value="90days">QUARTERLY (90 DAYS)</option>
          <option value="custom">BESPOKE CUSTOM TERMS</option>
        </Select>
      </div>
    </div>
  );

  const renderAssetTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Fixed Asset Category</label>
        <Select className="w-full" {...register("assetType")}>
          <option value="">-- SELECT ASSET CATEGORY --</option>
          <option value="land">REAL ESTATE / LAND</option>
          <option value="building">COMMERCIAL BUILDING</option>
          <option value="machinery">PLANT & HEAVY MACHINERY</option>
          <option value="furniture">FURNITURE & OFFICE FIXTURES</option>
          <option value="vehicle">LOGISTICS / VEHICLES</option>
          <option value="computer">IT HARDWARE & EQUIPMENT</option>
          <option value="intangible">INTANGIBLE INTELLECTUAL ASSETS</option>
          <option value="other">MISCELLANEOUS FIXED ASSET</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Capital Acquisition Date</label>
        <Input type="date" {...register("purchaseDate")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Depreciation Allowance (%)</label>
        <Input type="number" step="0.01" placeholder="Annual rate" {...register("depreciationRate")} />
      </div>
    </div>
  );

  const renderInvestmentTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Investment Instrument</label>
        <Select className="w-full" {...register("investmentType")}>
          <option value="">-- SELECT INSTRUMENT --</option>
          <option value="fd">FIXED DEPOSIT (FD)</option>
          <option value="rd">RECURRING DEPOSIT (RD)</option>
          <option value="shares">EQUITY SHARES</option>
          <option value="bonds">DEBT BONDS</option>
          <option value="mutual_fund">MUTUAL FUND UNITS</option>
          <option value="nsc">NATIONAL SAVINGS CERTIFICATE</option>
          <option value="ppf">PUBLIC PROVIDENT FUND</option>
          <option value="other">OTHER FINANCIAL INVESTMENT</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Initial Allocation Date</label>
        <Input type="date" {...register("investmentDate")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Terms Expiration (Maturity)</label>
        <Input type="date" {...register("maturityDate")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Yield / Interest Rate (%)</label>
        <Input type="number" step="0.01" placeholder="Return Percentage" {...register("interestRate")} />
      </div>
    </div>
  );

  const renderLoanTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Liability / Loan Category</label>
        <Select className="w-full" {...register("loanType")}>
          <option value="">-- SELECT LIABILITY TYPE --</option>
          <option value="term">LONG-TERM LOAN</option>
          <option value="working_capital">WORKING CAPITAL CREDIT</option>
          <option value="overdraft">BANK OVERDRAFT (OD)</option>
          <option value="vehicle">VEHICLE FINANCING</option>
          <option value="property">MORTGAGE / PROPERTY LOAN</option>
          <option value="personal">PERSONAL BORROWING</option>
          <option value="other">OTHER FINANCIAL LIABILITY</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Lending Agency / Individual</label>
        <Input type="text" placeholder="Lender Identification" {...register("lenderName")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Principal Loan Amount</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">₹</div>
          <Input type="number" step="0.01" className="flex-1 pl-10" placeholder="0.00" {...register("loanAmount")} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Interest Obligation Rate (%)</label>
        <Input type="number" step="0.01" placeholder="Interest %" {...register("interestRate")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Disbursement Date</label>
        <Input type="date" {...register("loanStartDate")} />
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Maturity / Closure Date</label>
        <Input type="date" {...register("loanEndDate")} />
      </div>
    </div>
  );

  const renderExpenseTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Operational Expense Category</label>
        <Select className="w-full uppercase" {...register("expenseCategory")}>
          <option value="">-- CATEGORIZE EXPENDITURE --</option>
          <option value="direct">DIRECT OPERATIONAL EXPENSE</option>
          <option value="indirect">INDIRECT ADMINISTRATIVE EXPENSE</option>
          <option value="administrative">CORE ADMINISTRATIVE COST</option>
          <option value="selling">SELLING & DISTRIBUTION LEVY</option>
          <option value="financial">FINANCIAL / BANKING CHARGES</option>
          <option value="other">MISCELLANEOUS EXPENDITURE</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Specific Expenditure Type</label>
        <Select className="w-full uppercase" {...register("expenseType")}>
          <option value="">-- DEFINE COST TYPE --</option>
          <option value="salary">SALARY & STAFF REMUNERATION</option>
          <option value="rent">PREMISE RENT / LEASE</option>
          <option value="utilities">CORE UTILITIES (POWER/WATER)</option>
          <option value="travel">LOGISTICS & CORPORATE TRAVEL</option>
          <option value="maintenance">REPAIRS & MAINTENANCE</option>
          <option value="insurance">RISK INSURANCE PREMIUM</option>
          <option value="depreciation">ASSET DEPRECIATION</option>
          <option value="interest">BORROWING INTEREST</option>
          <option value="other">OTHER SPECIFIC COST</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Authorized Budgetary Allocation</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">₹</div>
          <Input type="number" step="0.01" className="flex-1 pl-10" placeholder="0.00" {...register("budgetAmount")} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Recurrence Interval (Frequency)</label>
        <Select className="w-full uppercase" {...register("expenseFrequency")}>
          <option value="">-- SELECT RECURRENCE --</option>
          <option value="daily">DIURNAL (DAILY)</option>
          <option value="weekly">SEPTENARY (WEEKLY)</option>
          <option value="monthly">MENSAL (MONTHLY)</option>
          <option value="quarterly">TRIMESTRIAL (QUARTERLY)</option>
          <option value="yearly">ANNUAL (YEARLY)</option>
          <option value="one_time">AD-HOC (ONE TIME)</option>
        </Select>
      </div>
    </div>
  );

  const renderIncomeTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Revenue Inflow Category</label>
        <Select className="w-full uppercase" {...register("incomeCategory")}>
          <option value="">-- CATEGORIZE REVENUE --</option>
          <option value="direct">DIRECT OPERATIONAL REVENUE</option>
          <option value="indirect">INDIRECT / ACCRUED INCOME</option>
          <option value="operating">CORE OPERATING REVENUE</option>
          <option value="non_operating">NON-OPERATING INFLOW</option>
          <option value="other">MISCELLANEOUS REVENUE</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Specific Income Classification</label>
        <Select className="w-full uppercase" {...register("incomeType")}>
          <option value="">-- DEFINE INFLOW SOURCE --</option>
          <option value="sales">PRIMARY GOODS SALES</option>
          <option value="service">CORE SERVICE CHARGES</option>
          <option value="commission">BROKERAGE / COMMISSION</option>
          <option value="interest">INVESTMENT INTEREST</option>
          <option value="dividend">EQUITY DIVIDENDS</option>
          <option value="rent">REAL ESTATE RENTAL INCOME</option>
          <option value="discount">TRADE DISCOUNTS ACCRUED</option>
          <option value="other">OTHER SPECIFIC SOURCE</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Anticipated Inflow Projection</label>
        <div className="flex gap-0 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 font-bold text-sm pointer-events-none">₹</div>
          <Input type="number" step="0.01" className="flex-1 pl-10" placeholder="0.00" {...register("expectedAmount")} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Expected Inflow Frequency</label>
        <Select className="w-full uppercase" {...register("incomeFrequency")}>
          <option value="">-- SELECT RECURRENCE --</option>
          <option value="daily">DIURNAL (DAILY)</option>
          <option value="weekly">SEPTENARY (WEEKLY)</option>
          <option value="monthly">MENSAL (MONTHLY)</option>
          <option value="quarterly">TRIMESTRIAL (QUARTERLY)</option>
          <option value="yearly">ANNUAL (YEARLY)</option>
          <option value="one_time">AD-HOC (ONE TIME)</option>
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
    <div className="flex flex-col min-h-screen bg-(--bg-main) p-4 tracking-tight">
      <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto w-full border border-gray-100 dark:border-white/5 transition-all duration-500">
        <div className="flex items-center justify-between sticky top-0 z-10 bg-(--card-bg) border-b border-gray-200 dark:border-white/5 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-(--primary-color)/10 rounded-2xl">
                <div className="w-8 h-8 flex items-center justify-center font-black text-(--primary-color) text-xl italic uppercase">
                  {isEditMode ? "E" : "C"}
                </div>
             </div>
             <div>
                <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main) leading-none uppercase">
                  {isEditMode ? "EDIT LEDGER" : "CREATE LEDGER"}
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure financial entity details</p>
             </div>
          </div>
          <Button type="button" variant="secondary" onClick={handleBack} className="rounded-xl font-black uppercase tracking-widest text-[10px]">
            &#8592; Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-(--sidebar-active-bg)/30 p-2 rounded-2xl border border-gray-200 dark:border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "bg-(--primary-color) text-white shadow-lg shadow-(--primary-color)/20 scale-105 z-10"
                    : "text-gray-400 hover:text-(--text-main) hover:bg-white/50 dark:hover:bg-white/5"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px] p-8 rounded-3xl bg-(--sidebar-active-bg)/20 border border-gray-200 dark:border-white/5 overflow-hidden transition-all duration-300">
            {renderTabContent()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-white/5">
            <div className="flex gap-4">
              {selectedGroup && !isCashInHand && (
                <Button 
                  type="button" 
                  variant="outline" 
                   className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                  onClick={() => showToast("GST verification feature coming soon", "info")}
                >
                  Verify GST Network
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="secondary" onClick={handleClear} disabled={isLoading} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                F9 Reset
              </Button>
              <Button type="submit" loading={isLoading} disabled={isLoading || isReadOnly()} className="h-12 px-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-(--primary-color)/20">
                F10 Commit Record
              </Button>
              <Button type="button" variant="danger" onClick={handleBack} disabled={isLoading} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                Esc Close
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLedger;
