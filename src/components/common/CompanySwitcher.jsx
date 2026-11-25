import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building, ChevronDown, Check, Plus } from 'lucide-react';
import { setuserCompanies } from '../../services/userSlice';
import { useSwitchCompanyMutation } from '../../services/userApi';

const CompanySwitcher = () => {
  const dispatch = useDispatch();
  const { user, activeCompany } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [switchCompany, { isLoading: switchLoading }] = useSwitchCompanyMutation();

  useEffect(() => {
    if (user?.companies) {
      setCompanies(user.companies);
    }
  }, [user]);

  const handleCompanySwitch = async (companyId) => {
    try {
      const response = await switchCompany({ companyId }).unwrap();
      dispatch(setActiveCompany(response.data.activeCompanyId));
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching company:', error);
    }
  };

  const handleCreateCompany = () => {
    
    window.location.href = '/create-company';
  };

  if (!user || companies.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
        <Building className="w-4 h-4" />
        <span className="text-sm">No Company</span>
      </div>
    );
  }

  const currentCompany = companies.find(c => c.id === activeCompany?.id) || companies[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        disabled={switchLoading}
      >
        <Building className="w-4 h-4" />
        <span className="text-sm font-medium truncate max-w-32">
          {currentCompany?.companyName || 'Select Company'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Switch Company</h3>
            <p className="text-xs text-gray-500 mt-1">
              Select a company to work with
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleCompanySwitch(company.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  company.id === userCompanies?.id ? 'bg-blue-50 text-blue-700' : ''
                }`}
                disabled={switchLoading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {company.companyName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {company.companyName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {company.businessType} • {company.branchCode}
                    </div>
                  </div>
                </div>
                
                {company.id === userCompanies?.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleCreateCompany}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Company
            </button>
          </div>
        </div>
      )}

      
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanySwitcher; 