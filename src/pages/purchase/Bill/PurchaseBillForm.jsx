import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X } from "lucide-react";
import {
  useCreateBillMutation,
  useUpdateBillMutation,
  useGetBillByIdQuery,
} from "../../../services/purchaseBillApi";
import { useGetItemsQuery } from "../../../services/itemApi";
import SelectItemDialog from "../../../componets/common/SelectItemDialog";
import CreditorLedgerListModal from "./components/CreditorLedgerListModal";
import PurchaseMasterListModal from "./components/PurchaseMasterListModal";
import BatchSelectionDialog from "./components/BatchSelectionDialog";
import Button from "../../../componets/common/Button";
import toast from "react-hot-toast";

import { calculateBillTotals } from "../../../utils/billCalculations";
import BillHeaderSection from "./components/BillHeaderSection";
import SupplierTaxSection from "./components/SupplierTaxSection";
import ItemsTableSection from "./components/ItemsTableSection";
import CalculationsSection from "./components/CalculationsSection";
import TotalSection from "./components/TotalSection";
import PaymentDetailsSection from "./components/PaymentDetailsSection";

const PurchaseBillForm = () => {
  const navigate = useNavigate();
  const { id: billId } = useParams();
  const isEdit = !!billId;

  const { data: billData } = useGetBillByIdQuery(billId, { skip: !isEdit });
  const { data: itemsData } = useGetItemsQuery();

  const [createBill] = useCreateBillMutation();
  const [updateBill] = useUpdateBillMutation();

  const [form, setForm] = useState({
    billNo: "",
    billDate: new Date().toISOString().split("T")[0],
    supplierLedgerId: "",
    supplierName: "",
    supplierInvoiceNo: "",
    supplierInvoiceDate: "",
    purchaseMasterId: "",
    purchaseMasterName: "",
    billDiscountPercent: 0,
    notes: "",
    referenceNumber: "",
    items: [],
  });

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    itemDiscount: 0,
    billDiscountAmount: 0,
    igstAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    cessAmount: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
    dueAmount: 0,
  });

  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showLedgerDialog, setShowLedgerDialog] = useState(false);
  const [showPurchaseMasterDialog, setShowPurchaseMasterDialog] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [selectedItemRowIndex, setSelectedItemRowIndex] = useState(null);
  const [selectedBatchRowIndex, setSelectedBatchRowIndex] = useState(null);
  const [selectedItemIdForBatch, setSelectedItemIdForBatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [cashDenominations, setCashDenominations] = useState({
    "2000": 0,
    "500": 0,
    "200": 0,
    "100": 0,
    "50": 0,
    "20": 0,
    "10": 0,
    "5": 0,
    "2": 0,
    "1": 0,
  });

  useEffect(() => {
    if (billData?.data) {
      setForm({
        ...billData.data,
        items: billData.data.billItems || [],
      });
    }
  }, [billData]);

  // Store purchase master data in form for calculations
  const [purchaseMasterData, setPurchaseMasterData] = useState(null);

  useEffect(() => {
    if (form.purchaseMasterId && purchaseMasterData) {
      const taxRates = {
        igstPercent: purchaseMasterData.igstPercentage || 0,
        cgstPercent: purchaseMasterData.cgstPercentage || 0,
        sgstPercent: purchaseMasterData.sgstPercentage || 0,
        cessPercent: purchaseMasterData.cessPercentage || 0,
      };
      const calcs = calculateBillTotals(
        form.items,
        form.billDiscountPercent,
        taxRates
      );
      setCalculations(calcs);
    }
  }, [form.items, form.billDiscountPercent, form.purchaseMasterId, purchaseMasterData]);

  const handleItemSelect = (item) => {
    console.log("Item selected:", item);
    console.log("Selected row index:", selectedItemRowIndex);
    
    if (selectedItemRowIndex !== null) {
      const newItems = [...form.items];
      const updatedItem = {
        ...newItems[selectedItemRowIndex],
        itemId: item.id,
        product: item.name || item.itemName || "",
        mrp: item.mrp || item.price || 0,
        rate: item.purchasePrice || item.purchaseRate || item.mrp || item.price || 0,
        packing: item.packing || "",
        batchId: "", // Reset batch when item changes
        batch: "",
      };
      console.log("Updated item:", updatedItem);
      newItems[selectedItemRowIndex] = updatedItem;
      setForm((prev) => ({ ...prev, items: newItems }));
      setSelectedItemRowIndex(null);
      setShowItemDialog(false);
    }
  };

  const handleBatchSelect = (batch) => {
    if (selectedBatchRowIndex !== null) {
      const newItems = [...form.items];
      newItems[selectedBatchRowIndex] = {
        ...newItems[selectedBatchRowIndex],
        batchId: batch.id,
        batch: batch.batchNumber,
        expiryDate: batch.expiryDate || "",
        mrp: batch.mrp || newItems[selectedBatchRowIndex].mrp,
        rate: batch.purchaseRate || newItems[selectedBatchRowIndex].rate,
      };
      setForm((prev) => ({ ...prev, items: newItems }));
      setSelectedBatchRowIndex(null);
      setSelectedItemIdForBatch(null);
    }
    setShowBatchDialog(false);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          product: "",
          packing: "",
          batchId: "",
          batch: "",
          expDate: "",
          unit1: "",
          unit2: "",
          mrp: 0,
          rate: 0,
          quantity: 1,
          discountPercent: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.supplierLedgerId) {
      toast.error("Please select a supplier");
      return;
    }

    if (!form.purchaseMasterId) {
      toast.error("Please select a purchase master (tax category)");
      return;
    }

    if (form.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...form,
        billNo: form.billNo?.trim() || undefined,
        items: calculations.items,
        ...calculations,
      };

      if (isEdit) {
        await updateBill({ id: billId, ...payload }).unwrap();
        toast.success("Purchase bill updated successfully");
      } else {
        await createBill(payload).unwrap();
        toast.success("Purchase bill created successfully");
      }

      navigate("/purchase/bill");
    } catch (error) {
      toast.error(error?.data?.message || "Error saving bill");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-(--bg-main) p-6">
      <SelectItemDialog
        open={showItemDialog}
        onClose={() => setShowItemDialog(false)}
        onSelectItem={handleItemSelect}
      />
      <CreditorLedgerListModal
        open={showLedgerDialog}
        onClose={() => setShowLedgerDialog(false)}
        onSelectLedger={(ledger) => {
          setForm((prev) => ({
            ...prev,
            supplierLedgerId: ledger.id,
            supplierName: ledger.ledgerName,
          }));
          setShowLedgerDialog(false);
        }}
      />
      <PurchaseMasterListModal
        open={showPurchaseMasterDialog}
        onClose={() => setShowPurchaseMasterDialog(false)}
        onSelectPurchaseMaster={(master) => {
          setForm((prev) => ({
            ...prev,
            purchaseMasterId: master.id,
            purchaseMasterName: master.purchaseType,
          }));
          setPurchaseMasterData(master);
          setShowPurchaseMasterDialog(false);
        }}
      />
      <BatchSelectionDialog
        open={showBatchDialog}
        onClose={() => {
          setShowBatchDialog(false);
          setSelectedBatchRowIndex(null);
          setSelectedItemIdForBatch(null);
        }}
        onSelectBatch={handleBatchSelect}
        itemId={selectedItemIdForBatch}
        itemName={
          selectedBatchRowIndex !== null
            ? form.items[selectedBatchRowIndex]?.product || "Unknown Item"
            : "Unknown Item"
        }
      />

      <div className="max-w-full mx-auto bg-(--card-bg) rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 transition-all duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-(--header-bg) to-(--header-bg)/90 text-white p-8 mb-4 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase drop-shadow-lg">Purchase Bill</h1>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2 px-1">
                {isEdit ? "MODIFY EXISTING RECORD" : "INITIALIZE NEW PROCUREMENT"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">TOTAL PAYABLE</div>
              <div className="text-5xl font-black italic tracking-tighter drop-shadow-lg">
                ₹{formatCurrency(calculations.totalAmount)}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <BillHeaderSection form={form} setForm={setForm} />

          <SupplierTaxSection
            form={form}
            setForm={setForm}
            onShowLedgerDialog={() => setShowLedgerDialog(true)}
            onShowPurchaseMasterDialog={() => setShowPurchaseMasterDialog(true)}
          />

          <ItemsTableSection
            items={form.items}
            calculations={calculations}
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onSelectItem={(idx) => {
              setSelectedItemRowIndex(idx);
              setShowItemDialog(true);
            }}
            onSelectBatch={(idx, itemId) => {
              setSelectedBatchRowIndex(idx);
              setSelectedItemIdForBatch(itemId);
              setShowBatchDialog(true);
            }}
            formatCurrency={formatCurrency}
          />

          <CalculationsSection
            form={form}
            setForm={setForm}
            calculations={calculations}
            formatCurrency={formatCurrency}
          />

          <TotalSection
            calculations={calculations}
            formatCurrency={formatCurrency}
          />

          {/* Notes Section */}
          <div className="pb-8 border-b border-gray-50 dark:border-white/5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
              PROCUREMENT MEMO & REMARKS
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Enter internal notes or procurement remarks..."
              rows="3"
              className="w-full px-4 py-3 bg-transparent border border-gray-100 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 text-(--text-main) placeholder:text-gray-400 font-bold transition-all"
            />
          </div>

          <PaymentDetailsSection
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            cashDenominations={cashDenominations}
            setCashDenominations={setCashDenominations}
            formatCurrency={formatCurrency}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-8 border-t border-gray-50 dark:border-white/5">
            <Button
              type="button"
              onClick={() => navigate("/purchase/bill")}
              variant="outline"
              className="flex items-center gap-2 px-8 rounded-2xl h-12 font-bold uppercase tracking-widest text-xs"
            >
              <X size={18} /> Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="flex items-center gap-2 px-12 rounded-2xl h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-(--primary-color)/20"
            >
              <Save size={18} /> {isLoading ? "Processing..." : isEdit ? "Update Procurement" : "Confirm Purchase"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseBillForm;
