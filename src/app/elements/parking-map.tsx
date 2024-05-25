import { getAugmentedParkingLocationData } from '@/parking-locations/location-helpers'
import ParkingMapPolygons from '@/parking-locations/map-visualization'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useCallback, useMemo, useRef, useState } from 'react'
import '../styles/button.css'
import { AugmentedParkingLocationData } from '@/parking-locations/types'

export function ParkingMap() {
  const [highlightedPath, setHighlightedPath] = useState<google.maps.LatLng[]>([]);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const libraries = useMemo(() => ['places'], [])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  const buttonAddedRef = useRef(false);


  const selectClosestParkingSpot = useCallback((map: google.maps.Map, userLatLong: google.maps.LatLng) => {
    const parkingLocations = getAugmentedParkingLocationData();
    let firstPoint = parkingLocations[0].path[0];
    let minDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLong, new google.maps.LatLng(firstPoint.lat, firstPoint.lng));
    let closestSpot: AugmentedParkingLocationData | null = parkingLocations[0];
  
    for (const location of parkingLocations) {
      for (const point of location.path) {
        const locationLatLong = new google.maps.LatLng(point.lat, point.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLong, locationLatLong);
        if (distance < minDistance) {
          closestSpot = location;
          minDistance = distance;
        }
      }
    }
  
    if (closestSpot) {
      const path = closestSpot.path.map(point => new google.maps.LatLng(point.lat, point.lng));
      setHighlightedPath(path);
    }
  }, []);


  
  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (!buttonAddedRef.current) {
      const reminderButton = document.createElement('button');
      reminderButton.textContent = 'Set a Reminder';
      reminderButton.className = 'custom-map-control-button';
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(reminderButton);
      buttonAddedRef.current = true;

      reminderButton.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              map.setCenter(userLatLong);
              selectClosestParkingSpot(map, userLatLong);
              // openReminderModal(); // Add logic to open reminder modal
            },
            () => {
              alert("Unable to retrieve your location. Please enable location services and try again.");
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      });
    }
  }, [selectClosestParkingSpot]);

  if (!isLoaded) {
    return <p>Loading map...</p>
  }

  const mapCenter = { lat: 59.380065, lng: 18.035959 } // Hardcoded to Bergshamra

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: true,
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string
  }

  const parkingLocations = getAugmentedParkingLocationData()

  return (
    <GoogleMap
      options={mapOptions}
      zoom={15}
      center={mapCenter}
      mapContainerStyle={{ width: '100%', height: '75vh' }}
      onLoad={(onMapLoad)}

    >
      <ParkingMapPolygons parkingLocations={parkingLocations} highlightedPath={highlightedPath} 
          onPolygonClick={(location) => {
            const path = location.path.map(point => new google.maps.LatLng(point.lat, point.lng));
            setHighlightedPath(path);
          }}/>
    </GoogleMap>
  )
}