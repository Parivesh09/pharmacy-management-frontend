import React from 'react';
import Modal from '../../../../../components/common/Modal';
import Button from '../../../../../components/common/Button';
import Input from '../../../../../components/common/Input';
import SearchableSelect from '../../../../../components/common/SearchableSelect';

const CreateGroupModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  onFormChange, 
  onSubmit, 
  availableParents, 
  parentsLoading, 
  creatingGroup 
}) => {
  const prohibitOptions = [
    { value: 'No', label: 'No' },
    { value: 'Yes', label: 'Yes' }
  ];

  const handleParentChange = (option) => {
    const parentId = option?.value || '';
    const parent = availableParents.find(p => p.id == parentId);
    console.log(parent);
    onFormChange({
      ...formData,
      parentGroupId: parentId,
      groupType: parent ? parent.groupType : ''
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Create New Group"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
              Parent Group <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={availableParents.map(parent => ({
                value: parent.id,
                label: `${parent.groupName} (${parent.groupType})`,
                groupType: parent.groupType
              }))}
              value={formData.parentGroupId || ''}
              onChange={handleParentChange}
              placeholder="Search parent group..."
              getOptionLabel={opt => opt.label}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prohibited
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.prohibit || 'No'}
              onChange={(e) => onFormChange({ ...formData, prohibit: e.target.value })}
            >
              {prohibitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={creatingGroup}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!formData.groupName || !formData.parentGroupId || creatingGroup}
            loading={creatingGroup}
          >
            Create Group
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal; 