import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X } from "lucide-react";
import {
  useCreateBillMutation,
  useUpdateBillMutation,
  useGetBillQuery,
} from "../../../services/salesBillApi";
import PatientListModal from "../../masters/other/prescription/PatientListModal";
import DoctorListModal from "../../masters/other/doctor/DoctorListModal";
import LedgerListModal from "../Bill/components/LedgerListModal";
import SelectItemDialog from "../../../componets/common/SelectItemDialog";
import BatchSelectionDialog from "../../purchase/Bill/components/BatchSelectionDialog";
import Button from "../../../componets/common/Button";
import { calculateBillTotals, formatCurrency } from "../../../utils/billCalculations";
import toast from "react-hot-toast";

import SaleBillHeaderSection from "../Bill/components/SaleBillHeaderSection";
import PartyDetailsSection from "../Bill/components/PartyDetailsSection";
import SaleItemsTableSection from "../Bill/components/SaleItemsTableSection";
import SaleCalculationsSection from "../Bill/components/SaleCalculationsSection";
import SaleTotalSection from "../Bill/components/SaleTotalSection";

const BillForm = () => {
  const navigate = useNavigate();
  const { id: billId } = useParams();
  const isEdit = !!billId;
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [selectedBatchRowIndex, setSelectedBatchRowIndex] = useState(null);
  const [selectedItemIdForBatch, setSelectedItemIdForBatch] = useState(null);

  const { data: billData } = useGetBillQuery(billId, { skip: !isEdit });
  const [createBill] = useCreateBillMutation();
  const [updateBill] = useUpdateBillMutation();

  const [form, setForm] = useState({
    billNo: "",
    date: new Date().toISOString().split("T")[0],
    partyName: "",
    partyId: "",
    patientName: "",
    patientId: "",
    doctorName: "",
    doctorId: "",
    address: "",
    notes: "",
    items: [],
    billDiscountPercent: 0,
    cgstPercent: 0,
    sgstPercent: 0,
  });

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    itemDiscount: 0,
    billDiscountAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    totalAmount: 0,
    dueAmount: 0,
  });

  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [showDoctorDialog, setShowDoctorDialog] = useState(false);
  const [showLedgerDialog, setShowLedgerDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [selectedItemRowIndex, setSelectedItemRowIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (billData?.data) {
      setForm({
        ...billData.data,
        items: billData.data.billItems || [],
      });
    }
  }, [billData]);

  useEffect(() => {
    const calcs = calculateBillTotals(
      form.items,
      form.billDiscountPercent,
      {
        igstPercent: 0,
        cgstPercent: form.cgstPercent,
        sgstPercent: form.sgstPercent,
        cessPercent: 0,
      }
    );
    setCalculations(calcs);
  }, [form.items, form.billDiscountPercent, form.cgstPercent, form.sgstPercent]);

  const handleBatchSelect = (batch) => {
    if (selectedBatchRowIndex !== null) {
      const newItems = [...form.items];
      newItems[selectedBatchRowIndex] = {
        ...newItems[selectedBatchRowIndex],
        batchId: batch.id,
        batch: batch.batchNumber,
        expDate: batch.expiryDate || "",
        mrp: batch.mrp || newItems[selectedBatchRowIndex].mrp,
        rate: batch.billingMrp || batch.mrp || newItems[selectedBatchRowIndex].rate,
        batchQuantity: batch.quantity || 0,
      };
      
      // Recalculate amount with new rate
      newItems[selectedBatchRowIndex] = calculateItemAmount(newItems[selectedBatchRowIndex]);
      
      setForm((prev) => ({ ...prev, items: newItems }));
      setSelectedBatchRowIndex(null);
      setSelectedItemIdForBatch(null);
    }
    setShowBatchDialog(false);
  };

  const handleBatchFieldClick = (idx, itemId) => {
    if (itemId) {
      setSelectedBatchRowIndex(idx);
      setSelectedItemIdForBatch(itemId);
      setShowBatchDialog(true);
    } else {
      toast.error("Please select an item first");
    }
  };

  const handleItemSelect = (item) => {
    if (selectedItemRowIndex !== null) {
      const newItems = [...form.items];
      newItems[selectedItemRowIndex] = {
        ...newItems[selectedItemRowIndex],
        itemId: item.id,
        product: item.name,
        mrp: item.mrp || 0,
        rate: item.rate || 0, // Use the correct rate for calculations
        packing: item.packing || "",
        batchId: item.batchId || "",
        batch: item.batch || "",
        expDate: item.expiryDate || "",
        unit1: item.unit || "",
        availableStock: item.stock || 0,
        batchQuantity: item.batchQuantity || item.stock || 0,
        quantity: 1, // Default quantity
        discountPercent: 0,
        // Add tax information
        igstPercent: item.igstPercent || 0,
        cgstPercent: item.cgstPercent || 0,
        sgstPercent: item.sgstPercent || 0,
        cessPercent: item.cessPercent || 0,
      };
      
      // Calculate amount for this item
      const calculatedItem = calculateItemAmount(newItems[selectedItemRowIndex]);
      newItems[selectedItemRowIndex] = calculatedItem;
      
      setForm((prev) => ({ ...prev, items: newItems }));
      setSelectedItemRowIndex(null);
    }
  };

  // Function to calculate item amount with taxes
  const calculateItemAmount = (item) => {
    const quantity = parseFloat(item.quantity) || 1;
    const rate = parseFloat(item.rate) || 0;
    const discountPercent = parseFloat(item.discountPercent) || 0;
    
    // Calculate base amount
    const baseAmount = quantity * rate;
    
    // Calculate discount
    const discountAmount = (baseAmount * discountPercent) / 100;
    const amountAfterDiscount = baseAmount - discountAmount;
    
    // Calculate taxes
    const igstAmount = (amountAfterDiscount * (item.igstPercent || 0)) / 100;
    const cgstAmount = (amountAfterDiscount * (item.cgstPercent || 0)) / 100;
    const sgstAmount = (amountAfterDiscount * (item.sgstPercent || 0)) / 100;
    const cessAmount = (amountAfterDiscount * (item.cessPercent || 0)) / 100;
    
    const totalTaxAmount = igstAmount + cgstAmount + sgstAmount + cessAmount;
    const finalAmount = amountAfterDiscount + totalTaxAmount;
    
    return {
      ...item,
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      igstAmount: parseFloat(igstAmount.toFixed(2)),
      cgstAmount: parseFloat(cgstAmount.toFixed(2)),
      sgstAmount: parseFloat(sgstAmount.toFixed(2)),
      cessAmount: parseFloat(cessAmount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTaxAmount.toFixed(2)),
      amount: parseFloat(finalAmount.toFixed(2)),
    };
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount if quantity, rate, or discount changes
    if (field === 'quantity' || field === 'rate' || field === 'discountPercent') {
      newItems[index] = calculateItemAmount(newItems[index]);
    }
    
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: "",
          packing: "",
          batch: "",
          expDate: "",
          unit1: "",
          unit2: "",
          mrp: 0,
          rate: 0,
          quantity: 1,
          discountPercent: 0,
          amount: 0,
          // Tax fields
          igstPercent: 0,
          cgstPercent: 0,
          sgstPercent: 0,
          cessPercent: 0,
          igstAmount: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          cessAmount: 0,
          totalTaxAmount: 0,
          baseAmount: 0,
          discountAmount: 0,
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
    
    if (form.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...form,
        // If billNo is empty or just whitespace, don't send it (let backend auto-generate)
        billNo: form.billNo?.trim() || undefined,
        items: calculations.items,
        ...calculations,
      };

      if (isEdit) {
        await updateBill({ id: billId, ...payload }).unwrap();
        toast.success("Bill updated successfully");
      } else {
        await createBill(payload).unwrap();
        toast.success("Bill created successfully");
      }

      navigate("/sales/bill");
    } catch (error) {
      toast.error(error?.data?.message || "Error saving bill");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-main) p-4 tracking-tight">
      <PatientListModal
        open={showPatientDialog}
        onClose={() => setShowPatientDialog(false)}
        onSelectPatient={(patient) => {
          setForm((prev) => ({
            ...prev,
            patientId: patient.id,
            patientName: patient.name,
            address: patient.address || "",
          }));
          setShowPatientDialog(false);
        }}
      />
      <DoctorListModal
        open={showDoctorDialog}
        onClose={() => setShowDoctorDialog(false)}
        onSelectDoctor={(doctor) => {
          setForm((prev) => ({
            ...prev,
            doctorId: doctor.id,
            doctorName: doctor.name,
          }));
          setShowDoctorDialog(false);
        }}
      />
      <LedgerListModal
        open={showLedgerDialog}
        onClose={() => setShowLedgerDialog(false)}
        onSelectLedger={(ledger) => {
          setForm((prev) => ({
            ...prev,
            partyId: ledger.id,
            partyName: ledger.ledgerName,
            address: ledger.address || "",
          }));
          setShowLedgerDialog(false);
        }}
      />
      <SelectItemDialog
        open={showItemDialog}
        onClose={() => setShowItemDialog(false)}
        onSelectItem={handleItemSelect}
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

      <div className="max-w-full mx-auto bg-(--card-bg) rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5">
        {/* Header */}
        <div className="bg-(--primary-color) text-white p-8 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter">SALE BILL</h1>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest mt-1">
              {isEdit ? "Update Transaction" : "New Transaction"}
            </p>
          </div>
          <div className="text-right relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest text-white/60">Outstanding Balance</div>
            <div className="text-5xl font-black tracking-tighter">
              ₹{formatCurrency(calculations.dueAmount)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <SaleBillHeaderSection
            form={form}
            setForm={setForm}
            onShowLedgerDialog={() => setShowLedgerDialog(true)}
          />

          <PartyDetailsSection
            form={form}
            setForm={setForm}
            onShowPatientDialog={() => setShowPatientDialog(true)}
            onShowDoctorDialog={() => setShowDoctorDialog(true)}
          />

          <SaleItemsTableSection
            items={form.items}
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onSelectItem={(idx) => {
              setSelectedItemRowIndex(idx);
              setShowItemDialog(true);
            }}
            onSelectBatch={handleBatchFieldClick}
            formatCurrency={formatCurrency}
          />

          <SaleCalculationsSection
            form={form}
            setForm={setForm}
            calculations={calculations}
            formatCurrency={formatCurrency}
          />

          <SaleTotalSection
            calculations={calculations}
            formatCurrency={formatCurrency}
          />

          {/* Notes Section */}
          <div className="pb-6 border-b border-gray-200 dark:border-white/10">
            <label className="block text-sm font-bold text-(--text-main) opacity-80 mb-2">
              Remarks / Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add internal notes for this bill..."
              rows="3"
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-700 text-(--text-main) rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              onClick={() => navigate("/sales/bill")}
              variant="secondary"
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-12 bg-(--primary-color) hover:bg-(--primary-dark) text-white shadow-xl shadow-(--primary-color)/20"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Bill" : "Create Bill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;
