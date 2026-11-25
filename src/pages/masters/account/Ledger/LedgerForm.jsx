import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { showToast } from '../../../../components/common/Toast';
import {
  useCreateLedgerMutation,
  useUpdateLedgerMutation,
  useGetLedgerByIdQuery,
} from '../../../../services/ledgerApi';
import { useGetGroupsQuery } from '../../../../services/groupApi';
import {
  getGroupConfig,
  getDefaultBalanceType,
  validateLedgerData,
} from '../../../../config/ledgerGroupConfig';

const LedgerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCompany } = useSelector((state) => state.user);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    ledgerName: '',
    acgroup: '',
    openingBalance: 0,
    balanceType: 'Debit',
    description: '',
    address: '',
    isActive: true,
    status: 'Active',
    // Additional fields based on group
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    creditDays: 0,
    contactPerson: '',
    mobileNumber: '',
    loanAmount: 0,
    interestRate: 0,
    loanTerm: 0,
    taxType: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedGroupConfig, setSelectedGroupConfig] = useState(null);

  // Queries
  const { data: ledgerData, isLoading: ledgerLoading } = useGetLedgerByIdQuery(id, {
    skip: !id,
  });

  const { data: groupsData, isLoading: groupsLoading } = useGetGroupsQuery({
    companyId: currentCompany?.id,
  });

  const [createLedger, { isLoading: createLoading }] = useCreateLedgerMutation();
  const [updateLedger, { isLoading: updateLoading }] = useUpdateLedgerMutation();

  // Initialize form with ledger data in edit mode
  useEffect(() => {
    if (isEditMode && ledgerData) {
      setFormData({
        ...ledgerData,
        acgroup: ledgerData.acgroup || '',
      });
      if (ledgerData.accountGroup?.groupName) {
        setSelectedGroupConfig(getGroupConfig(ledgerData.accountGroup.groupName));
      }
    }
  }, [ledgerData, isEditMode]);

  // Update balance type when group changes
  useEffect(() => {
    if (formData.acgroup && groupsData) {
      const selectedGroup = groupsData.find((g) => g.id === formData.acgroup);
      if (selectedGroup) {
        const config = getGroupConfig(selectedGroup.groupName);
        setSelectedGroupConfig(config);
        setFormData((prev) => ({
          ...prev,
          balanceType: config.balanceType || 'Debit',
        }));
      }
    }
  }, [formData.acgroup, groupsData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ledgerName.trim()) {
      newErrors.ledgerName = 'Ledger name is required';
    }

    if (!formData.acgroup) {
      newErrors.acgroup = 'Account group is required';
    }

    if (selectedGroupConfig) {
      const configErrors = validateLedgerData(
        groupsData?.find((g) => g.id === formData.acgroup)?.groupName,
        formData
      );
      Object.assign(newErrors, configErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    try {
      const payload = {
        ...formData,
        companyId: currentCompany?.id,
      };

      if (isEditMode) {
        await updateLedger({ id, ...payload }).unwrap();
        showToast('Ledger updated successfully', 'success');
      } else {
        await createLedger(payload).unwrap();
        showToast('Ledger created successfully', 'success');
      }

      navigate('/master/account/ledger');
    } catch (error) {
      showToast(error?.data?.message || 'Failed to save ledger', 'error');
    }
  };

  const renderField = (fieldName, fieldConfig) => {
    if (!selectedGroupConfig?.showFields?.[fieldName]) {
      return null;
    }

    const value = formData[fieldName];
    const error = errors[fieldName];

    switch (fieldConfig.type) {
      case 'number':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name={fieldName}
              value={value}
              onChange={handleInputChange}
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name={fieldName}
              value={value}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500">*</span>}
            </label>
            <select
              name={fieldName}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {fieldConfig.label}</option>
              {fieldConfig.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'text':
      default:
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={fieldName}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
    }
  };

  if (ledgerLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/master/account/ledger')}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Ledger' : 'Create Ledger'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ledger Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ledgerName"
                value={formData.ledgerName}
                onChange={handleInputChange}
                placeholder="Enter ledger name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ledgerName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.ledgerName && (
                <p className="text-red-500 text-sm mt-1">{errors.ledgerName}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Group <span className="text-red-500">*</span>
              </label>
              <select
                name="acgroup"
                value={formData.acgroup}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.acgroup ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Account Group</option>
                {groupsData?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.groupName}
                  </option>
                ))}
              </select>
              {errors.acgroup && (
                <p className="text-red-500 text-sm mt-1">{errors.acgroup}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Balance <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="openingBalance"
                  value={formData.openingBalance}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.openingBalance ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.openingBalance && (
                  <p className="text-red-500 text-sm mt-1">{errors.openingBalance}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance Type
                </label>
                <select
                  name="balanceType"
                  value={formData.balanceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group-Specific Fields */}
          {selectedGroupConfig && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedGroupConfig.fields || {}).map(
                  ([fieldName, fieldConfig]) => {
                    if (
                      fieldName === 'openingBalance' ||
                      fieldName === 'balanceType'
                    ) {
                      return null;
                    }
                    return (
                      <div key={fieldName}>
                        {renderField(fieldName, fieldConfig)}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={createLoading || updateLoading}
              className="flex-1"
            >
              {isEditMode ? 'Update Ledger' : 'Create Ledger'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/master/account/ledger')}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LedgerForm;
