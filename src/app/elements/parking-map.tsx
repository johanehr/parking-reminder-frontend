import { getAugmentedParkingLocationData } from '@/parking-locations/location-helpers'
import ParkingMapPolygons from '@/parking-locations/map-visualization'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../styles/button.css'
import { AugmentedParkingLocationData } from '@/parking-locations/types'
import { MapButton } from '@/components/MapButton'

export function ParkingMap() {
  const [highlightedPath, setHighlightedPath] = useState<google.maps.LatLng[]>([]);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [reminderMode, setReminderMode] = useState(false)
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [buttonText, setButtonText] = useState("Set a Reminder")
  const mapRef = useRef<google.maps.Map | null>(null);



  const libraries = useMemo(() => ['places'], [])
  const googleMaps = window.google.maps;

  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  })
  
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

  const handleButtonClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLatLong);
          setButtonText("Choose a Location");
          if (mapRef.current) {
            selectClosestParkingSpot(mapRef.current, userLatLong);
          } 
        },
        () => {
          alert("Unable to retrieve your location. Please enable location services and try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, [selectClosestParkingSpot]);



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLatLong);
        },
        () => {
          console.warn("Unable to retrieve your location. Falling back to default center.");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && selectedLocation === null && mapRef.current) {
      selectClosestParkingSpot(mapRef.current, userLocation);
    }
  }, [userLocation, selectClosestParkingSpot, selectedLocation]);




  if (!isLoaded) {
    return <p>Loading map...</p>
  }

  const defaultCenter = { lat: 59.380065, lng: 18.035959 } // Hardcoded to Bergshamra
  const mapCenter = userLocation || selectedLocation || defaultCenter;

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: true,
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string
  }

  const parkingLocations = getAugmentedParkingLocationData()

  return (
    <div style={{ position: 'relative', width: '100%', height: '75vh' }}>
      <GoogleMap
        options={mapOptions}
        zoom={15}
        center={mapCenter}
        mapContainerStyle={{ width: '100%', height: '75vh' }}
        onLoad={map => {
          mapRef.current = map;
          if (userLocation) {
            selectClosestParkingSpot(map, userLocation);
          }
        }}
      >
        <ParkingMapPolygons
          parkingLocations={parkingLocations}
          highlightedPath={highlightedPath}
          onPolygonClick={(location, mapRef) => {
            const googleMaps = window.google.maps;
            const path = location.path.map(point => new googleMaps.LatLng(point.lat, point.lng));
            setHighlightedPath(path);
            if (mapRef) {
              const maxLat = Math.max(...location.path.map(point => point.lat));
              const minLat = Math.min(...location.path.map(point => point.lat));
              const midLat = (maxLat + minLat) / 2;

              const maxLng = Math.max(...location.path.map(point => point.lng));
              const minLng = Math.min(...location.path.map(point => point.lng));
              const midLng = (maxLng + minLng) / 2;

              const center = new google.maps.LatLng({ lat: midLat, lng: midLng });
              setSelectedLocation(center)
              mapRef.setCenter(center);

            }
          }}
        />
      </GoogleMap>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        <MapButton onClick={handleButtonClick} text={buttonText} />
      </div>
    </div>
  )
}