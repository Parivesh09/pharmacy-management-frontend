import React, { useState } from 'react';
import {
  useGetGroupHierarchyQuery,
  useGetGroupsQuery,
  useGetGroupsByTypeQuery,
  useGetAvailableParentsQuery,
  useGetGroupByIdQuery,
  useSearchGroupsQuery,
  useGetGroupStatsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useBulkCreateGroupsMutation,
  useExportGroupsMutation,
  useImportGroupsMutation,
  useMoveGroupMutation,
  useDuplicateGroupMutation,
  useGetGroupPermissionsQuery,
  useSetGroupPermissionMutation,
  useApplyPermissionTemplateMutation,
  useGetGroupLedgersQuery,
  useCreateGroupLedgerMutation,
  useUpdateGroupLedgerMutation,
  useDeleteGroupLedgerMutation,
} from '../../../../services/groupApi';
import Button from '../../../../components/common/Button';
import { Toast, showToast } from '../../../../components/common/Toast';

const GroupApiExample = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const { 
    data: hierarchy = [], 
    isLoading: hierarchyLoading, 
    error: hierarchyError,
    refetch: refetchHierarchy 
  } = useGetGroupHierarchyQuery();


  const { 
    data: groups = [], 
    isLoading: groupsLoading 
  } = useGetGroupsQuery({
    page: 1,
    limit: 10,
    search: searchTerm,
    filters: { groupType: 'Asset' }
  });


  const { 
    data: assetGroups = [] 
  } = useGetGroupsByTypeQuery('Asset');


  const { 
    data: availableParents = [] 
  } = useGetAvailableParentsQuery();


  const { 
    data: selectedGroup,
    isLoading: selectedGroupLoading 
  } = useGetGroupByIdQuery(selectedGroupId, {
    skip: !selectedGroupId
  });


  const { 
    data: searchResults = [] 
  } = useSearchGroupsQuery({
    search: searchTerm,
    groupType: 'Asset'
  });


  const { 
    data: groupStats = {} 
  } = useGetGroupStatsQuery();


  const [createGroup, { isLoading: creatingGroup }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: updatingGroup }] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: deletingGroup }] = useDeleteGroupMutation();
  const [bulkCreateGroups, { isLoading: bulkCreating }] = useBulkCreateGroupsMutation();
  const [exportGroups, { isLoading: exportingGroups }] = useExportGroupsMutation();
  const [importGroups, { isLoading: importingGroups }] = useImportGroupsMutation();
  const [moveGroup, { isLoading: movingGroup }] = useMoveGroupMutation();
  const [duplicateGroup, { isLoading: duplicatingGroup }] = useDuplicateGroupMutation();


  const { 
    data: groupPermissions = [] 
  } = useGetGroupPermissionsQuery(selectedGroupId, {
    skip: !selectedGroupId
  });

  const [setGroupPermission] = useSetGroupPermissionMutation();
  const [applyPermissionTemplate] = useApplyPermissionTemplateMutation();


  const { 
    data: groupLedgers = [] 
  } = useGetGroupLedgersQuery(selectedGroupId, {
    skip: !selectedGroupId
  });

  const [createGroupLedger] = useCreateGroupLedgerMutation();
  const [updateGroupLedger] = useUpdateGroupLedgerMutation();
  const [deleteGroupLedger] = useDeleteGroupLedgerMutation();


  const handleCreateGroup = async () => {
    try {
      const newGroup = {
        groupName: 'Test Group',
        groupType: 'Asset',
        description: 'Test description',
        parentGroupId: null
      };
      
      const result = await createGroup(newGroup).unwrap();
      showToast('Group created successfully');
      console.log('Created group:', result);
    } catch (error) {
      Toast.error('Failed to create group');
      console.error('Error:', error);
    }
  };

  const handleUpdateGroup = async () => {
    if (!selectedGroupId) return;
    
    try {
      const updatedData = {
        groupName: 'Updated Group Name',
        description: 'Updated description'
      };
      
      const result = await updateGroup({ id: selectedGroupId, ...updatedData }).unwrap();
      showToast('Group updated successfully');
      console.log('Updated group:', result);
    } catch (error) {
      Toast.error('Failed to update group');
      console.error('Error:', error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupId) return;
    
    try {
      await deleteGroup(selectedGroupId).unwrap();
      showToast('Group deleted successfully', { type: 'success' });
      setSelectedGroupId(null);
    } catch (error) {
      showToast('Failed to delete group', { type: 'error' });
      console.error('Error:', error);
    }
  };

  const handleBulkCreate = async () => {
    try {
      const groupsToCreate = [
        { groupName: 'Bulk Group 1', groupType: 'Asset' },
        { groupName: 'Bulk Group 2', groupType: 'Liability' },
        { groupName: 'Bulk Group 3', groupType: 'Income' }
      ];
      
      const result = await bulkCreateGroups(groupsToCreate).unwrap();
      showToast('Groups created successfully');
      console.log('Bulk created groups:', result);
    } catch (error) {
      Toast.error('Failed to create groups');
      console.error('Error:', error);
    }
  };

  const handleExportGroups = async () => {
    try {
      const result = await exportGroups({ format: 'json' }).unwrap();
      showToast('Groups exported successfully');
      

      const blob = new Blob([JSON.stringify(result.data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'groups-export.json';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Toast.error('Failed to export groups');
      console.error('Error:', error);
    }
  };

  const handleMoveGroup = async () => {
    if (!selectedGroupId) return;
    
    try {
      const newParentId = availableParents[0]?.id || null;
      const result = await moveGroup({ groupId: selectedGroupId, newParentId }).unwrap();
      showToast('Group moved successfully');
      console.log('Moved group:', result);
    } catch (error) {
      Toast.error('Failed to move group');
      console.error('Error:', error);
    }
  };

  const handleDuplicateGroup = async () => {
    if (!selectedGroupId) return;
    
    try {
      const result = await duplicateGroup({
        groupId: selectedGroupId,
        newName: 'Duplicated Group',
        newParentId: null
      }).unwrap();
      showToast('Group duplicated successfully');
      console.log('Duplicated group:', result);
    } catch (error) {
      Toast.error('Failed to duplicate group');
      console.error('Error:', error);
    }
  };

  const handleSetPermission = async () => {
    if (!selectedGroupId) return;
    
    try {
      const permissions = {
        canCreateLedger: true,
        canEditLedger: true,
        canDeleteLedger: false,
        canViewLedger: true,
        canCreateTransaction: true,
        canEditTransaction: true,
        canDeleteTransaction: false,
        canViewTransaction: true,
        canViewReport: true,
        canExportReport: false,
        canViewBalance: true,
        canModifyBalance: false,
        canCreateSubGroup: true,
        canEditGroup: true,
        canDeleteGroup: false,
        canSetOpeningBalance: false
      };
      
      const result = await setGroupPermission({
        groupId: selectedGroupId,
        userId: 1,
        permissions
      }).unwrap();
      showToast('Permissions set successfully');
      console.log('Set permissions:', result);
    } catch (error) {
      Toast.error('Failed to set permissions');
      console.error('Error:', error);
    }
  };

  const handleCreateLedger = async () => {
    if (!selectedGroupId) return;
    
    try {
      const ledgerData = {
        ledgerName: 'Test Ledger',
        openingBalance: 1000.00,
        balanceType: 'Debit',
        description: 'Test ledger description'
      };
      
      const result = await createGroupLedger({
        groupId: selectedGroupId,
        ledgerData
      }).unwrap();
      showToast('Ledger created successfully');
      console.log('Created ledger:', result);
    } catch (error) {
      Toast.error('Failed to create ledger');
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">RTK Query Group API Examples</h1>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Group Hierarchy</h3>
          {hierarchyLoading ? (
            <p>Loading...</p>
          ) : hierarchyError ? (
            <p className="text-red-500">Error loading hierarchy</p>
          ) : (
            <div>
              <p className="text-sm text-gray-600">Total groups: {hierarchy.length}</p>
              <Button onClick={refetchHierarchy} size="sm" className="mt-2">
                Refresh
              </Button>
            </div>
          )}
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Groups</h3>
          {groupsLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <p className="text-sm text-gray-600">Total: {groups.length}</p>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2 w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          )}
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Asset Groups</h3>
          <p className="text-sm text-gray-600">Total: {assetGroups.length}</p>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Available Parents</h3>
          <p className="text-sm text-gray-600">Total: {availableParents.length}</p>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Group Statistics</h3>
          <div className="text-sm text-gray-600">
            <p>Total Groups: {groupStats.totalGroups || 0}</p>
            <p>Asset Groups: {groupStats.assetGroups || 0}</p>
            <p>Liability Groups: {groupStats.liabilityGroups || 0}</p>
          </div>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Selected Group</h3>
          <input
            type="number"
            placeholder="Enter group ID"
            value={selectedGroupId || ''}
            onChange={(e) => setSelectedGroupId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-2 py-1 border rounded text-sm"
          />
          {selectedGroupLoading ? (
            <p className="mt-2 text-sm">Loading...</p>
          ) : selectedGroup ? (
            <div className="mt-2 text-sm">
              <p><strong>Name:</strong> {selectedGroup.groupName}</p>
              <p><strong>Type:</strong> {selectedGroup.groupType}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No group selected</p>
          )}
        </div>
      </div>

      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={handleCreateGroup} 
            disabled={creatingGroup}
            loading={creatingGroup}
            size="sm"
          >
            Create Group
          </Button>
          
          <Button 
            onClick={handleUpdateGroup} 
            disabled={!selectedGroupId || updatingGroup}
            loading={updatingGroup}
            size="sm"
          >
            Update Group
          </Button>
          
          <Button 
            onClick={handleDeleteGroup} 
            disabled={!selectedGroupId || deletingGroup}
            loading={deletingGroup}
            size="sm"
            variant="outline"
          >
            Delete Group
          </Button>
          
          <Button 
            onClick={handleBulkCreate} 
            disabled={bulkCreating}
            loading={bulkCreating}
            size="sm"
          >
            Bulk Create
          </Button>
          
          <Button 
            onClick={handleExportGroups} 
            disabled={exportingGroups}
            loading={exportingGroups}
            size="sm"
          >
            Export Groups
          </Button>
          
          <Button 
            onClick={handleMoveGroup} 
            disabled={!selectedGroupId || movingGroup}
            loading={movingGroup}
            size="sm"
          >
            Move Group
          </Button>
          
          <Button 
            onClick={handleDuplicateGroup} 
            disabled={!selectedGroupId || duplicatingGroup}
            loading={duplicatingGroup}
            size="sm"
          >
            Duplicate Group
          </Button>
          
          <Button 
            onClick={handleSetPermission} 
            disabled={!selectedGroupId}
            size="sm"
          >
            Set Permissions
          </Button>
          
          <Button 
            onClick={handleCreateLedger} 
            disabled={!selectedGroupId}
            size="sm"
          >
            Create Ledger
          </Button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Search Results</h3>
          <div className="space-y-1">
            {searchResults.slice(0, 5).map((group) => (
              <div key={group.id} className="text-sm p-2 bg-gray-50 rounded">
                {group.groupName} ({group.groupType})
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Group Permissions</h3>
          <div className="space-y-1">
            {groupPermissions.slice(0, 5).map((permission, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                User {permission.userId}: {permission.canCreateLedger ? '✓' : '✗'} Create
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Group Ledgers</h3>
          <div className="space-y-1">
            {groupLedgers.slice(0, 5).map((ledger) => (
              <div key={ledger.id} className="text-sm p-2 bg-gray-50 rounded">
                {ledger.ledgerName} - {ledger.openingBalance}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupApiExample; 