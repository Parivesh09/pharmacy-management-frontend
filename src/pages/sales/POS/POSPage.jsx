import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import PosHeader from "./components/PosHeader";
import PosProductGrid from "./components/PosProductGrid";
import PosCart from "./components/PosCart";
import { useGetItemsQuery } from "../../../services/itemApi";
import { useGetCompaniesQuery } from "../../../services/companyApi";
import { calculateBillTotals } from "../../../utils/billCalculations";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const POSPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [rawCartItems, setRawCartItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const theme = useSelector((state) => state.user.theme);

  const { data: companyData } = useGetCompaniesQuery({ limit: 1000, isActive: true });
  const companies = companyData?.data || [];

  const queryOptions = {
    limit: 200,
    search: searchQuery,
    filters: {}
  };

  if (selectedCompany !== "all") {
    queryOptions.filters.company = selectedCompany;
  }

  const { data: itemsData, isLoading, refetch } = useGetItemsQuery(queryOptions);

  const products = useMemo(() => {
    let result = itemsData?.data || [];
    
    if (selectedCategory !== 'all') {
      result = result.filter(p => {
        const name = (p.productname || '').toLowerCase();
        if (selectedCategory === 'tablets') return name.includes('tab') || name.includes('cap');
        if (selectedCategory === 'syrups') return name.includes('syr') || name.includes('susp');
        if (selectedCategory === 'injections') return name.includes('inj') || name.includes('vial');
        if (selectedCategory === 'ointments') return name.includes('oint') || name.includes('cream') || name.includes('gel');
        return true;
      });
    }
    
    return result;
  }, [itemsData?.data, selectedCategory]);

  const billCalculations = useMemo(() => {
    const baseCalc = calculateBillTotals(rawCartItems);
    
    const expensesTotal = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    
    return {
       ...baseCalc,
       expenses,
       expensesTotal,
       totalAmount: baseCalc.totalAmount + expensesTotal
    };
  }, [rawCartItems, expenses]);

  const addToCart = useCallback((product) => {
    setRawCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productname: product.productname, 
          itemId: product.id,
          batchId: product.batchId,
          batch: product.batch,
          expDate: product.expiryDate,
          mrp: product.mrp,
          rate: product.salerate || product.price || 0,
          quantity: 1,
          discountPercent: 0,
          igstPercent: product.TaxCategoryDetail?.igstPercentage || 0,
          cgstPercent: product.TaxCategoryDetail?.cgstPercentage || 0,
          sgstPercent: product.TaxCategoryDetail?.sgstPercentage || 0,
          cessPercent: product.TaxCategoryDetail?.cessPercentage || 0,
        },
      ];
    });
  }, []);

  const updateCartItem = useCallback((id, field, value) => {
    setRawCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newValue = typeof value === 'function' ? value(item[field]) : value;
          return { ...item, [field]: parseFloat(newValue) || 0 };
        }
        return item;
      })
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setRawCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setRawCartItems([]);
    setSelectedCustomer(null);
    setExpenses([]);
  }, []);

  const handleBarcodeScan = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.focus();
    
    const handler = (e) => {
      if (e.key === 'Enter') {
        const barcode = input.value.trim();
        input.remove();
        document.body.removeEventListener('keydown', handler);
        
        if (barcode) {
          const product = products.find(p => p.barcode === barcode || p.itemCode === barcode);
          if (product) {
            addToCart(product);
            toast.success(`Added: ${product.productname}`);
          } else {
            toast.error('Product not found for barcode: ' + barcode);
          }
        }
      }
    };
    
    document.body.addEventListener('keydown', handler);
    
    setTimeout(() => {
      input.remove();
      document.body.removeEventListener('keydown', handler);
    }, 5000);
  }, [products, addToCart]);

  const handleToggleTheme = useCallback(() => {
    // Theme toggle is handled by Header component
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      switch (e.key) {
        case 'F2':
          e.preventDefault();
          document.querySelector('input[placeholder*="Search"]')?.focus();
          break;
        case 'F3':
          e.preventDefault();
          document.querySelector('button[title*="Patient"]')?.click();
          break;
        case 'F4':
          e.preventDefault();
          document.querySelector('button[title*="Hold"]')?.click();
          break;
        case 'F5':
          e.preventDefault();
          document.querySelector('button[title*="Print"]')?.click();
          break;
        case 'F9':
          e.preventDefault();
          handleBarcodeScan();
          break;
        case 'Escape':
          e.preventDefault();
          document.querySelector('button[title*="Close"]')?.click();
          break;
        case 'Enter':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            document.querySelector('button[title*="Payment"]')?.click();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBarcodeScan]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-main overflow-hidden tracking-tight"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 flex flex-col border-r" style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}>
          <PosHeader 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onBarcodeScan={handleBarcodeScan}
          />
          <PosProductGrid 
            products={products} 
            isLoading={isLoading} 
            searchQuery={searchQuery}
            addToCart={addToCart}
            companies={companies}
            selectedCompany={selectedCompany}
            setSelectedCompany={selectedCompany}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            theme={theme}
          />
        </div>

        <div className="w-1/3 flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
          <PosCart 
            cartItems={billCalculations.items} 
            billCalculations={billCalculations}
            updateCartItem={updateCartItem} 
            removeFromCart={removeFromCart}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            clearCart={clearCart}
            expenses={expenses}
            setExpenses={setExpenses}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};

export default POSPage;