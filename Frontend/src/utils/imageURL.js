import { getBackendUrl } from './networkUtils'

export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/150?text=No+Image';
  }
  
  // Si ya es una URL completa, usarla directamente
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Usar la misma detección automática que axios y socket
  const baseUrl = getBackendUrl()
  return `${baseUrl}${imagePath}`
};