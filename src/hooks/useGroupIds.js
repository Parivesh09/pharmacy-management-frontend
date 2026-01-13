import { useMemo } from 'react';
import { useGetGroupHierarchyQuery } from '../services/groupApi';

export const useGroupIds = () => {
  const { data: groups = [] } = useGetGroupHierarchyQuery();

  const groupIds = useMemo(() => {
    if (!groups.length) return { debtorGroupIds: [], creditorGroupIds: [] };

    const findGroupsByPattern = (pattern) => {
      const matchingGroups = [];
      
      const searchGroups = (groupList) => {
        groupList.forEach(group => {
          if (group.groupName && group.groupName.toLowerCase().includes(pattern.toLowerCase())) {
            matchingGroups.push(group.id);
          }
          // Also search in children if they exist
          if (group.children && group.children.length > 0) {
            searchGroups(group.children);
          }
        });
      };

      searchGroups(groups);
      return matchingGroups;
    };

    // Get debtor group IDs (Sundry Debtors and its children)
    const debtorGroupIds = [
      ...findGroupsByPattern('Sundry Debtors'),
      ...findGroupsByPattern('Credit card'),
      ...findGroupsByPattern('Debtor Branch'),
      ...findGroupsByPattern('Debtors (Ecommerce)'),
      ...findGroupsByPattern('Debtors (Field Staff)')
    ];

    // Get creditor group IDs (Sundry Creditors and its children)
    const creditorGroupIds = [
      ...findGroupsByPattern('Sundry Creditors'),
      ...findGroupsByPattern('Creditor Branch'),
      ...findGroupsByPattern('Creditors (Ecommerce)'),
      ...findGroupsByPattern('Creditors (Field Staff)')
    ];

    return {
      debtorGroupIds: [...new Set(debtorGroupIds)], // Remove duplicates
      creditorGroupIds: [...new Set(creditorGroupIds)] // Remove duplicates
    };
  }, [groups]);

  return groupIds;
};