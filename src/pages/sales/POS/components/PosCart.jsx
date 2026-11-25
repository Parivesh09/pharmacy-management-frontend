import React, { useState, useEffect } from "react";
import {
  Trash2,
  User,
  UserPlus,
  Save,
  Printer,
  Calculator,
  RefreshCw,
  CreditCard,
  DollarSign,
  Minus,
  Plus,
  Receipt,
  Pause,
  X,
  Package,
  Bookmark,
} from "lucide-react";
import PatientListModal from "../../../masters/other/prescription/PatientListModal";
import GlobalLedgerListModal from "../../../../components/common/GlobalLedgerListModal";
import {
  useCreateQuickSaleMutation,
  useHoldBillMutation,
  useGetHeldBillsQuery,
} from "../../../../services/posApi";
import { useGetLedgersQuery } from "../../../../services/ledgerApi";
import toast from "react-hot-toast";
import { formatCurrency } from "../../../../utils/formatters";

const PosCart = ({
  cartItems,
  billCalculations,
  updateCartItem,
  removeFromCart,
  selectedCustomer,
  setSelectedCustomer,
  clearCart,
  expenses,
  setExpenses,
  theme,
}) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);

  const [createQuickSale, { isLoading: isCreatingSale }] =
    useCreateQuickSaleMutation();
  const [holdBill, { isLoading: isHolding }] = useHoldBillMutation();
  const { data: heldBillsData, refetch: refetchHeldBills } =
    useGetHeldBillsQuery({ limit: 50 });

  const { data: ledgerData } = useGetLedgersQuery({
    limit: 1000,
    isActive: true,
    groupIds: ["debtor", "creditor"],
  });

  const totalAmount = billCalculations.totalAmount || 0;
  const heldBills = heldBillsData?.data || [];

  useEffect(() => {
    if (paymentMethod === "cash" && receivedAmount) {
      const change = parseFloat(receivedAmount) - totalAmount;
      setChangeAmount(Math.max(0, change));
    } else {
      setChangeAmount(0);
    }
  }, [receivedAmount, totalAmount, paymentMethod]);

  const handleQuickSale = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const payload = {
      items: cartItems.map((item) => ({
        itemId: item.itemId || item.id,
        productname: item.productname,
        batchId: item.batchId,
        batch: item.batch,
        expiryDate: item.expDate,
        mrp: item.mrp,
        rate: item.rate,
        quantity: item.quantity,
        discountPercent: item.discountPercent || 0,
        igstPercent: item.igstPercent || 0,
        cgstPercent: item.cgstPercent || 0,
        sgstPercent: item.sgstPercent || 0,
        cessPercent: item.cessPercent || 0,
      })),
      billDiscountPercent: billCalculations.billDiscountPercent || 0,
      cgstPercent: billCalculations.cgstAmount ? 0 : 0,
      sgstPercent: billCalculations.sgstAmount ? 0 : 0,
      paymentMethod,
      receivedAmount:
        paymentMethod === "cash"
          ? parseFloat(receivedAmount) || 0
          : totalAmount,
      customerName: selectedCustomer ? selectedCustomer.name : "Cash Patient",
      customerId: selectedCustomer ? selectedCustomer.id : null,
      address: selectedCustomer?.address || "",
    };

    try {
      await createQuickSale(payload).unwrap();
      toast.success("Sale completed successfully!");
      clearCart();
      setShowPaymentModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to complete sale");
    }
  };

  const handleHoldBill = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const payload = {
      items: cartItems.map((item) => ({
        itemId: item.itemId || item.id,
        productname: item.productname,
        batchId: item.batchId,
        batch: item.batch,
        expiryDate: item.expDate,
        mrp: item.mrp,
        rate: item.rate,
        quantity: item.quantity,
        discountPercent: item.discountPercent || 0,
        igstPercent: item.igstPercent || 0,
        cgstPercent: item.cgstPercent || 0,
        sgstPercent: item.sgstPercent || 0,
        cessPercent: item.cessPercent || 0,
      })),
      billDiscountPercent: billCalculations.billDiscountPercent || 0,
      cgstPercent: 0,
      sgstPercent: 0,
      customerName: selectedCustomer ? selectedCustomer.name : "Cash Patient",
      customerId: selectedCustomer ? selectedCustomer.id : null,
      address: selectedCustomer?.address || "",
    };

    try {
      await holdBill(payload).unwrap();
      toast.success("Bill held successfully!");
      clearCart();
      setShowHoldModal(false);
      refetchHeldBills();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to hold bill");
    }
  };

  const handlePaymentComplete = () => {
    if (paymentMethod === "cash" && parseFloat(receivedAmount) < totalAmount) {
      toast.error("Received amount is less than total");
      return;
    }
    handleQuickSale();
  };

  const incrementQty = (id) => {
    updateCartItem(
      id,
      "quantity",
      (parseFloat(cartItems.find((i) => i.id === id)?.quantity) || 0) + 1,
    );
  };

  const decrementQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity > 1) {
      updateCartItem(id, "quantity", item.quantity - 1);
    } else if (item && item.quantity === 1) {
      removeFromCart(id);
    }
  };

  const isLoading = isCreatingSale || isHolding;

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--sidebar-border)",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
      }}
    >
      <div
        className="p-3 border-b"
        style={{
          backgroundColor: "var(--bg-main)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Bill #:{" "}
            <span
              className="font-mono font-black"
              style={{ color: "var(--text-main)" }}
            >
              AUTO
            </span>
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <User
              className="absolute left-3 top-2.5"
              size={16}
              style={{ color: "var(--text-muted)" }}
            />
            <input
              readOnly
              placeholder="Customer (Default: Cash Patient)"
              value={selectedCustomer ? selectedCustomer.name : "Cash Patient"}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <button
            onClick={() => setShowPatientModal(true)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--button-primary-text)",
            }}
            title="Select Patient (F3)"
          >
            <UserPlus size={18} />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <table className="pos-cart-table">
          <thead>
            <tr>
              <th
                className="px-3 py-2 font-semibold w-1/2"
                style={{ color: "var(--table-header-text)" }}
              >
                Product
              </th>
              <th
                className="px-3 py-2 font-semibold text-center w-20"
                style={{ color: "var(--table-header-text)" }}
              >
                Qty
              </th>
              <th
                className="px-3 py-2 font-semibold text-right w-20"
                style={{ color: "var(--table-header-text)" }}
              >
                Rate
              </th>
              <th
                className="px-3 py-2 font-semibold text-right w-24"
                style={{ color: "var(--table-header-text)" }}
              >
                Amt
              </th>
              <th
                className="px-3 py-2 w-8"
                style={{ color: "var(--table-header-text)" }}
              ></th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "var(--table-border)" }}
          >
            {cartItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-table-row-hover transition-colors"
              >
                <td
                  className="px-3 py-2 border-b"
                  style={{ borderColor: "var(--table-border)" }}
                >
                  <div
                    className="font-bold truncate"
                    style={{ color: "var(--text-main)" }}
                    title={item.productname}
                  >
                    {item.productname}
                  </div>
                  <div
                    className="flex gap-2 mt-1 text-[10px] font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>
                      {item.batch ? `Batch: ${item.batch}` : "No Batch"}
                    </span>
                    {item.expiryDate && (
                      <span
                        className={
                          new Date(item.expiryDate) < new Date()
                            ? "text-error"
                            : "text-warning"
                        }
                      >
                        Exp: {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex gap-2 mt-1 text-[10px]"
                    style={{ color: "var(--primary-color)" }}
                  >
                    GST:{" "}
                    {item.igstPercent ||
                      (item.cgstPercent || 0) + (item.sgstPercent || 0)}
                    % (₹
                    {formatCurrency(
                      (item.igstAmount || 0) +
                        (item.cgstAmount || 0) +
                        (item.sgstAmount || 0) +
                        (item.cessAmount || 0),
                    )}
                    )
                  </div>
                </td>
                <td
                  className="px-3 py-2 text-center border-b"
                  style={{ borderColor: "var(--table-border)" }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => decrementQty(item.id)}
                      className="w-7 h-7 rounded border flex items-center justify-center hover:bg-sidebar-hover transition-colors"
                      style={{
                        borderColor: "var(--input-border)",
                        color: "var(--text-main)",
                        backgroundColor: "var(--input-bg)",
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      className="w-14 text-center bg-transparent border-0 text-sm font-bold focus:outline-none"
                      style={{ color: "var(--text-main)" }}
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(item.id, "quantity", e.target.value)
                      }
                      onClick={(e) => e.target.select()}
                    />
                    <button
                      onClick={() => incrementQty(item.id)}
                      className="w-7 h-7 rounded border flex items-center justify-center hover:bg-sidebar-hover transition-colors"
                      style={{
                        borderColor: "var(--input-border)",
                        color: "var(--text-main)",
                        backgroundColor: "var(--input-bg)",
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </td>
                <td
                  className="px-3 py-2 text-right border-b font-mono text-xs"
                  style={{
                    borderColor: "var(--table-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {formatCurrency(item.rate)}
                </td>
                <td
                  className="px-3 py-2 text-right font-black border-b"
                  style={{
                    borderColor: "var(--table-border)",
                    color: "var(--text-main)",
                  }}
                >
                  {formatCurrency(item.amount)}
                </td>
                <td
                  className="px-3 py-2 text-center border-b"
                  style={{ borderColor: "var(--table-border)" }}
                >
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-error/60 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {cartItems.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Cart is empty</p>
                  <p className="text-xs mt-1">
                    Add products from the left panel
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="border-t"
        style={{
          borderColor: "var(--card-border)",
          backgroundColor: "var(--bg-main)",
        }}
      >
        <div
          className="grid grid-cols-2 p-3 divide-x divide-y"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                Total Items:
              </span>
              <span
                className="font-black"
                style={{ color: "var(--text-main)" }}
              >
                {cartItems.length}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span style={{ color: "var(--text-secondary)" }}>Total Qty:</span>
              <span
                className="font-black"
                style={{ color: "var(--text-main)" }}
              >
                {cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0)}
              </span>
            </div>
          </div>
          <div
            className="space-y-1"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex justify-between text-sm font-medium">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal:</span>
              <span
                className="font-black"
                style={{ color: "var(--text-main)" }}
              >
                ₹{formatCurrency(billCalculations.subtotal)}
              </span>
            </div>
            <div
              className="flex justify-between text-sm font-medium cursor-pointer hover:bg-sidebar-hover rounded px-1 transition-colors"
              onClick={() => setShowLedgerModal(true)}
              title="Click to add expenses/charges"
            >
              <span className="text-primary border-b border-dashed border-primary/50 font-bold uppercase text-[10px] tracking-wider">
                Tax/Charges
              </span>
              <span
                className="font-black"
                style={{ color: "var(--text-main)" }}
              >
                ₹{formatCurrency(billCalculations.totalTaxAmount)}
              </span>
            </div>

            {expenses &&
              expenses.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm gap-2"
                >
                  <span
                    className="text-secondary truncate w-24"
                    title={exp.name}
                  >
                    {exp.name}:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-muted text-xs">₹</span>
                    <input
                      type="number"
                      className="w-16 text-right border-b border-input-border focus:border-primary outline-none p-0 font-bold bg-transparent"
                      style={{ color: "var(--text-main)" }}
                      value={exp.amount}
                      onChange={(e) => {
                        setExpenses((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, amount: e.target.value }
                              : item,
                          ),
                        );
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpenses((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="text-error/60 hover:text-error p-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between px-4 py-3 shadow-xl relative z-20"
          style={{
            backgroundColor: "var(--header-bg)",
            color: "var(--header-text)",
          }}
        >
          <span className="text-sm font-bold uppercase tracking-widest opacity-80">
            Total Amount
          </span>
          <span className="text-3xl font-black italic tracking-tighter">
            ₹{formatCurrency(totalAmount)}
          </span>
        </div>

        <div
          className="grid grid-cols-4 gap-1 p-2"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <button
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-sidebar-hover transition-colors border"
            style={{
              borderColor: "var(--card-border)",
              color: "var(--text-secondary)",
            }}
            title="Calculator"
          >
            <Calculator size={20} className="mb-1" />
            <span className="text-xs">Calc</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-sidebar-hover transition-colors border"
            style={{
              borderColor: "var(--card-border)",
              color: "var(--text-secondary)",
            }}
            title="Hold Bill (F4)"
            onClick={() => {
              setShowHoldModal(true);
              refetchHeldBills();
            }}
          >
            <Bookmark size={20} className="mb-1" />
            <span className="text-xs">Hold</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-sidebar-hover transition-colors border"
            style={{
              borderColor: "var(--card-border)",
              color: "var(--text-secondary)",
            }}
            title="Print (F5)"
          >
            <Printer size={20} className="mb-1" />
            <span className="text-xs">Print</span>
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={isLoading || cartItems.length === 0}
            className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors shadow-sm col-span-1"
            style={{
              backgroundColor: "var(--button-success-bg)",
              color: "var(--button-success-text)",
            }}
          >
            <CreditCard size={20} className="mb-1" />
            <span className="text-xs">
              {isLoading ? "Processing..." : "Payment"}
            </span>
          </button>
        </div>
      </div>

      <PatientListModal
        open={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSelectPatient={(p) => {
          setSelectedCustomer(p);
          setShowPatientModal(false);
        }}
      />

      <GlobalLedgerListModal
        open={showLedgerModal}
        onClose={() => setShowLedgerModal(false)}
        title="Select Expense/Charge Ledger"
        ledgers={ledgerData?.data || []}
        onSelectLedger={(ledger) => {
          if (
            expenses.some((e) => e.id === ledger.id || e._id === ledger._id)
          ) {
            toast.error("Expense already added");
            return;
          }
          setExpenses((prev) => [
            ...prev,
            {
              ...ledger,
              name: ledger.name,
              amount: 0,
              id: ledger.id || ledger._id,
            },
          ]);
          setShowLedgerModal(false);
        }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ display: showPaymentModal ? "flex" : "none" }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowPaymentModal(false)}
        />
        <div
          className="relative w-full max-w-md rounded-2xl shadow-xl p-6 animate-fade-in"
          style={{
            backgroundColor: "var(--modal-bg)",
            borderColor: "var(--modal-border)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-main)" }}
            >
              Complete Payment
            </h2>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="p-1 rounded hover:bg-sidebar-hover transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div
              className="flex items-center justify-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="text-center">
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Total Amount
                </p>
                <p
                  className="text-3xl font-black"
                  style={{ color: "var(--text-main)" }}
                >
                  ₹{formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["cash", "card", "upi"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-lg text-center transition-all font-medium ${
                      paymentMethod === method
                        ? "shadow-lg"
                        : "hover:bg-sidebar-hover"
                    }`}
                    style={{
                      backgroundColor:
                        paymentMethod === method
                          ? "var(--primary-color)"
                          : "var(--bg-secondary)",
                      color:
                        paymentMethod === method
                          ? "var(--button-primary-text)"
                          : "var(--text-main)",
                      borderColor: "var(--card-border)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  >
                    {method === "cash" && (
                      <DollarSign size={20} className="mx-auto mb-1" />
                    )}
                    {method === "card" && (
                      <CreditCard size={20} className="mx-auto mb-1" />
                    )}
                    {method === "upi" && <span className="text-xl">UPI</span>}
                    <div className="text-xs capitalize">{method}</div>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === "cash" && (
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Received Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    autoFocus
                    className="input text-2xl text-center font-bold"
                    style={{ fontSize: "2rem" }}
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Change Amount
                  </span>
                  <span
                    className="text-2xl font-black"
                    style={{
                      color:
                        changeAmount > 0
                          ? "var(--success-text)"
                          : "var(--text-main)",
                    }}
                  >
                    ₹{formatCurrency(changeAmount)}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod !== "cash" && (
              <div
                className="p-3 rounded-lg text-center text-sm"
                style={{
                  backgroundColor: "var(--info-bg)",
                  color: "var(--info-text)",
                }}
              >
                Payment will be processed via{" "}
                {paymentMethod === "card" ? "Card Terminal" : "UPI QR Code"}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentComplete}
              disabled={isLoading}
              className="btn-success flex-1"
            >
              {isLoading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ display: showHoldModal ? "flex" : "none" }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowHoldModal(false)}
        />
        <div
          className="relative w-full max-w-lg rounded-2xl shadow-xl p-6 animate-fade-in"
          style={{
            backgroundColor: "var(--modal-bg)",
            borderColor: "var(--modal-border)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-main)" }}
            >
              Held Bills
            </h2>
            <button
              onClick={() => setShowHoldModal(false)}
              className="p-1 rounded hover:bg-sidebar-hover transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            {heldBills.length === 0 ? (
              <p
                className="text-center py-8"
                style={{ color: "var(--text-muted)" }}
              >
                No held bills
              </p>
            ) : (
              heldBills.map((bill, idx) => (
                <div
                  key={bill.id || idx}
                  className="p-3 rounded-lg border hover:bg-sidebar-hover cursor-pointer transition-colors flex items-center justify-between"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--card-bg)",
                  }}
                  onClick={() => {
                    // TODO: Implement restore held bill
                    toast.success("Bill restore feature coming soon");
                    setShowHoldModal(false);
                  }}
                >
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: "var(--text-main)" }}
                    >
                      {bill.partyName || bill.patientName || "Cash Patient"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {bill.billItems?.length || 0} items • ₹
                      {formatCurrency(bill.totalAmount || 0)}
                    </p>
                  </div>
                  <button
                    className="p-1 rounded hover:bg-error/10 text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Bill deleted");
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHoldModal(false)}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              onClick={handleHoldBill}
              disabled={isLoading || cartItems.length === 0}
              className="btn-primary flex-1"
            >
              {isLoading ? "Holding..." : "Hold Current Bill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosCart;
