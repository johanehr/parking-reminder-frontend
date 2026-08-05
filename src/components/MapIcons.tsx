import { CSSProperties } from 'react'

/**
 * AdvancedMarkerElement renders DOM nodes rather than the google.maps.Symbol shapes the
 * deprecated google.maps.Marker accepted, so the blue "you are here" dot is styled as an
 * element. The box-shadow stands in for the old 2px white stroke, keeping the element's
 * layout size equal to the dot itself.
 */
export const userLocationDotStyle: CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: '#4285F4',
  boxShadow: '0 0 0 2px #FFFFFF',
}

export const userLocationCircleOptions = {
  fillColor: '#4285F4',
  fillOpacity: 0.2,
  strokeColor: '#4285F4',
  strokeOpacity: 0.4,
  strokeWeight: 1,
  zIndex: 0,
}
