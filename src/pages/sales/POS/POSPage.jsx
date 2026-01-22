
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PosHeader from "./components/PosHeader";
import PosProductGrid from "./components/PosProductGrid";
import PosCart from "./components/PosCart";
import { useGetItemsQuery } from "../../../services/itemApi";
import { useGetCompaniesQuery } from "../../../services/companyApi";
import { calculateBillTotals } from "../../../utils/billCalculations";

const POSPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [rawCartItems, setRawCartItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch companies
  const { data: companyData } = useGetCompaniesQuery({ limit: 1000, isActive: true });
  const companies = companyData?.data || [];

  // Fetch items
  const queryOptions = {
    limit: 100,
    search: searchQuery,
    filters: {}
  };

  if (selectedCompany !== "all") {
    queryOptions.filters.company = selectedCompany;
  }

  const { data: itemsData, isLoading, refetch } = useGetItemsQuery(queryOptions);

  const products = itemsData?.data || [];

  // Calculate totals
  const billCalculations = useMemo(() => {
    const baseCalc = calculateBillTotals(rawCartItems);
    
    // Add expenses to total
    const expensesTotal = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    
    return {
       ...baseCalc,
       expenses,
       expensesTotal,
       totalAmount: baseCalc.totalAmount + expensesTotal
    };
  }, [rawCartItems, expenses]);

  const addToCart = (product) => {
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
          // Tax info
          igstPercent: product.TaxCategoryDetail?.igstPercentage || 0,
          cgstPercent: product.TaxCategoryDetail?.cgstPercentage || 0,
          sgstPercent: product.TaxCategoryDetail?.sgstPercentage || 0,
          cessPercent: product.TaxCategoryDetail?.cessPercentage || 0,
        },
      ];
    });
  };

  const updateCartItem = (id, field, value) => {
    setRawCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: parseFloat(value) || 0 };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setRawCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  
  const clearCart = () => {
      setRawCartItems([]);
      setSelectedCustomer(null);
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Product Grid */}
        <div className="w-2/3 flex flex-col border-r border-gray-200 bg-white">
          <PosHeader 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <PosProductGrid 
            products={products} 
            isLoading={isLoading} 
            searchQuery={searchQuery}
            addToCart={addToCart}
            companies={companies}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          />
        </div>

        {/* Right Side - Cart/Bill */}
        <div className="w-1/3 flex flex-col bg-gray-50">
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
           />
        </div>
      </div>
    </div>
  );
};

export default POSPage;
