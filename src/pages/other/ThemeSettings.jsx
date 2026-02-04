import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../services/userSlice';
import Card from '../../componets/common/Card';
import Button from '../../componets/common/Button';
import { Palette, Moon, Sun, Check } from 'lucide-react';

const ThemeSettings = () => {
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();

  const handleColorChange = (key, value) => {
    dispatch(setTheme({ [key]: value }));
  };

  const toggleDarkMode = () => {
    dispatch(setTheme({ mode: theme?.mode === 'dark' ? 'light' : 'dark' }));
  };

  const presetThemes = [
    { name: 'Default Teal', primary: '#008080', header: '#00505b', sidebar: '#ffffff' },
    { name: 'Classic Blue', primary: '#2563eb', header: '#1e40af', sidebar: '#ffffff' },
    { name: 'Deep Purple', primary: '#7c3aed', header: '#4c1d95', sidebar: '#ffffff' },
    { name: 'Sunset Orange', primary: '#ea580c', header: '#9a3412', sidebar: '#ffffff' },
    { name: 'Forest Green', primary: '#16a34a', header: '#14532d', sidebar: '#ffffff' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Palette className="w-8 h-8 text-teal-600" />
        <h1 className="text-3xl font-bold text-gray-800">Theme Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Appearance
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
              <div className="flex gap-4">
                <button
                  onClick={() => dispatch(setTheme({ mode: 'light' }))}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme?.mode === 'light' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Sun className="w-5 h-5" /> Light
                </button>
                <button
                  onClick={() => dispatch(setTheme({ mode: 'dark' }))}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme?.mode === 'dark' ? 'border-teal-600 bg-teal-900 text-teal-100' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Moon className="w-5 h-5" /> Dark
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex flex-wrap gap-3">
                {presetThemes.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => dispatch(setTheme({ primaryColor: p.primary, headerBg: p.header }))}
                    className="w-10 h-10 rounded-full shadow-sm hover:scale-110 transition-transform relative"
                    style={{ backgroundColor: p.primary }}
                    title={p.name}
                  >
                    {theme.primaryColor === p.primary && (
                      <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
                <div className="relative group">
                   <input 
                    type="color" 
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-full cursor-pointer border-none p-0 overflow-hidden"
                   />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Background</label>
              <input 
                type="color" 
                value={theme.headerBg}
                onChange={(e) => handleColorChange('headerBg', e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Live Preview</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg h-64 flex flex-col">
            {/* Header Preview */}
            <div className="h-10 px-4 flex items-center justify-between" style={{ backgroundColor: theme.headerBg }}>
               <div className="w-4 h-4 bg-white/20 rounded"></div>
               <div className="w-20 h-2 bg-white/20 rounded"></div>
               <div className="w-4 h-4 rounded-full bg-white/20"></div>
            </div>
            {/* Body Preview */}
            <div className="flex-1 flex" style={{ backgroundColor: theme?.mode === 'dark' ? '#1a202c' : '#f3f4f6' }}>
               <div className="w-12 border-r border-gray-200 p-2 space-y-2" style={{ backgroundColor: theme.sidebarBg }}>
                  <div className="w-full h-2 rounded" style={{ backgroundColor: theme.primaryColor, opacity: 0.2 }}></div>
                  <div className="w-full h-2 bg-gray-100 rounded"></div>
                  <div className="w-full h-2 bg-gray-100 rounded"></div>
               </div>
               <div className="flex-1 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                     <div className="h-12 bg-white rounded shadow-sm border-t-2" style={{ borderTopColor: theme.primaryColor }}></div>
                     <div className="h-12 bg-white rounded shadow-sm border-t-2" style={{ borderTopColor: theme.primaryColor }}></div>
                  </div>
                  <div className="h-24 bg-white rounded shadow-sm p-2 flex flex-col justify-end">
                     <div className="w-full h-1" style={{ backgroundColor: theme.primaryColor }}></div>
                  </div>
               </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <Button variant="outline" onClick={() => dispatch(setTheme({ primaryColor: '#008080', headerBg: '#00505b', mode: 'light' }))}>
                Reset to Default
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ThemeSettings;
