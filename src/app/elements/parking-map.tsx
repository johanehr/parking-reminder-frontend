import { getAugmentedParkingLocationData } from '@/parking-locations/location-helpers'
import ParkingMapPolygons from '@/parking-locations/map-visualization'
import { AdvancedMarker, APIProvider, Circle, Map, useApiIsLoaded, useMap } from '@vis.gl/react-google-maps'
import { useCallback, useEffect, useState } from 'react'
import '../styles/button.css'
import { AugmentedParkingLocationData } from '@/parking-locations/types'
import { MapButton } from '@/components/MapButton'

import { userLocationCircleOptions, userLocationDotStyle } from '@/components/MapIcons'
import { filterLocationsByGeohash, geohashPrecision, getUserGeohashAndNeighbors, mapLocationsToDistances, sortByDistance } from '../../notifications/helper-functions/geoHashHelpers'
import { calculateLocationCenter } from '@/parking-locations/helper-functions/calculateLocationCenter'

const defaultCenter = { lat: 59.380065, lng: 18.035959 } // Hardcoded to Bergshamra

export function ParkingMap() {
  return (
    // 'geometry' backs the distance calculation used to find the nearest spot. The 'marker'
    // library needed for advanced markers is requested by AdvancedMarker itself.
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      libraries={['geometry']}
    >
      <ParkingMapContent />
    </APIProvider>
  )
}

function ParkingMapContent() {
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null)
  const [userLocationAccuracy, setUserLocationAccuracy] = useState<number | null>(null)
  const [focusedLocation, setFocusedLocation] = useState<google.maps.LatLng | null>(null)
  const [selectedParkingForDisplay, setSelectedParkingForDisplay] = useState<AugmentedParkingLocationData | null>(null)

  const isLoaded = useApiIsLoaded()
  const map = useMap()

  const selectClosestParkingSpot = useCallback((userLatLong: google.maps.LatLng) => {
    const parkingLocations = getAugmentedParkingLocationData()
    const userGeohashAndNeighbors = getUserGeohashAndNeighbors(userLatLong, geohashPrecision)
    const filteredLocations = filterLocationsByGeohash(userGeohashAndNeighbors, parkingLocations, geohashPrecision)
    const distances = mapLocationsToDistances(userLatLong, filteredLocations)
    const sortedDistances = distances.sort(sortByDistance)

    const closestSpot = sortedDistances.length > 0 ? sortedDistances[0].location : null

    if (closestSpot) {
      setSelectedParkingForDisplay(closestSpot)
    }
  }, [])

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
  }, [getUserLocation])

  // The map starts at the hardcoded default, so recentre once the user has been located
  useEffect(() => {
    if (map && userLocation) {
      map.panTo(userLocation)
    }
  }, [map, userLocation])

  useEffect(() => {
    if (userLocation && focusedLocation === null) {
      selectClosestParkingSpot(userLocation)
    }
  }, [userLocation, selectClosestParkingSpot, focusedLocation])


  if (!isLoaded) {
    return <p>Loading map...</p>
  }

  const parkingLocations = getAugmentedParkingLocationData()

  return (
    <div style={{ position: 'relative', width: '100%', height: '75vh' }}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string}
        defaultCenter={defaultCenter}
        defaultZoom={15}
        disableDefaultUI={true}
        clickableIcons={false}
        scrollwheel={true}
        style={{ width: '100%', height: '75vh' }}
      >
        {userLocation && (
          <>
            <AdvancedMarker
              position={userLocation}
              title="Your location is here"
              anchorLeft="-50%"
              anchorTop="-50%"
            >
              <div style={userLocationDotStyle} />
            </AdvancedMarker>
            {userLocationAccuracy && (
              <Circle
                center={userLocation}
                radius={userLocationAccuracy}
                {...userLocationCircleOptions}
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
              const center = calculateLocationCenter(location)
              setFocusedLocation(center)
              mapRef.panTo(center)
            }
          }}
        />
      </Map>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        {userLocation && <MapButton onClick={() => selectClosestParkingSpot(userLocation)} text={"Open nearest spot"} />}
      </div>
    </div>
  )
}
