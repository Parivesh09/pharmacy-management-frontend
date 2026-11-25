import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import { useForm } from "react-hook-form";
import { showToast } from "../../../../components/common/Toast";
import { useGetLedgersQuery } from "../../../../services/ledgerApi";
import { 
  useGetTransactionByIdQuery, 
  useCreateTransactionMutation, 
  useUpdateTransactionMutation 
} from "../../../../services/transactionApi";

const CreateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      voucherType: "Journal",
      voucherDate: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      debitLedgerId: "",
      creditLedgerId: "",
      referenceNumber: "",
      status: "Draft"
    }
  });

  const watchedDebitLedger = watch("debitLedgerId");
  const watchedCreditLedger = watch("creditLedgerId");


  const { data: ledgers = [], isLoading: ledgersLoading } = useGetLedgersQuery({ limit: 1000 });
  const { data: transactionData, isLoading: transactionLoading } = useGetTransactionByIdQuery(id, {
    skip: !isEditMode,
  });
  const [createTransaction, { isLoading: createLoading }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updateLoading }] = useUpdateTransactionMutation();


  useEffect(() => {
    if (transactionData && isEditMode) {
      reset({
        voucherType: transactionData.voucherType || "Journal",
        voucherDate: transactionData.voucherDate ? new Date(transactionData.voucherDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: transactionData.description || "",
        amount: transactionData.amount || "",
        debitLedgerId: transactionData.debitLedgerId || "",
        creditLedgerId: transactionData.creditLedgerId || "",
        referenceNumber: transactionData.referenceNumber || "",
        status: transactionData.status || "Draft"
      });
    }
  }, [transactionData, isEditMode, reset]);

  const onSubmit = async (data) => {

    if (data.debitLedgerId === data.creditLedgerId) {
      showToast("Debit and Credit ledgers cannot be the same", "error");
      return;
    }

    try {
      if (isEditMode) {
        await updateTransaction({ id, ...data }).unwrap();
        showToast("Transaction updated successfully", "success");
      } else {
        await createTransaction(data).unwrap();
        showToast("Transaction created successfully", "success");
      }
      navigate("/master/account/transaction");
    } catch (error) {
      const errorMessage = error?.data?.message || 
        (isEditMode ? "Failed to update transaction" : "Failed to create transaction");
      showToast(errorMessage, "error");
      console.error("Form submission error:", error);
    }
  };

  const handleClear = () => {
    reset({
      voucherType: "Journal",
      voucherDate: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      debitLedgerId: "",
      creditLedgerId: "",
      referenceNumber: "",
      status: "Draft"
    });
  };

  const handleBack = () => {
    navigate("/master/account/transaction");
  };

  const isLoading = ledgersLoading || transactionLoading || createLoading || updateLoading;

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-100px)] bg-gray-100 py-2">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">
            {isEditMode ? "Edit Transaction" : "Create Transaction"}
          </h1>
          <Button type="button" variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Type <span className="text-red-500">*</span>
                </label>
                <Select
                  className={`w-full ${errors.voucherType ? 'border-red-500' : ''}`}
                  {...register("voucherType", { 
                    required: "Voucher type is required" 
                  })}
                >
                  <option value="Receipt">Receipt</option>
                  <option value="Payment">Payment</option>
                  <option value="Journal">Journal</option>
                  <option value="Contra">Contra</option>
                  <option value="DebitNote">Debit Note</option>
                  <option value="CreditNote">Credit Note</option>
                </Select>
                {errors.voucherType && (
                  <p className="text-red-500 text-sm mt-1">{errors.voucherType.message}</p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  className={`w-full ${errors.voucherDate ? 'border-red-500' : ''}`}
                  {...register("voucherDate", { 
                    required: "Voucher date is required" 
                  })}
                />
                {errors.voucherDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.voucherDate.message}</p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  className={`w-full ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  {...register("amount", { 
                    required: "Amount is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" }
                  })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <Input
                  type="text"
                  className="w-full"
                  placeholder="Enter reference number"
                  {...register("referenceNumber")}
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Debit Ledger <span className="text-red-500">*</span>
                </label>
                <Select
                  className={`w-full ${errors.debitLedgerId ? 'border-red-500' : ''}`}
                  {...register("debitLedgerId", { 
                    required: "Debit ledger is required" 
                  })}
                >
                  <option value="">Select debit ledger</option>
                  {ledgers.map((ledger) => (
                    <option key={ledger.id} value={ledger.id}>
                      {ledger.ledgerName}
                    </option>
                  ))}
                </Select>
                {errors.debitLedgerId && (
                  <p className="text-red-500 text-sm mt-1">{errors.debitLedgerId.message}</p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Ledger <span className="text-red-500">*</span>
                </label>
                <Select
                  className={`w-full ${errors.creditLedgerId ? 'border-red-500' : ''}`}
                  {...register("creditLedgerId", { 
                    required: "Credit ledger is required" 
                  })}
                >
                  <option value="">Select credit ledger</option>
                  {ledgers.map((ledger) => (
                    <option key={ledger.id} value={ledger.id}>
                      {ledger.ledgerName}
                    </option>
                  ))}
                </Select>
                {errors.creditLedgerId && (
                  <p className="text-red-500 text-sm mt-1">{errors.creditLedgerId.message}</p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  className="w-full"
                  {...register("status")}
                >
                  <option value="Draft">Draft</option>
                  <option value="Posted">Posted</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter transaction description"
                {...register("description")}
              />
            </div>

            
            {watchedDebitLedger && watchedCreditLedger && watchedDebitLedger === watchedCreditLedger && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">Debit and Credit ledgers cannot be the same</p>
              </div>
            )}
          </div>

          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || (watchedDebitLedger && watchedCreditLedger && watchedDebitLedger === watchedCreditLedger)}
            >
              {isEditMode ? "Update" : "Create"} Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransaction; 