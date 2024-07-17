
interface ILocationPoint {
  lat: number;
  lng: number;
}

interface ILocation {
  path: ILocationPoint[];
}

export const calculateLocationCenter = (location: ILocation): google.maps.LatLng  => {
  const maxLat = Math.max(...location.path.map(point => point.lat))
  const minLat = Math.min(...location.path.map(point => point.lat))
  const midLat = (maxLat + minLat) / 2

  const maxLng = Math.max(...location.path.map(point => point.lng))
  const minLng = Math.min(...location.path.map(point => point.lng))
  const midLng = (maxLng + minLng) / 2

  return new google.maps.LatLng({ lat: midLat, lng: midLng })
}