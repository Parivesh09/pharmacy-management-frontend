/**
 * Bill Calculation Utilities for Frontend
 */

export const calculateItemAmount = (quantity, rate) => {
  return parseFloat((quantity * rate).toFixed(2));
};

export const calculateDiscountAmount = (amount, discountPercent) => {
  return parseFloat((amount * (discountPercent / 100)).toFixed(2));
};

export const calculateTaxAmount = (amount, taxPercent) => {
  return parseFloat((amount * (taxPercent / 100)).toFixed(2));
};

export const processBillItem = (item, billLevelTaxes = {}) => {
  const quantity = parseFloat(item.quantity) || 1;
  const rate = parseFloat(item.rate) || 0;
  const mrp = parseFloat(item.mrp) || rate;
  const discountPercent = parseFloat(item.discountPercent) || 0;
  
  const igstPercent = item.igstPercent !== undefined && item.igstPercent !== null ? parseFloat(item.igstPercent) : (billLevelTaxes.igstPercent || 0);
  const cgstPercent = item.cgstPercent !== undefined && item.cgstPercent !== null ? parseFloat(item.cgstPercent) : (billLevelTaxes.cgstPercent || 0);
  const sgstPercent = item.sgstPercent !== undefined && item.sgstPercent !== null ? parseFloat(item.sgstPercent) : (billLevelTaxes.sgstPercent || 0);
  const cessPercent = item.cessPercent !== undefined && item.cessPercent !== null ? parseFloat(item.cessPercent) : (billLevelTaxes.cessPercent || 0);

  const baseAmount = calculateItemAmount(quantity, rate);

  const discountAmount = calculateDiscountAmount(baseAmount, discountPercent);
  const amountAfterDiscount = baseAmount - discountAmount;
  const igstAmount = calculateTaxAmount(amountAfterDiscount, igstPercent);
  const cgstAmount = calculateTaxAmount(amountAfterDiscount, cgstPercent);
  const sgstAmount = calculateTaxAmount(amountAfterDiscount, sgstPercent);
  const cessAmount = calculateTaxAmount(amountAfterDiscount, cessPercent);

  const finalAmount = amountAfterDiscount + igstAmount + cgstAmount + sgstAmount + cessAmount;

  return {
    ...item,
    quantity,
    rate,
    mrp,
    discountPercent,
    discountAmount,
    igstPercent,
    igstAmount,
    cgstPercent,
    cgstAmount,
    sgstPercent,
    sgstAmount,
    cessPercent,
    cessAmount,
    amount: parseFloat(finalAmount.toFixed(2)),
  };
};

export const calculateBillTotals = (items, billDiscountPercent = 0, taxes = {}) => {
  const billLevelTaxes = {
    igstPercent: parseFloat(taxes.igstPercent) || 0,
    cgstPercent: parseFloat(taxes.cgstPercent) || 0,
    sgstPercent: parseFloat(taxes.sgstPercent) || 0,
    cessPercent: parseFloat(taxes.cessPercent) || 0,
  };

  const processedItems = items.map(item => processBillItem(item, billLevelTaxes));

  const totalItemIgst = processedItems.reduce((sum, item) => sum + (item.igstAmount || 0), 0);
  const totalItemCgst = processedItems.reduce((sum, item) => sum + (item.cgstAmount || 0), 0);
  const totalItemSgst = processedItems.reduce((sum, item) => sum + (item.sgstAmount || 0), 0);
  const totalItemCess = processedItems.reduce((sum, item) => sum + (item.cessAmount || 0), 0);
  
  const totalItemTax = totalItemIgst + totalItemCgst + totalItemSgst + totalItemCess;

  const subtotalTaxable = processedItems.reduce((sum, item) => {
      const itemTax = (item.igstAmount||0) + (item.cgstAmount||0) + (item.sgstAmount||0) + (item.cessAmount||0);
      return sum + (item.amount - itemTax);
  }, 0);

  // Bill Discount
  const billDiscountAmount = calculateDiscountAmount(subtotalTaxable, billDiscountPercent);
  

  const totalTaxAmount = totalItemTax;

  const amountAfterDiscount = subtotalTaxable - billDiscountAmount;
  const totalAmount = amountAfterDiscount + totalTaxAmount;

  return {
    items: processedItems,
    subtotal: parseFloat(subtotalTaxable.toFixed(2)),
    itemDiscount: parseFloat(processedItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0).toFixed(2)),
    billDiscountPercent,
    billDiscountAmount: parseFloat(billDiscountAmount.toFixed(2)),
    
    // Return aggregated taxes
    igstAmount: parseFloat(totalItemIgst.toFixed(2)),
    cgstAmount: parseFloat(totalItemCgst.toFixed(2)),
    sgstAmount: parseFloat(totalItemSgst.toFixed(2)),
    cessAmount: parseFloat(totalItemCess.toFixed(2)),
    
    totalTaxAmount: parseFloat(totalTaxAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    paidAmount: 0,
    dueAmount: parseFloat(totalAmount.toFixed(2)),
  };
};

export const getPaymentStatus = (totalAmount, paidAmount) => {
  if (paidAmount >= totalAmount) return 'Paid';
  if (paidAmount > 0) return 'Partial';
  return 'Unpaid';
};

export const formatCurrency = (value) => {
  return parseFloat(value || 0).toFixed(2);
};
