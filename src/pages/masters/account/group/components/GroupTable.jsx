import React from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import Button from '../../../../../components/common/Button';
import IconButton from '../../../../../components/common/IconButton';
import {showToast} from '../../../../../components/common/Toast';

const GroupTable = ({ 
  groups, 
  expandedGroups, 
  selectedGroup, 
  onToggleExpanded, 
  onRowClick, 
  onEdit, 
  onDelete,
  updatingGroup,
  deletingGroup 
}) => {
  const handleEditClick = (group, e) => {
    if (group.isDefault) {
      e.preventDefault();
      e.stopPropagation();
      Toast.error('You cannot edit predefined/default groups');
      return;
    }
    onEdit(group, e);
  };

  const handleDeleteClick = (group, e) => {
    if (group.isDefault) {
      e.preventDefault();
      e.stopPropagation();
      Toast.error('You cannot delete predefined/default groups');
      return;
    }
    onDelete(group, e);
  };

  const renderGroupRow = (group, level = 0) => {
    const isExpanded = expandedGroups.has(group.id);
    const hasChildren = group.children && group.children.length > 0;
    const isDefault = group.isDefault;
    const isSelected = selectedGroup?.id === group.id;

    return (
      <React.Fragment key={group.id}>
        <tr 
          className={`group-row ${isDefault ? 'default-group' : 'custom-group'} ${isSelected ? 'selected' : ''}`}
          onClick={() => onRowClick(group)}
        >
          <td className="name-cell">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <IconButton
                  icon={isExpanded ? ChevronDown : ChevronRight}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpanded(group.id);
                  }}
                  variant="ghost"
                  size="sm"
                  title={isExpanded ? "Collapse" : "Expand"}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 mr-2"
                />
              ) : (
                <div className="w-6 mr-2" />
              )}
              
              <span className={`group-name ${isDefault ? 'font-semibold' : ''}`}>
                {group.groupName}
              </span>
              
              {group.groupType && (
                <span className="group-type-badge">
                  {group.groupType}
                </span>
              )}
            </div>
          </td>
          <td className="action-cell">
            <div className="flex items-center space-x-2">
              <IconButton
                icon={Edit}
                onClick={(e) => handleEditClick(group, e)}
                variant="outline"
                size="sm"
                disabled={updatingGroup || isDefault}
                title={isDefault ? "Default groups cannot be edited" : "Edit group"}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300"
              />
              
              <IconButton
                icon={Trash2}
                onClick={(e) => handleDeleteClick(group, e)}
                variant="outline"
                size="sm"
                disabled={deletingGroup || isDefault}
                title={isDefault ? "Default groups cannot be deleted" : "Delete group"}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              />
            </div>
          </td>
        </tr>
        
        
        {hasChildren && isExpanded && group.children.map(child => renderGroupRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.length > 0 ? (
              groups.map(group => renderGroupRow(group))
            ) : (
              <tr>
                <td colSpan="2" className="empty-state">
                  <p>No groups found. Create your first group to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTable; 