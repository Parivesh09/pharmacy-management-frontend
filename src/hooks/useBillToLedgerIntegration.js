import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateLedgerEntriesFromBillMutation, useUpdateLedgerEntriesForBillMutation, useDeleteLedgerEntriesForBillMutation } from '../services/ledgerEntryApi';
import { useLedgerPermissions } from './useLedgerPermissions';
import { showToast } from '../components/common/Toast';

export const useBillToLedgerIntegration = (partyId = null) => {
  const user = useSelector((state) => state.user.user);
  const { canCreateTransaction, canEditTransaction, canDeleteTransaction } = useLedgerPermissions(partyId);
  
  const [createLedgerEntries] = useCreateLedgerEntriesFromBillMutation();
  const [updateLedgerEntries] = useUpdateLedgerEntriesForBillMutation();
  const [deleteLedgerEntries] = useDeleteLedgerEntriesForBillMutation();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const createEntriesFromBill = async (billData, billType) => {
    if (!canCreateTransaction()) {
      showToast('Permission denied to create transactions for this party', 'error');
      throw new Error('Permission denied');
    }

    if (!billData || !billType) {
      showToast('Invalid bill data or bill type', 'error');
      throw new Error('Invalid bill data');
    }

    setIsProcessing(true);
    
    try {
      const result = await createLedgerEntries({
        billData: {
          ...billData,
          partyId: billData.partyId || partyId
        },
        billType
      }).unwrap();

      showToast('Ledger entries created successfully', 'success');
      return result.data;
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to create ledger entries';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };


  const updateEntriesForBill = async (billId, billData, billType) => {
    if (!canEditTransaction()) {
      showToast('Permission denied to edit transactions for this party', 'error');
      throw new Error('Permission denied');
    }

    if (!billId || !billData || !billType) {
      showToast('Invalid bill data or bill type', 'error');
      throw new Error('Invalid bill data');
    }

    setIsProcessing(true);
    
    try {
      const result = await updateLedgerEntries({
        billId,
        billData: {
          ...billData,
          partyId: billData.partyId || partyId
        },
        billType
      }).unwrap();

      showToast('Ledger entries updated successfully', 'success');
      return result.data;
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to update ledger entries';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteEntriesForBill = async (billId) => {
    if (!canDeleteTransaction()) {
      showToast('Permission denied to delete transactions for this party', 'error');
      throw new Error('Permission denied');
    }

    if (!billId) {
      showToast('Bill ID is required', 'error');
      throw new Error('Bill ID required');
    }

    setIsProcessing(true);
    
    try {
      await deleteLedgerEntries(billId).unwrap();
      showToast('Ledger entries deleted successfully', 'success');
      return true;
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to delete ledger entries';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPurchaseBill = async (purchaseBillData) => {
    const billData = {
      id: purchaseBillData.id,
      partyId: purchaseBillData.partyId,
      billNo: purchaseBillData.billNo || purchaseBillData.invoiceNo,
      totalAmount: purchaseBillData.totalAmount || purchaseBillData.billValue,
      goodsValue: purchaseBillData.goodsValue,
      gstAmount: purchaseBillData.gstAmount || purchaseBillData.igstInput,
      date: purchaseBillData.billDate || purchaseBillData.invoiceDate
    };

    return await createEntriesFromBill(billData, 'PURCHASE');
  };

  const processSaleBill = async (saleBillData) => {
    const billData = {
      id: saleBillData.id,
      partyId: saleBillData.partyId,
      billNo: saleBillData.billNo || saleBillData.invoiceNo,
      totalAmount: saleBillData.totalAmount || saleBillData.billValue,
      goodsValue: saleBillData.goodsValue,
      gstAmount: saleBillData.gstAmount || saleBillData.igstOutput,
      date: saleBillData.billDate || saleBillData.invoiceDate
    };

    return await createEntriesFromBill(billData, 'SALE');
  };

  const updatePurchaseBill = async (billId, purchaseBillData) => {
    const billData = {
      id: billId,
      partyId: purchaseBillData.partyId,
      billNo: purchaseBillData.billNo || purchaseBillData.invoiceNo,
      totalAmount: purchaseBillData.totalAmount || purchaseBillData.billValue,
      goodsValue: purchaseBillData.goodsValue,
      gstAmount: purchaseBillData.gstAmount || purchaseBillData.igstInput,
      date: purchaseBillData.billDate || purchaseBillData.invoiceDate
    };

    return await updateEntriesForBill(billId, billData, 'PURCHASE');
  };

  const updateSaleBill = async (billId, saleBillData) => {
    const billData = {
      id: billId,
      partyId: saleBillData.partyId,
      billNo: saleBillData.billNo || saleBillData.invoiceNo,
      totalAmount: saleBillData.totalAmount || saleBillData.billValue,
      goodsValue: saleBillData.goodsValue,
      gstAmount: saleBillData.gstAmount || saleBillData.igstOutput,
      date: saleBillData.billDate || saleBillData.invoiceDate
    };

    return await updateEntriesForBill(billId, billData, 'SALE');
  };

  const canCreate = () => canCreateTransaction();

  const canEdit = () => canEditTransaction();

  const canDelete = () => canDeleteTransaction();

  return {
    isProcessing,
    
    canCreate,
    canEdit,
    canDelete,
    
    createEntriesFromBill,
    updateEntriesForBill,
    deleteEntriesForBill,
    
    processPurchaseBill,
    processSaleBill,
    updatePurchaseBill,
    updateSaleBill,
    
    user,
    userRole: user?.role
  };
};

export default useBillToLedgerIntegration; 