import React, { useState, useEffect, useRef } from "react";
import AddStore from "./AddStore";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import Button from "../../../../components/common/Button";
import { Plus, Database, Package, FileText, Pill } from "lucide-react";
import { useGetStoresQuery } from "../../../../services/storeApi";
import Loader from "../../../../components/common/Loader";
import {
  useEditStoreMutation,
  useDeleteStoreMutation,
} from "../../../../services/storeApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Pagination from '../../../../components/common/Pagination';
import { useDebounce } from '../../../../utils/useDebounce';
import { showToast } from "../../../../components/common/Toast";

const StorePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStoreData, setEditStoreData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, error, isLoading, refetch } = useGetStoresQuery({ page, limit, search: debouncedSearch });
  
  const [editStore] = useEditStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();
  const [selectedStore, setSelectedStore] = useState(null);

  const [cascadeDeleteModalOpen, setCascadeDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [relatedData, setRelatedData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedStore((prev) => {
        if (!prev || !data.data.find((s) => s.id === prev.id)) {
          return data.data[0];
        }
        return prev;
      });
    }
  }, [data]);

  const columns = [{ key: "storename", title: "Store Name" }];

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (row) => {
    setEditStoreData(row);
    setEditModalOpen(true);
  };

  const handleEditSave = async (formData) => {
    try {
      await editStore({ id: editStoreData.id, ...formData });
      setEditModalOpen(false);
      setEditStoreData(null);
      showToast("Store updated successfully!", { type: "success" });
    } catch (error) {
      showToast(error?.data?.message || "Failed to update store", { type: "error" });
    }
  };

  const handleDelete = async (row) => {
    setStoreToDelete(row);
    setIsDeleting(true);
    
    try {
      await deleteStore({ id: row.id, cascade: false }).unwrap();
      showToast("Store deleted successfully!", { type: "success" });
    } catch (error) {
      if (error?.data?.error === "Foreign key constraint violation") {
        setRelatedData({
          relatedRacksCount: error.data.relatedRacksCount || 0,
          relatedItemsCount: error.data.relatedItemsCount || 0,
          relatedBillItemsCount: error.data.relatedBillItemsCount || 0,
          relatedPrescriptionItemsCount: error.data.relatedPrescriptionItemsCount || 0
        });
        setCascadeDeleteModalOpen(true);
        showToast("Store has related data. Please review the deletion options.", { type: "warning" });
      } else {
        showToast(error?.data?.message || "Failed to delete store", { type: "error" });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCascadeDeleteConfirm = async () => {
    if (!storeToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteStore({ id: storeToDelete.id, cascade: true }).unwrap();
      setCascadeDeleteModalOpen(false);
      setStoreToDelete(null);
      setRelatedData(null);
      
      const message = result?.message || "Store and related data deleted successfully!";
      showToast(message, { type: "success" });
    } catch (error) {
      showToast(error?.data?.message || "Failed to delete store and related data", { type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setCascadeDeleteModalOpen(false);
    setStoreToDelete(null);
    setRelatedData(null);
    setIsDeleting(false);
  };

  const handleRowSelect = (row) => {
    setSelectedStore(row);
  };

  const handleKeyDown = (e) => {
    if (!data?.data || data.data.length === 0) return;
    if (!selectedStore) return;
    const idx = data.data.findIndex((s) => s.id === selectedStore.id);
    if (e.key === "ArrowDown") {
      const nextIdx = idx < data.data.length - 1 ? idx + 1 : 0;
      setSelectedStore(data.data[nextIdx]);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prevIdx = idx > 0 ? idx - 1 : data.data.length - 1;
      setSelectedStore(data.data[prevIdx]);
      e.preventDefault();
    }
  };

  return (
    <>
      <CommonPageLayout
        title="Store Management"
        subtitle="Manage your Store"
        actions={[
          <Button key="add" onClick={handleAddItem}>
            <Plus className="w-4 h-4" /> Add Store
          </Button>,
        ]}
        search={search}
        onSearchChange={e => { setSearch(e.target.value); setPage(1); }}
        tableData={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        selectedRow={selectedStore}
        onRowSelect={handleRowSelect}
        onAdd={handleAddItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onArrowNavigation={handleKeyDown}
        rowInfoPanel={
          <>
            <b>Address</b>
            <div className="mt-1 text-gray-700 text-sm">
              {selectedStore?.address1 || (
                <span className="text-gray-400">No address available</span>
              )}
            </div>
          </>
        }
      >
        <Pagination
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      </CommonPageLayout>
      
      <AddStore isOpen={isModalOpen} onClose={handleCloseModal} />
      <AddStore
        initialData={editStoreData}
        onSave={handleEditSave}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditStoreData(null);
        }}
      />
      
      
      <ConfirmationModal
        isOpen={cascadeDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleCascadeDeleteConfirm}
        title="Cascade Delete Store"
        type="danger"
        confirmText="Delete Store & All Data"
        isDeleting={isDeleting}
        size="lg"
      >
        {storeToDelete && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the store{' '}
              <span className="font-semibold text-gray-900">"{storeToDelete.storename}"</span>?
            </p>
            
            {relatedData && (
              relatedData.relatedRacksCount > 0 || 
              relatedData.relatedItemsCount > 0 || 
              relatedData.relatedBillItemsCount > 0 || 
              relatedData.relatedPrescriptionItemsCount > 0
            ) ? (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-red-800">Cascade Delete Warning</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  {relatedData.relatedRacksCount > 0 && (
                    <div className="flex items-center text-red-700">
                      <Database className="w-4 h-4 mr-2" />
                      <span>{relatedData.relatedRacksCount} rack(s) available in this store</span>
                    </div>
                  )}
                  {relatedData.relatedItemsCount > 0 && (
                    <div className="flex items-center text-red-700">
                      <Package className="w-4 h-4 mr-2" />
                      <span>{relatedData.relatedItemsCount} item(s)</span>
                    </div>
                  )}
                  {relatedData.relatedBillItemsCount > 0 && (
                    <div className="flex items-center text-red-700">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{relatedData.relatedBillItemsCount} bill item(s)</span>
                    </div>
                  )}
                  {relatedData.relatedPrescriptionItemsCount > 0 && (
                    <div className="flex items-center text-red-700">
                      <Pill className="w-4 h-4 mr-2" />
                      <span>{relatedData.relatedPrescriptionItemsCount} prescription item(s)</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-red-700 mb-3">
                  This will permanently delete the store and ALL related data above.
                </p>
                
                <p className="text-sm text-red-700 mt-3 font-medium">
                  This action cannot be undone!
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  This store has no related data and can be safely deleted.
                </p>
              </div>
            )}
          </div>
        )}
      </ConfirmationModal>
    </>
  );
};

export default StorePage;
