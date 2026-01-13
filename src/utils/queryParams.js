export function buildQueryParams(params = {}) {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle arrays (like groupIds)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          urlParams.append(key, value.join(','));
        }
      } else if (typeof value === 'object') {
        urlParams.append(key, JSON.stringify(value));
      } else {
        urlParams.append(key, value);
      }
    }
  });
  
  return urlParams.toString();
} 