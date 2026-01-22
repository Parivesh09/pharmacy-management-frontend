
import React, { useState } from "react";
import { Trash2, User, UserPlus, Save, Printer, Calculator, RefreshCw } from "lucide-react";
import PatientListModal from "../../../masters/other/prescription/PatientListModal";
// Reuse existing hooks
import { useCreateBillMutation } from "../../../../services/salesBillApi";
import toast from "react-hot-toast";

const PosCart = ({ cartItems, billCalculations, updateCartItem, removeFromCart, selectedCustomer, setSelectedCustomer, clearCart }) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [createBill, { isLoading }] = useCreateBillMutation();
  
  const handleSave = async () => {
      if (cartItems.length === 0) {
          toast.error("Cart is empty");
          return;
      }
      
      const payload = {
        billNo: undefined,
        date: new Date().toISOString().split("T")[0],
        partyName: selectedCustomer ? selectedCustomer.name : "Cash Patient",
        partyId: selectedCustomer ? selectedCustomer.id : null,
        patientName: selectedCustomer ? selectedCustomer.name : "Cash Patient",
        patientId: selectedCustomer ? selectedCustomer.id : null,
        address: selectedCustomer?.address || "",
        items: cartItems,
        ...billCalculations,
      };
      
      try {
          await createBill(payload).unwrap();
          toast.success("Bill saved successfully");
          clearCart();
      } catch (err) {
          console.error(err);
          toast.error("Failed to save bill");
      }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl border-l border-gray-200">
      {/* Customer Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Bill #: <span className="font-mono text-black font-bold">AUTO</span></span>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-2">
           <div className="flex-1 relative">
             <User className="absolute left-3 top-2.5 text-gray-400" size={16}/>
             <input 
               readOnly
               placeholder="Customer (Default: Cash Patient)"
               value={selectedCustomer ? selectedCustomer.name : "Cash Patient"}
               className="w-full pl-9 pr-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
             />
           </div>
           <button 
             onClick={() => setShowPatientModal(true)}
             className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
             title="Select Patient"
           >
             <UserPlus size={18}/>
           </button>
        </div>
      </div>
      
      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
         <table className="w-full text-left text-sm">
            <thead className="bg-[#5f6caf] text-white sticky top-0 z-10">
                <tr>
                    <th className="p-2 font-medium w-1/2">Product</th>
                    <th className="p-2 font-medium text-center w-16">Qty</th>
                    <th className="p-2 font-medium text-right w-20">Rate</th>
                    <th className="p-2 font-medium text-right w-20">Amt</th>
                    <th className="p-2 w-8"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {cartItems.map((item) => (
                   <tr key={item.id} className="hover:bg-blue-50 group">
                       <td className="p-2">
                           <div className="font-medium text-gray-900 line-clamp-1" title={item.productname}>{item.productname}</div>
                           <div className="text-xs text-gray-400">{item.batch ? `Batch: ${item.batch}` : 'No Batch'}</div>
                       </td>
                       <td className="p-2 text-center">
                           <input 
                             type="number"
                             min="1"
                             className="w-12 text-center border border-gray-300 rounded py-1 focus:border-blue-500 outline-none"
                             value={item.quantity}
                             onClick={(e) => e.target.select()}
                             onChange={(e) => updateCartItem(item.id, "quantity", e.target.value)}
                           />
                       </td>
                       <td className="p-2 text-right">
                           <div className="font-mono">{parseFloat(item.rate).toFixed(2)}</div>
                       </td>
                       <td className="p-2 text-right font-bold text-gray-900">
                           {parseFloat(item.amount).toFixed(2)}
                       </td>
                       <td className="p-2 text-center">
                           <button 
                             onClick={() => removeFromCart(item.id)}
                             className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <Trash2 size={16}/>
                           </button>
                       </td>
                   </tr>
               ))}
               {cartItems.length === 0 && (
                   <tr>
                       <td colSpan={5} className="text-center py-10 text-gray-400">
                           Cart is empty
                       </td>
                   </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* Totals Section */}
      <div className="bg-gray-50 border-t border-gray-200">
         {/* Summary Grid */}
         <div className="grid grid-cols-2 text-sm divide-x divide-gray-200 border-b border-gray-200">
             <div className="p-2 space-y-1">
                 <div className="flex justify-between text-gray-600">
                    <span>Total Items:</span>
                    <span className="font-semibold">{cartItems.length}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Total Qty:</span>
                    <span className="font-semibold">{cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0)}</span>
                 </div>
             </div>
             <div className="p-2 space-y-1 bg-white">
                 <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{billCalculations.subtotal?.toFixed(2) || "0.00"}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span className="font-semibold">₹{billCalculations.totalTaxAmount?.toFixed(2) || "0.00"}</span> 
                 </div>
             </div>
         </div>
         
         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-2xl font-bold">₹{billCalculations.totalAmount?.toFixed(2) || "0.00"}</span>
         </div>
         
         {/* Action Buttons */}
         <div className="grid grid-cols-3 gap-1 p-2 bg-white">
            <button className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-600 transition outline-none border border-gray-200">
                <Calculator size={20} className="mb-1"/>
                <span className="text-xs">Calc</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-600 transition outline-none border border-gray-200">
                <Printer size={20} className="mb-1"/>
                <span className="text-xs">Print</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-2 rounded bg-green-600 hover:bg-green-700 text-white transition shadow-sm"
            >
                <Save size={20} className="mb-1"/>
                <span className="text-xs">{isLoading ? 'Saving...' : 'Save Bill'}</span>
            </button>
         </div>
      </div>
      
      {/* Modals */}
      <PatientListModal 
         open={showPatientModal}
         onClose={() => setShowPatientModal(false)}
         onSelectPatient={(p) => {
             setSelectedCustomer(p);
             setShowPatientModal(false);
         }}
      />
    </div>
  );
};

export default PosCart;
