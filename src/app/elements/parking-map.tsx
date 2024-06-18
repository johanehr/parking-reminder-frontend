import { getAugmentedParkingLocationData } from '@/parking-locations/location-helpers'
import ParkingMapPolygons from '@/parking-locations/map-visualization'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../styles/button.css'
import { AugmentedParkingLocationData } from '@/parking-locations/types'
import { MapButton } from '@/components/MapButton'

export function ParkingMap() {
  const [highlightedPath, setHighlightedPath] = useState<google.maps.LatLng[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const [focusedLocation, setFocusedLocation] = useState<google.maps.LatLng | null>(null);
  const [buttonText, setButtonText] = useState("Set a Reminder")
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedParkingForDisplay, setSelectedParkingForDisplay] = useState<AugmentedParkingLocationData | null>(null)
  const [reminderMode, setReminderMode] = useState(false)



  const libraries = useMemo(() => ['places'], [])


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  const selectClosestParkingSpot = useCallback((userLatLong: google.maps.LatLng) => {
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
      setSelectedParkingForDisplay(closestSpot)
    }
  }, []);

  const handleMapButtonClick = useCallback(() => {
    setReminderMode(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setUserLocation(userLatLong);
          setButtonText("Choose a different location");
          selectClosestParkingSpot(userLatLong);
        },
        () => {
          alert("Unable to retrieve your location. Please choose desired parking location manually.");
          setButtonText("Choose a location manually");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, [selectClosestParkingSpot]);

  const handleSelectParkingSpotForDisplay = (location: AugmentedParkingLocationData | null) => {
    setSelectedParkingForDisplay(location)
  }


  useEffect(() => {
    if (userLocation && focusedLocation === null) {
      selectClosestParkingSpot(userLocation);
    }
  }, [userLocation, selectClosestParkingSpot, focusedLocation]);


  if (!isLoaded) {
    return <p>Loading map...</p>
  }

  const defaultCenter = { lat: 59.380065, lng: 18.035959 } // Hardcoded to Bergshamra
  const mapCenter = userLocation || focusedLocation || defaultCenter;

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
            selectClosestParkingSpot(userLocation);
          }
        }}
      >
        <ParkingMapPolygons
          reminderMode={reminderMode}
          handleSelectParkingSpotForDisplay={handleSelectParkingSpotForDisplay}
          selectedParkingForDisplay={selectedParkingForDisplay}
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
              setFocusedLocation(center)
              mapRef.setCenter(center);

            }
          }}
        />
      </GoogleMap>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        <MapButton onClick={handleMapButtonClick} text={buttonText} />
      </div>
    </div>
  )
}