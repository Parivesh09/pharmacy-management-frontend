import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  Folder, 
  FolderOpen,
  Lock,
  Unlock,
  Users,
  Settings
} from 'lucide-react';
import PageHeader from '../../../../components/common/PageHeader';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import Select from '../../../../components/common/Select';
import Loader from '../../../../components/common/Loader';
import { Toast, showToast } from '../../../../components/common/Toast';
import {
  useGetGroupHierarchyQuery,
  useGetAvailableParentsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupPermissionsQuery,
  useSetGroupPermissionMutation,
} from '../../../../services/groupApi';

const HierarchicalGroupManager = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());


  const [formData, setFormData] = useState({
    groupName: '',
    undergroup: '',
    groupType: '',
    description: '',
    parentGroupId: null,
    parentGroupName: ''
  });

  const groupTypes = [
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
    { value: 'Income', label: 'Income' },
    { value: 'Expense', label: 'Expense' },
    { value: 'Capital', label: 'Capital' }
  ];


  const { 
    data: groups = [], 
    isLoading: groupsLoading, 
    error: groupsError,
    refetch: refetchGroups 
  } = useGetGroupHierarchyQuery();

  const { 
    data: availableParents = [], 
    isLoading: parentsLoading 
  } = useGetAvailableParentsQuery();

  const [createGroup, { isLoading: creatingGroup }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: updatingGroup }] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: deletingGroup }] = useDeleteGroupMutation();


  const { 
    data: groupPermissions = [],
    isLoading: permissionsLoading 
  } = useGetGroupPermissionsQuery(selectedGroup?.id, {
    skip: !selectedGroup?.id
  });

  const [setGroupPermission] = useSetGroupPermissionMutation();

  const handleCreateGroup = async () => {
    try {
      await createGroup(formData).unwrap();
      showToast('Group created successfully');
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      const message = error?.data?.message || 'Failed to create group';
      Toast.error(message);
    }
  };

  const handleEditGroup = async () => {
    try {
      await updateGroup({ id: selectedGroup.id, ...formData }).unwrap();
      showToast('Group updated successfully');
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      const message = error?.data?.message || 'Failed to update group';
      Toast.error(message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteGroup(groupId).unwrap();
      showToast('Group deleted successfully', { type: 'success' });
    } catch (error) {
      const message = error?.data?.message || 'Failed to delete group';
      showToast(message, { type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      groupName: '',
      undergroup: '',
      groupType: '',
      description: '',
      parentGroupId: null,
      parentGroupName: ''
    });
    setSelectedGroup(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setFormData({
      groupName: group.groupName,
      undergroup: group.undergroup,
      groupType: group.groupType,
      description: group.description || '',
      parentGroupId: group.parentGroupId,
      parentGroupName: group.parentGroupName || ''
    });
    setShowEditModal(true);
  };

  const openPermissionModal = (group) => {
    setSelectedGroup(group);
    setShowPermissionModal(true);
  };

  const toggleExpanded = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderGroupTree = (groupList, level = 0) => {
    return groupList.map((group) => {
      const isExpanded = expandedGroups.has(group.id);
      const hasChildren = group.children && group.children.length > 0;
      const canEdit = group.permissions?.canEditGroup;
      const canDelete = group.permissions?.canDeleteGroup;
      const isDefault = group.isDefault;

      return (
        <div key={group.id} className="group-item">
          <div 
            className={`group-row level-${level} ${isDefault ? 'default-group' : 'custom-group'}`}
            style={{ paddingLeft: `${level * 24}px` }}
          >
            <div className="group-content">
              <div className="group-info">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(group.id)}
                    className="expand-button"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <div className="expand-placeholder" />
                )}
                
                <div className="group-icon">
                  {isDefault ? <Lock size={16} /> : <Unlock size={16} />}
                </div>
                
                <div className="group-details">
                  <span className="group-name">{group.groupName}</span>
                  <span className="group-type">{group.groupType}</span>
                  {group.description && (
                    <span className="group-description">{group.description}</span>
                  )}
                </div>
              </div>

              <div className="group-actions">
                {!isDefault && canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(group)}
                    className="action-button"
                    disabled={updatingGroup}
                  >
                    <Edit size={16} />
                  </Button>
                )}
                
                {!isDefault && canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGroup(group.id)}
                    className="action-button delete"
                    disabled={deletingGroup}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openPermissionModal(group)}
                  className="action-button"
                >
                  <Users size={16} />
                </Button>
              </div>
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div className="group-children">
              {renderGroupTree(group.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderCreateModal = () => (
    <Modal
      isOpen={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      title="Create New Group"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Group
            </label>
            <Select
              value={formData.parentGroupId || ''}
              onChange={(e) => {
                const parentId = e.target.value || null;
                const parent = availableParents.find(p => p.id == parentId);
                setFormData({
                  ...formData,
                  parentGroupId: parentId,
                  parentGroupName: parent ? parent.groupName : '',
                  undergroup: parent ? parent.groupName : formData.groupName
                });
              }}
              disabled={parentsLoading}
            >
              <option value="">No Parent (Top Level)</option>
              {availableParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.groupName} ({parent.groupType})
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.groupType}
              onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
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
              Under Group
            </label>
            <Input
              value={formData.undergroup}
              onChange={(e) => setFormData({ ...formData, undergroup: e.target.value })}
              placeholder="Parent group name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter group description"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowCreateModal(false)}
            disabled={creatingGroup}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={!formData.groupName || !formData.groupType || creatingGroup}
            loading={creatingGroup}
          >
            Create Group
          </Button>
        </div>
      </div>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      title="Edit Group"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.groupType}
              onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter group description"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(false)}
            disabled={updatingGroup}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditGroup}
            disabled={!formData.groupName || !formData.groupType || updatingGroup}
            loading={updatingGroup}
          >
            Update Group
          </Button>
        </div>
      </div>
    </Modal>
  );

  const renderPermissionModal = () => (
    <Modal
      isOpen={showPermissionModal}
      onClose={() => setShowPermissionModal(false)}
      title={`Group Permissions - ${selectedGroup?.groupName}`}
      size="xl"
    >
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Group Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {selectedGroup?.groupName}
            </div>
            <div>
              <span className="font-medium">Type:</span> {selectedGroup?.groupType}
            </div>
            <div>
              <span className="font-medium">Parent:</span> {selectedGroup?.undergroup || 'None'}
            </div>
            <div>
              <span className="font-medium">Default:</span> {selectedGroup?.isDefault ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Permission Inheritance</h4>
          <p className="text-sm text-blue-700">
            This group inherits permissions from its parent group. All sub-groups created under this group 
            will automatically inherit the same permissions as this group.
          </p>
        </div>

        {permissionsLoading ? (
          <div className="text-center py-4">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ledger Permissions</h4>
              <div className="space-y-2">
                <PermissionItem label="Create Ledger" value={selectedGroup?.permissions?.canCreateLedger} />
                <PermissionItem label="Edit Ledger" value={selectedGroup?.permissions?.canEditLedger} />
                <PermissionItem label="Delete Ledger" value={selectedGroup?.permissions?.canDeleteLedger} />
                <PermissionItem label="View Ledger" value={selectedGroup?.permissions?.canViewLedger} />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Transaction Permissions</h4>
              <div className="space-y-2">
                <PermissionItem label="Create Transaction" value={selectedGroup?.permissions?.canCreateTransaction} />
                <PermissionItem label="Edit Transaction" value={selectedGroup?.permissions?.canEditTransaction} />
                <PermissionItem label="Delete Transaction" value={selectedGroup?.permissions?.canDeleteTransaction} />
                <PermissionItem label="View Transaction" value={selectedGroup?.permissions?.canViewTransaction} />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Report & Balance Permissions</h4>
              <div className="space-y-2">
                <PermissionItem label="View Report" value={selectedGroup?.permissions?.canViewReport} />
                <PermissionItem label="Export Report" value={selectedGroup?.permissions?.canExportReport} />
                <PermissionItem label="View Balance" value={selectedGroup?.permissions?.canViewBalance} />
                <PermissionItem label="Modify Balance" value={selectedGroup?.permissions?.canModifyBalance} />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Group Management</h4>
              <div className="space-y-2">
                <PermissionItem label="Create Sub-Group" value={selectedGroup?.permissions?.canCreateSubGroup} />
                <PermissionItem label="Edit Group" value={selectedGroup?.permissions?.canEditGroup} />
                <PermissionItem label="Delete Group" value={selectedGroup?.permissions?.canDeleteGroup} />
                <PermissionItem label="Set Opening Balance" value={selectedGroup?.permissions?.canSetOpeningBalance} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => setShowPermissionModal(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );

  if (groupsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hierarchical Group Management"
        subtitle="Manage accounting groups with unlimited hierarchy and permission inheritance"
        actions={[
          <Button
            key="add"
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            disabled={creatingGroup}
          >
            <Plus className="w-4 h-4" />
            Create Group
          </Button>,
        ]}
      />

      {groupsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load groups. Please try again.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Group Hierarchy</h3>
            <p className="text-sm text-gray-600">
              Click the arrow to expand/collapse groups. Default groups are protected and cannot be edited.
            </p>
          </div>

          <div className="group-tree">
            {groups.length > 0 ? (
              renderGroupTree(groups)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No groups found. Create your first group to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {renderCreateModal()}
      {renderEditModal()}
      {renderPermissionModal()}
    </div>
  );
};


const PermissionItem = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
      {value ? '✓ Allowed' : '✗ Denied'}
    </span>
  </div>
);

export default HierarchicalGroupManager; 