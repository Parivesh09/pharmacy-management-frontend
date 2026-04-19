
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
        <div className="loader text-(--primary-color)"></div>
      </div>
    );
  }

  const companyList = [{ id: 'all', companyname: 'All Products' }, ...companies];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Categories Sidebar */}
      <div className="w-48 border-r border-gray-200 dark:border-white/10 bg-(--bg-main) overflow-y-auto hidden md:block">
        <div className="flex flex-col gap-1 p-2">
          {companyList.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedCompany(comp.id)}
              className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${selectedCompany === comp.id
                ? "bg-(--primary-color) text-white shadow-lg shadow-(--primary-color)/20"
                : "bg-(--card-bg) text-(--text-main) opacity-70 hover:opacity-100 hover:bg-(--sidebar-active-bg) border border-gray-100 dark:border-white/5"
                }`}
            >
              {comp.companyname}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {/* <div className="flex-1 overflow-y-auto p-4 bg-(--bg-main)">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-(--card-bg) rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-4 cursor-pointer hover:shadow-xl hover:border-(--primary-color) hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-36"
            >
              <div>
                <h3 className="font-bold text-(--text-main) text-sm line-clamp-2 leading-tight mb-1 group-hover:text-(--primary-color) transition-colors">
                  {product.productname}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.packing}</p>
              </div>
              
              <div className="mt-2 flex justify-between items-end">
                 <div className="text-[11px] text-gray-500 font-medium">
                    Stock: <span className={product.stock > 0 ? "text-green-500 font-bold" : "text-red-500"}>{product.stock || 0}</span>
                 </div>
                 <div className="font-black text-(--primary-color) text-base">
                    ₹{product.salerate || product.price || 0}
                 </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10">
                <Package size={48} className="mb-2 opacity-50"/>
                <p className="font-medium">No products found</p>
             </div>
          )}
        </div>
      </div> */}
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-(--bg-main)">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            // Check if product is out of stock
            const isOutOfStock = (product.stock || 0) <= 0;

            return (
              <div
                key={product.id}
                // logic update: Only call addToCart if stock is greater than 0
                onClick={() => !isOutOfStock && addToCart(product)}
                className={`bg-(--card-bg) rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-4 transition-all duration-300 flex flex-col justify-between group h-36 ${isOutOfStock
                  ? "opacity-60 cursor-not-allowed grayscale-[0.5]"
                  : "cursor-pointer hover:shadow-xl hover:border-(--primary-color) hover:-translate-y-1"
                  }`}
              >
                <div>
                  <h3 className="font-bold text-(--text-main) text-sm line-clamp-2 leading-tight mb-1 group-hover:text-(--primary-color) transition-colors">
                    {product.productname}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.packing}</p>
                </div>

                <div className="mt-2 flex justify-between items-end">
                  <div className="text-[11px] text-gray-500 font-medium">
                    Stock: <span className={product.stock > 0 ? "text-green-500 font-bold" : "text-red-500"}>
                      {product.stock || 0}
                    </span>
                    {isOutOfStock && <span className="block text-[9px] font-bold text-red-500 uppercase">Out of Stock</span>}
                  </div>
                  <div className="font-black text-(--primary-color) text-base">
                    ₹{product.salerate || product.price || 0}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PosProductGrid;
