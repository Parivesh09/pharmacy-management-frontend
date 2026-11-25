import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import Input from '../../../../components/common/Input';
import Select from '../../../../components/common/Select';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Loader from '../../../../components/common/Loader';
import IconButton from '../../../../components/common/IconButton';

export default function PartyLedger (){

  const [activeTab, setActiveTab] = useState('GST/Tax Details');
  const [formData, setFormData] = useState({
    partyName: 'Asasa',
    accountGroup: 'Sundry Debtors',
    station: '',
    mailTo: '',
    address: '',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    currency: '',
    parentLedger: '',
    balancingMethod: 'Bill By Bill',
    openingBalance: '0.00',
    creditDays: '0',
    phoneOffice: '+91',
    mobileNo: '+91',
    whatsappNo: '+91',
    ledgerType: 'Unregistered',
    tdsApplicable: 'No',
    panNo: ''
  });

  const tabs = [
    'GST/Tax Details',
    'Licence Info', 
    'Contact Info',
    'Bank Details',
    'Others'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-max mx-auto">
        
        <div className="flex items-center justify-start mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Create Party</h1>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            
            
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">General Info</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.partyName}
                      onChange={(e) => handleInputChange('partyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Group <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.accountGroup}
                      onChange={(e) => handleInputChange('accountGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Station <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search here.."
                        value={formData.station}
                        onChange={(e) => handleInputChange('station', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                     
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mail to</label>
                    <Input
                      type="text"
                      value={formData.mailTo}
                      onChange={(e) => handleInputChange('mailTo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <Input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <Select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Currency</option>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Ledger</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search here.."
                        value={formData.parentLedger}
                        onChange={(e) => handleInputChange('parentLedger', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Balance</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Balancing Method</label>
                    <Select
                      value={formData.balancingMethod}
                      onChange={(e) => handleInputChange('balancingMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Bill By Bill">Bill By Bill</option>
                      <option value="On Account">On Account</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">₹</span>
                      <Input
                        type="text"
                        value={formData.openingBalance}
                        onChange={(e) => handleInputChange('openingBalance', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Select className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Dr">Dr</option>
                        <option value="Cr">Cr</option>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit Days</label>
                    <Input
                      type="text"
                      value={formData.creditDays}
                      onChange={(e) => handleInputChange('creditDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Contact Numbers</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone No.(Office)</label>
                    <Input
                      type="text"
                      value={formData.phoneOffice}
                      onChange={(e) => handleInputChange('phoneOffice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile No. 1 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={formData.mobileNo}
                        onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp No</label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={formData.whatsappNo}
                        onChange={(e) => handleInputChange('whatsappNo', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <IconButton
                        icon={Plus}
                        onClick={() => {}}
                        variant="outline"
                        size="sm"
                        title="Add WhatsApp"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="border-t border-gray-200">
            <div className="flex">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-teal-600 text-teal-600 bg-teal-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>

            
            <div className="p-6">
              {activeTab === 'GST/Tax Details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Type</label>
                      <Select
                        value={formData.ledgerType}
                        onChange={(e) => handleInputChange('ledgerType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Unregistered">Unregistered</option>
                        <option value="Registered">Registered</option>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TDS Applicable</label>
                      <Select
                        value={formData.tdsApplicable}
                        onChange={(e) => handleInputChange('tdsApplicable', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN No.</label>
                    <Input
                      type="text"
                      value={formData.panNo}
                      onChange={(e) => handleInputChange('panNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              {activeTab !== 'GST/Tax Details' && (
                <div className="text-center py-8 text-gray-500">
                  {activeTab} content would go here
                </div>
              )}
            </div>
          </div>

          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">F4</span>
                  Switch Tab
                </div>
                <Button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                  GST Verification
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">F10</span>
                  <Button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2">
                    Save
                    <span className="text-xs">📄</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">F9</span>
                  <Button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Clear
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</span>
                  <Button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Close ✕
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



