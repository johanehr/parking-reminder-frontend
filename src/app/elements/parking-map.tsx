import ParkingMapPolygons from '@/parking-locations/map-visualization';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useMemo, useRef } from 'react';

export function ParkingMap() {

  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Laddar kartan...</p>;
  }
  
  const mapCenter = { lat: 59.380065, lng: 18.035959 } // Hardcoded to Bergshamra

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: true,
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string
  }

  return (
    <GoogleMap
      options={mapOptions}
      zoom={15}
      center={mapCenter}
      mapContainerStyle={{ width: '100%', height: '75vh' }}
      onLoad={() => console.log('Map Component Loaded...')}
    >
      <ParkingMapPolygons />
    </GoogleMap>
  )
}