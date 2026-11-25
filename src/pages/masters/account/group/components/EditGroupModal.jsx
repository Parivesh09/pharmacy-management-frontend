import React from 'react';
import Modal from '../../../../../components/common/Modal';
import Button from '../../../../../components/common/Button';
import Input from '../../../../../components/common/Input';
import Select from '../../../../../components/common/Select';

const EditGroupModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  onFormChange, 
  onSubmit, 
  updatingGroup 
}) => {
  const groupTypes = [
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
    { value: 'Income', label: 'Income' },
    { value: 'Expense', label: 'Expense' },
    { value: 'Capital', label: 'Capital' }
  ];

  const prohibitOptions = [
    { value: 'No', label: 'No' },
    { value: 'Yes', label: 'Yes' }
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Edit Group"
      className="max-w-lg"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.groupName || ''}
            onChange={(e) => onFormChange({ ...formData, groupName: e.target.value })}
            placeholder="Enter group name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.groupType || ''}
            onChange={(e) => onFormChange({ ...formData, groupType: e.target.value })}
            required
          >
            <option value="">Select Group Type</option>
            {groupTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prohibited
          </label>
          <Select
            value={formData.prohibit || 'No'}
            onChange={(e) => onFormChange({ ...formData, prohibit: e.target.value })}
          >
            {prohibitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updatingGroup}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!formData.groupName || !formData.groupType || updatingGroup}
            loading={updatingGroup}
          >
            Update Group
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditGroupModal; 