import { useState } from "react";
import {
  useGetGroupHierarchyQuery,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useCreateGroupMutation,
  useGetAvailableParentsQuery,
} from "../../../../../services/groupApi";
import { showToast } from "../../../../../components/common/Toast";
import { useSelector } from "react-redux";

export const useGroupManagement = () => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({
    groupName: "",
    parentGroupId: "",
    prohibit: "No",
    groupType: "",
  });

  const { currentCompany } = useSelector((state) => state.user);

  const { data: groups = [], isLoading, error } = useGetGroupHierarchyQuery(currentCompany?.id, {
    skip: !currentCompany?.id,
  });

  const { data: availableParents = [], isLoading: parentsLoading } =
    useGetAvailableParentsQuery(currentCompany?.id, {
      skip: !currentCompany?.id,
    });

  const [deleteGroup, { isLoading: deletingGroup }] = useDeleteGroupMutation();
  const [updateGroup, { isLoading: updatingGroup }] = useUpdateGroupMutation();
  const [createGroup, { isLoading: creatingGroup }] = useCreateGroupMutation();

  const toggleExpanded = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleRowClick = (group) => {
    setSelectedGroup(group);
  };

  const handleEdit = (group, e) => {
    e.stopPropagation();

    if (group.isDefault) {
      showToast("You cannot edit predefined/default groups", {
        type: "warning",
      });
      return;
    }

    setSelectedGroup(group);
    setEditFormData({
      groupName: group.groupName,
      prohibit: group.prohibit || "No",
      parentGroupId: group.parentGroupId || "",
      groupType: group.groupType || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (group, e) => {
    e.stopPropagation();

    if (group.isDefault) {
      showToast("You cannot delete predefined/default groups", {
        type: "warning",
      });
      return;
    }

    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const handleUpdateGroup = async () => {
    try {
      await updateGroup({ id: selectedGroup.id, ...editFormData }).unwrap();
      showToast("Group updated successfully");
      setShowEditModal(false);
      setSelectedGroup(null);
    } catch (error) {
      const message = error?.data?.message || "Failed to update group";
      showToast(message);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await createGroup(createFormData).unwrap();
      showToast("Group created successfully");
      setShowCreateModal(false);
      resetCreateForm();
    } catch (error) {
      const message = error?.data?.message || "Failed to create group";
      showToast(message, { type: "error" });
    }
  };

  const resetCreateForm = () => {
    setCreateFormData({
      groupName: "",
      parentGroupId: "",
      prohibit: "No",
      groupType: "",
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedGroup(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetCreateForm();
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      await deleteGroup(groupToDelete.id).unwrap();
      showToast("Group deleted successfully", { type: "success" });
      if (selectedGroup?.id === groupToDelete.id) {
        setSelectedGroup(null);
      }
      closeDeleteModal();
    } catch (error) {
      const message = error?.data?.message || "Failed to delete group";
      showToast(message, { type: "error" });
    }
  };

  return {
    groups,
    isLoading,
    error,
    availableParents,
    parentsLoading,
    expandedGroups,
    selectedGroup,
    showEditModal,
    showCreateModal,
    showDeleteModal,
    groupToDelete,
    editFormData,
    createFormData,
    deletingGroup,
    updatingGroup,
    creatingGroup,

    toggleExpanded,
    handleRowClick,
    handleEdit,
    handleDelete,
    handleUpdateGroup,
    handleCreateGroup,
    confirmDelete,
    setEditFormData,
    setCreateFormData,
    closeEditModal,
    closeCreateModal,
    closeDeleteModal,
    openCreateModal,
  };
};
