import React, { useMemo } from "react";
import { Package, Search, Filter, ChevronRight } from "lucide-react";

const PosProductGrid = ({
  products,
  isLoading,
  searchQuery,
  addToCart,
  companies = [],
  selectedCompany,
  setSelectedCompany,
  selectedCategory,
  setSelectedCategory,
  theme
}) => {

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    return result;
  }, [products, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="loader" style={{ borderTopColor: 'var(--primary-color)' }}></div>
      </div>
    );
  }

  const companyList = [{ id: 'all', companyname: 'All Brands' }, ...companies];

  return (
    <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="w-48 border-r overflow-y-auto hidden md:block" 
        style={{ 
          backgroundColor: 'var(--bg-main)',
          borderColor: 'var(--sidebar-border)'
        }}
      >
        <div className="p-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Categories
          </h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                selectedCategory === 'all'
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
              }`}
              style={{ 
                color: 'var(--sidebar-text)',
                backgroundColor: selectedCategory === 'all' ? 'var(--primary-color)' : 'transparent'
              }}
            >
              All Products
            </button>
            <button
              onClick={() => setSelectedCategory('tablets')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                selectedCategory === 'tablets'
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
              }`}
              style={{ 
                color: 'var(--sidebar-text)',
                backgroundColor: selectedCategory === 'tablets' ? 'var(--primary-color)' : 'transparent'
              }}
            >
              Tablets
            </button>
            <button
              onClick={() => setSelectedCategory('syrups')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                selectedCategory === 'syrups'
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
              }`}
              style={{ 
                color: 'var(--sidebar-text)',
                backgroundColor: selectedCategory === 'syrups' ? 'var(--primary-color)' : 'transparent'
              }}
            >
              Syrups
            </button>
            <button
              onClick={() => setSelectedCategory('injections')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                selectedCategory === 'injections'
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
              }`}
              style={{ 
                color: 'var(--sidebar-text)',
                backgroundColor: selectedCategory === 'injections' ? 'var(--primary-color)' : 'transparent'
              }}
            >
              Injections
            </button>
            <button
              onClick={() => setSelectedCategory('ointments')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                selectedCategory === 'ointments'
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
              }`}
              style={{ 
                color: 'var(--sidebar-text)',
                backgroundColor: selectedCategory === 'ointments' ? 'var(--primary-color)' : 'transparent'
              }}
            >
              Ointments
            </button>
          </div>
        </div>

        <div className="p-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Brands
          </h3>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {companyList.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompany(comp.id)}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  selectedCompany === comp.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
                }`}
                style={{ 
                  color: 'var(--sidebar-text)',
                  backgroundColor: selectedCompany === comp.id ? 'var(--primary-color)' : 'transparent'
                }}
              >
                {comp.companyname}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredProducts.map((product) => {
            const isOutOfStock = (product.stock || 0) <= 0;

            return (
              <div
                key={product.id}
                onClick={() => !isOutOfStock && addToCart(product)}
                className={`pos-product-card ${isOutOfStock ? 'pos-out-of-stock' : ''}`}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)'
                }}
              >
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-sm line-clamp-1 leading-tight truncate group-hover:text-primary transition-colors"
                      style={{ color: 'var(--text-main)' }}
                      title={product.productname}
                    >
                      {product.productname}
                    </h3>
                    {!isOutOfStock && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                      >
                        +
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider truncate" style={{ color: 'var(--text-muted)' }}>
                    {product.packing || 'Strip'}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {product.company?.companyname || product.companyName || 'Unknown'}
                  </p>
                </div>

                <div className="mt-2 flex justify-between items-end">
                  <div className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Stock: <span className={product.stock > 0 ? "text-success font-bold" : "text-error"}>{product.stock || 0}</span>
                    {isOutOfStock && <span className="block text-[9px] font-bold text-error uppercase">Out of Stock</span>}
                  </div>
                  <div className="font-black text-base" style={{ color: 'var(--primary-color)' }}>
                    ₹{parseFloat(product.salerate || product.price || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-10" style={{ color: 'var(--text-muted)' }}>
              <Package size={48} className="mb-2 opacity-50"/>
              <p className="font-medium">No products found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosProductGrid;