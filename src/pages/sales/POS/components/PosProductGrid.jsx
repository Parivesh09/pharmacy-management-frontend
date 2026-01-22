
import React, { useMemo } from "react";
import { Package } from "lucide-react";

const PosProductGrid = ({ 
  products, 
  isLoading, 
  searchQuery, 
  addToCart, 
  companies = [],
  selectedCompany,
  setSelectedCompany 
}) => {
  
  // Products are already filtered by the parent component via API
  const filteredProducts = products;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loader text-blue-600"></div>
      </div>
    );
  }

  const companyList = [{ id: 'all', companyname: 'All Products' }, ...companies];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Categories Sidebar */}
      <div className="w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto hidden md:block">
        <div className="flex flex-col gap-1 p-2">
          {companyList.map((comp) => (
             <button
               key={comp.id}
               onClick={() => setSelectedCompany(comp.id)}
               className={`text-left px-3 py-2 text-xs font-medium rounded transition-colors ${
                 selectedCompany === comp.id
                   ? "bg-blue-600 text-white shadow-md"
                   : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
               }`}
             >
               {comp.companyname}
             </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group h-32"
            >
              <div>
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-1">
                  {product.productname}
                </h3>
                <p className="text-xs text-gray-400 capitalize">{product.packing}</p>
              </div>
              
              <div className="mt-2 flex justify-between items-end">
                 <div className="text-xs text-gray-500">
                    Stock: <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-500"}>{product.stock || 0}</span>
                 </div>
                 <div className="font-bold text-blue-600">
                    ₹{product.salerate || product.price || 0}
                 </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10">
                <Package size={48} className="mb-2 opacity-50"/>
                <p>No products found</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosProductGrid;
