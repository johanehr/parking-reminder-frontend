import { getAugmentedParkingLocationData } from '@/parking-locations/location-helpers'
import ParkingMapPolygons from '@/parking-locations/map-visualization'
import { Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../styles/button.css'
import { AugmentedParkingLocationData } from '@/parking-locations/types'
import { MapButton } from '@/components/MapButton'
import { filterLocationsByGeohash, geohashPrecision, getUserGeohashAndNeighbors, mapLocationsToDistances, sortByDistance } from '@/parking-locations/helper-functions/geoHashHelpers'
import { userLocationCircleOptions, getUserLocationIcon } from '@/components/MapIcons'

export function ParkingMap() {
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null)
  const [userLocationAccuracy, setUserLocationAccuracy] = useState<number | null>(null)
  const [focusedLocation, setFocusedLocation] = useState<google.maps.LatLng | null>(null)
  const [userLocationIcon, setUserLocationIcon] = useState<google.maps.Symbol | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedParkingForDisplay, setSelectedParkingForDisplay] = useState<AugmentedParkingLocationData | null>(null)

  const libraries = useMemo(() => ['places'], [])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  })


  const selectClosestParkingSpot = useCallback((userLatLong: google.maps.LatLng) => {
    const parkingLocations = getAugmentedParkingLocationData();
    const userGeohashAndNeighbors = getUserGeohashAndNeighbors(userLatLong, geohashPrecision);
    const filteredLocations = filterLocationsByGeohash(userGeohashAndNeighbors, parkingLocations, geohashPrecision);
    const distances = mapLocationsToDistances(userLatLong, filteredLocations);
    const sortedDistances = distances.sort(sortByDistance);

    const closestSpot = sortedDistances.length > 0 ? sortedDistances[0].location : null;

    if (closestSpot) {
      setSelectedParkingForDisplay(closestSpot);
    }
  }, [isLoaded])

  const getUserLocation = useCallback(() => {
    if (!isLoaded) return // Some runtime issue with loading google is causing issues

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
          setUserLocation(userLatLong)
          setUserLocationAccuracy(position.coords.accuracy)
          selectClosestParkingSpot(userLatLong)
        },
        () => {
          alert("Unable to retrieve your location. Please click desired parking location manually to set reminder.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
    }
  }, [selectClosestParkingSpot, isLoaded])

  const handleSelectParkingSpotForDisplay = (location: AugmentedParkingLocationData | null) => {
    setSelectedParkingForDisplay(location)
  }

  useEffect(() => { 
    getUserLocation()
    const icon = getUserLocationIcon();
    setUserLocationIcon(icon);
  
  }, [getUserLocation])


  useEffect(() => {
    if (userLocation && focusedLocation === null) {
      selectClosestParkingSpot(userLocation)
    }
  }, [userLocation, selectClosestParkingSpot, focusedLocation])


  if (!isLoaded) {
    return <p>Loading map...</p>
  }

  const defaultCenter = { lat: 59.380065, lng: 18.035959 } // Hardcoded to Bergshamra
  const mapCenter = userLocation || focusedLocation || defaultCenter

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
          mapRef.current = map
          if (userLocation) {
            selectClosestParkingSpot(userLocation)
          }
        }}
      >
        {userLocation && (
             <>
             {userLocationIcon && (
               <Marker
                 position={userLocation}
                 title="Your location is here"
                 icon={userLocationIcon}
               />
             )}
             {userLocationAccuracy && (
               <Circle
                 center={userLocation}
                 radius={userLocationAccuracy}
                 options={userLocationCircleOptions}
               />
             )}
           </>
        )}
        <ParkingMapPolygons
          handleSelectParkingSpotForDisplay={handleSelectParkingSpotForDisplay}
          selectedParkingForDisplay={selectedParkingForDisplay}
          parkingLocations={parkingLocations}
          onPolygonClick={(location, mapRef) => {
            if (mapRef) {
              const maxLat = Math.max(...location.path.map(point => point.lat))
              const minLat = Math.min(...location.path.map(point => point.lat))
              const midLat = (maxLat + minLat) / 2

              const maxLng = Math.max(...location.path.map(point => point.lng))
              const minLng = Math.min(...location.path.map(point => point.lng))
              const midLng = (maxLng + minLng) / 2

              const center = new google.maps.LatLng({ lat: midLat, lng: midLng })
              setFocusedLocation(center)
              mapRef.panTo(center)
            }
          }}
        />
      </GoogleMap>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        {userLocation && <MapButton onClick={() => selectClosestParkingSpot(userLocation)} text={"Open nearest spot"} />}
      </div>
    </div>
  )
}
