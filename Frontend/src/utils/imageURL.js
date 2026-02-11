export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/150?text=No+Image';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Obtener la URL base dinámicamente
  const currentUrl = window.location.origin; // ej: http://192.168.1.6:5173
  const isLocalhost = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
  if (isLocalhost) {
    // En desarrollo (localhost)
    return `http://localhost:3000${imagePath}`;
  } else {
    // En producción (Electron)
    // Electron y backend están en el mismo origen
    return imagePath;
  }
};