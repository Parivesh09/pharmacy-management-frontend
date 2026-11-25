import React from "react";
import Button from "../../../../components/common/Button";
import IconButton from "../../../../components/common/IconButton";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useGroupManagement } from "./hooks/useGroupManagement";
import CreateGroupModal from "./components/CreateGroupModal";
import EditGroupModal from "./components/EditGroupModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

const Group = () => {
  const {
    groups,
    expandedGroups,
    selectedGroup,
    isLoading,

    showCreateModal,
    showEditModal,
    showDeleteModal,
    groupToDelete,
    createFormData,
    editFormData,
    availableParents,
    parentsLoading,

    creatingGroup,
    updatingGroup,
    deletingGroup,

    toggleExpanded,
    handleRowClick,
    handleEdit,
    handleDelete,
    handleCreateGroup,
    handleUpdateGroup,
    confirmDelete,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    openCreateModal,
    setEditFormData,
    setCreateFormData,
  } = useGroupManagement();
  
  const renderGroupCard = (group, level = 0) => {
    const hasChildren = group.children && group.children.length > 0;
    const isExpanded = expandedGroups.has(group.id);
    const isSelected = selectedGroup?.id === group.id;

    return (
      <div key={group.id} className="mb-2">
        <div
          className={`
            group-card group-row-level-${level} 
            cursor-pointer transition-all duration-200 hover:shadow-md
            ${isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
            ${level === 0 ? "border-l-4 border-blue-500" : ""}
            ${level === 1 ? "border-l-4 border-green-500" : ""}
            ${level === 2 ? "border-l-4 border-orange-500" : ""}
            ${level >= 3 ? "border-l-4 border-purple-500" : ""}
          `}
          onClick={() => handleRowClick(group)}
          style={{
            marginLeft: `${level * 24}px`,
          }}
        >
          <div className="flex items-center justify-between p-2">
            
            <div className="flex items-center flex-1">
              
              {hasChildren && (
                <IconButton
                  icon={isExpanded ? ChevronDown : ChevronRight}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(group.id);
                  }}
                  variant="outline"
                  size="sm"
                  title={isExpanded ? "Collapse" : "Expand"}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 mr-3"
                />
              )}

              <div className="flex items-center mr-4">
                <div className={`level-indicator-${Math.min(level, 3)}`}></div>
              </div>

              <div className="flex items-center flex-1">
                <span
                  className={`
                    ${group.isDefault ? "font-semibold text-gray-900" : ""}
                    ${level === 0 ? "text-lg font-medium text-gray-800" : ""}
                    ${level === 1 ? "text-base font-medium text-gray-700" : ""}
                    ${level >= 2 ? "text-sm text-gray-600" : ""}
                  `}
                >
                  {group.groupName}
                </span>

                <span
                  className={`
                  ml-3 px-3 py-1 text-xs rounded-full border font-medium
                  ${
                    level === 0
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : ""
                  }
                  ${
                    level === 1
                      ? "bg-green-100 text-green-800 border-green-200"
                      : ""
                  }
                  ${
                    level === 2
                      ? "bg-orange-100 text-orange-800 border-orange-200"
                      : ""
                  }
                  ${
                    level >= 3
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : ""
                  }
                `}
                >
                  {level === 0
                    ? "Primary"
                    : level === 1
                    ? "Sub"
                    : level === 2
                    ? "Sub-Sub"
                    : `${level}rd`}
                </span>

                {group.isDefault && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                    Default
                  </span>
                )}
              </div>
            </div>

            
            <div className="flex items-center space-x-3">
              
              {group.groupType && (
                <span className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-lg border border-gray-200 font-medium">
                  {group.groupType}
                </span>
              )}

              
              <div className="flex items-center space-x-1">
                <IconButton
                  icon={Edit}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(group, { stopPropagation: () => {} });
                  }}
                  variant="outline"
                  title="Edit Group"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                />

                {!group.isDefault && (
                  <IconButton
                    icon={Trash2}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(group, { stopPropagation: () => {} });
                    }}
                    variant="outline"
                    title="Delete Group"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {group.children.map((child) => renderGroupCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 bg-white">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Group Management
              </h1>
            </div>
            <Button
              onClick={openCreateModal}
              startIcon={<Plus className="w-4 h-4" />}
              className="w-full sm:w-auto"
              disabled
            >
              Add Group
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Group Management
              </h1>
            </div>
            <Button
              onClick={openCreateModal}
              startIcon={<Plus className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Add Group
            </Button>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {groups.length === 0 ? (
              <div className="text-center flex flex-col justify-center align-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No groups found
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first accounting group.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={openCreateModal}
                    startIcon={<Plus className="w-4 h-4" />}
                  >
                    Create First Group
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {groups.map((group) => renderGroupCard(group))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        formData={createFormData}
        onFormChange={setCreateFormData}
        onSubmit={handleCreateGroup}
        availableParents={availableParents}
        parentsLoading={parentsLoading}
        creatingGroup={creatingGroup}
      />

      <EditGroupModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        formData={editFormData}
        onFormChange={setEditFormData}
        onSubmit={handleUpdateGroup}
        updatingGroup={updatingGroup}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        group={groupToDelete}
        isDeleting={deletingGroup}
      />
    </>
  );
};

export default Group;
