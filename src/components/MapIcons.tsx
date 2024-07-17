export const getUserLocationIcon = (): google.maps.Symbol | null => {
  if (typeof window !== "undefined" && window.google) {
    const icon: google.maps.Symbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
    }
    return icon
  }
  return null
}

export const userLocationCircleOptions = {
  fillColor: '#4285F4',
  fillOpacity: 0.2,
  strokeColor: '#4285F4',
  strokeOpacity: 0.4,
  strokeWeight: 1,
  zIndex: 0,
}