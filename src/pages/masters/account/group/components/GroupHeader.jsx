import React from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../../../../../components/common/PageHeader';
import Button from '../../../../../components/common/Button';

const GroupHeader = ({ onAddGroup, creatingGroup }) => {
  return (
    <PageHeader
      title="Group Management"
      subtitle="Manage accounting groups and hierarchy"
      actions={[
        <Button
          key="add"
          onClick={onAddGroup}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          disabled={creatingGroup}
        >
          <Plus className="w-4 h-4" />
          Add Group
        </Button>,
      ]}
    />
  );
};

export default GroupHeader; 