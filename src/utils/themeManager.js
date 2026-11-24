/**
 * Theme Manager - Applies theme to CSS variables
 * Handles both light and dark modes with full color palette
 */

export const applyTheme = (theme) => {
  if (!theme) return;

  const root = document.documentElement;

  const primaryColor = theme.primaryColor || '#008080';
  const headerBg = theme.headerBg || '#00505b';
  const sidebarBg = theme.sidebarBg || '#ffffff';
  const sidebarText = theme.sidebarText || '#374151';
  const mode = theme.mode || 'light';

  root.style.setProperty('--primary-color', primaryColor);
  root.style.setProperty('--primary-dark', shadeColor(primaryColor, -20));
  root.style.setProperty('--primary-light', shadeColor(primaryColor, 20));
  root.style.setProperty('--header-bg', headerBg);
  root.style.setProperty('--sidebar-bg', sidebarBg);
  root.style.setProperty('--sidebar-text', sidebarText);

  if (mode === 'dark') {
    root.classList.add('dark');
    root.style.setProperty('--bg-main', '#0f172a');
    root.style.setProperty('--bg-secondary', '#1e293b');
    root.style.setProperty('--card-bg', '#1e293b');
    root.style.setProperty('--card-border', '#334155');
    root.style.setProperty('--text-main', '#f8fafc');
    root.style.setProperty('--text-secondary', '#cbd5e1');
    root.style.setProperty('--text-muted', '#64748b');
    root.style.setProperty('--sidebar-border', '#334155');
    root.style.setProperty('--sidebar-active-bg', '#004d4d');
    root.style.setProperty('--sidebar-active-text', '#5eead4');
    root.style.setProperty('--sidebar-hover-bg', '#1e293b');
    root.style.setProperty('--input-bg', '#1e293b');
    root.style.setProperty('--input-border', '#475569');
    root.style.setProperty('--input-focus-border', '#5eead4');
    root.style.setProperty('--input-focus-ring', 'rgba(94, 234, 212, 0.2)');
    root.style.setProperty('--button-primary-bg', '#0d9488');
    root.style.setProperty('--button-primary-hover', '#14b8a6');
    root.style.setProperty('--button-secondary-bg', '#1e293b');
    root.style.setProperty('--button-secondary-text', '#e2e8f0');
    root.style.setProperty('--button-secondary-hover', '#334155');
    root.style.setProperty('--table-header-bg', '#0d9488');
    root.style.setProperty('--table-row-hover', '#004d4d');
    root.style.setProperty('--table-border', '#334155');
    root.style.setProperty('--modal-bg', '#1e293b');
    root.style.setProperty('--modal-border', '#334155');
    root.style.setProperty('--success-bg', '#064e3b');
    root.style.setProperty('--success-text', '#a7f3d0');
    root.style.setProperty('--warning-bg', '#78350f');
    root.style.setProperty('--warning-text', '#fde68a');
    root.style.setProperty('--error-bg', '#7f1d1d');
    root.style.setProperty('--error-text', '#fca5a5');
    root.style.setProperty('--info-bg', '#1e3a5f');
    root.style.setProperty('--info-text', '#93c5fd');
    root.style.setProperty('--scrollbar-track', '#0f172a');
    root.style.setProperty('--scrollbar-thumb', '#0d9488');
    root.style.setProperty('--scrollbar-thumb-hover', '#14b8a6');
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--bg-main', '#f3f4f6');
    root.style.setProperty('--bg-secondary', '#e5e7eb');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--card-border', '#e5e7eb');
    root.style.setProperty('--text-main', '#1a202c');
    root.style.setProperty('--text-secondary', '#4a5568');
    root.style.setProperty('--text-muted', '#9ca3af');
    root.style.setProperty('--sidebar-border', '#e5e7eb');
    root.style.setProperty('--sidebar-active-bg', '#eff6ff');
    root.style.setProperty('--sidebar-active-text', '#2563eb');
    root.style.setProperty('--sidebar-hover-bg', '#f3f4f6');
    root.style.setProperty('--input-bg', '#ffffff');
    root.style.setProperty('--input-border', '#d1d5db');
    root.style.setProperty('--input-focus-border', '#008080');
    root.style.setProperty('--input-focus-ring', 'rgba(0, 128, 128, 0.2)');
    root.style.setProperty('--button-primary-bg', '#008080');
    root.style.setProperty('--button-primary-hover', '#006666');
    root.style.setProperty('--button-secondary-bg', '#f3f4f6');
    root.style.setProperty('--button-secondary-text', '#374151');
    root.style.setProperty('--button-secondary-hover', '#e5e7eb');
    root.style.setProperty('--table-header-bg', '#008080');
    root.style.setProperty('--table-row-hover', '#eff6ff');
    root.style.setProperty('--table-border', '#e5e7eb');
    root.style.setProperty('--modal-bg', '#ffffff');
    root.style.setProperty('--modal-border', '#e5e7eb');
    root.style.setProperty('--success-bg', '#ecfdf5');
    root.style.setProperty('--success-text', '#065f46');
    root.style.setProperty('--warning-bg', '#fffbeb');
    root.style.setProperty('--warning-text', '#92400e');
    root.style.setProperty('--error-bg', '#fef2f2');
    root.style.setProperty('--error-text', '#991b1b');
    root.style.setProperty('--info-bg', '#eff6ff');
    root.style.setProperty('--info-text', '#1e40af');
    root.style.setProperty('--scrollbar-track', '#ffffff');
    root.style.setProperty('--scrollbar-thumb', '#008080');
    root.style.setProperty('--scrollbar-thumb-hover', '#006666');
  }
};

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
}

export const getDefaultTheme = () => ({
  primaryColor: '#008080',
  headerBg: '#00505b',
  sidebarBg: '#ffffff',
  sidebarText: '#374151',
  mode: 'light'
});

export const getDarkThemeDefaults = () => ({
  primaryColor: '#008080',
  headerBg: '#022c2c',
  sidebarBg: '#0f172a',
  sidebarText: '#e2e8f0',
  mode: 'dark'
});

export const generateThemeFromPrimary = (primaryColor, mode = 'light') => {
  const headerBg = mode === 'dark' ? shadeColor(primaryColor, -40) : shadeColor(primaryColor, -20);
  const sidebarBg = mode === 'dark' ? '#0f172a' : '#ffffff';
  const sidebarText = mode === 'dark' ? '#e2e8f0' : '#374151';
  
  return {
    primaryColor,
    headerBg,
    sidebarBg,
    sidebarText,
    mode
  };
};

export const presetThemes = [
  { name: 'Default Teal', primary: '#008080', header: '#00505b' },
  { name: 'Classic Blue', primary: '#2563eb', header: '#1e40af' },
  { name: 'Deep Purple', primary: '#7c3aed', header: '#4c1d95' },
  { name: 'Sunset Orange', primary: '#ea580c', header: '#9a3412' },
  { name: 'Forest Green', primary: '#16a34a', header: '#14532d' },
  { name: 'Rose Pink', primary: '#e11d48', header: '#9f1239' },
  { name: 'Amber Gold', primary: '#d97706', header: '#92400e' },
  { name: 'Slate Gray', primary: '#475569', header: '#1e293b' },
];

export const darkPresetThemes = presetThemes.map(p => ({
  ...p,
  header: shadeColor(p.primary, -40)
}));