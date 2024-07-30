import { fetchAndAugmentParkingLocationData } from '@/parking-locations/location-helpers'
import ParkingMapPolygons from '@/parking-locations/map-visualization'
import { Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../styles/button.css'
import { AugmentedParkingLocationData } from '@/parking-locations/types'
import { MapButton } from '@/components/MapButton'

import { userLocationCircleOptions, getUserLocationIcon } from '@/components/MapIcons'
import { filterLocationsByGeohash, geohashPrecision, getUserGeohashAndNeighbors, mapLocationsToDistances, sortByDistance } from '../../notifications/helper-functions/geoHashHelpers'
import { calculateLocationCenter } from '@/parking-locations/helper-functions/calculateLocationCenter'

export function ParkingMap() {
  const [parkingLocations, setParkingLocations] = useState<AugmentedParkingLocationData[]>([])
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null)
  const [userLocationAccuracy, setUserLocationAccuracy] = useState<number | null>(null)
  const [focusedLocation, setFocusedLocation] = useState<google.maps.LatLng | null>(null)
  const [userLocationIcon, setUserLocationIcon] = useState<google.maps.Symbol | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedParkingForDisplay, setSelectedParkingForDisplay] = useState<AugmentedParkingLocationData | null>(null)

  const libraries = useMemo(() => ['places'], [])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  })
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAndAugmentParkingLocationData()
        setParkingLocations(data)
      } catch (error) {
        console.error('Error fetching parking locations:', error)
      }
    }

    fetchData()
  }, [])

  const selectClosestParkingSpot = useCallback(async (userLatLong: google.maps.LatLng) => {
    try {
      const userGeohashAndNeighbors = getUserGeohashAndNeighbors(userLatLong, geohashPrecision)
      const filteredLocations = filterLocationsByGeohash(userGeohashAndNeighbors, parkingLocations, geohashPrecision)
      const distances = mapLocationsToDistances(userLatLong, filteredLocations)
      const sortedDistances = distances.sort(sortByDistance)

      const closestSpot = sortedDistances.length > 0 ? sortedDistances[0].location : null

      if (closestSpot) {
        setSelectedParkingForDisplay(closestSpot)
      }
    } catch (error) {
      console.log(error, "error selecting parking spot")
    }
  }, [parkingLocations])

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
    const icon = getUserLocationIcon()
    setUserLocationIcon(icon)
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
              const center = calculateLocationCenter(location)
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
