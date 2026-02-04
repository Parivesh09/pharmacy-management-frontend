/**
 * Applies the theme objects to the document as CSS variables.
 * @param {Object} theme - The theme object from Redux state.
 */
export const applyTheme = (theme) => {
  if (!theme) return;

  const root = document.documentElement;

  if (theme.primaryColor) {
    root.style.setProperty('--primary-color', theme.primaryColor);
    // Generate a darker version for hover if needed, or just use the same
    root.style.setProperty('--primary-dark', shadeColor(theme.primaryColor, -20));
  }

  if (theme.headerBg) {
    root.style.setProperty('--header-bg', theme.headerBg);
  }

  if (theme.sidebarBg) {
    root.style.setProperty('--sidebar-bg', theme.sidebarBg);
  }

  if (theme.sidebarText) {
    root.style.setProperty('--sidebar-text', theme.sidebarText);
  }
  
  if (theme?.mode === 'dark') {
    root.classList.add('dark');
    root.style.setProperty('--bg-main', '#1a202c');
    root.style.setProperty('--card-bg', '#2d3748');
    root.style.setProperty('--text-main', '#f7fafc');
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--bg-main', '#f3f4f6');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--text-main', '#1a202c');
  }
};

/**
 * Helper to shade a color (darken or lighten)
 */
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}
