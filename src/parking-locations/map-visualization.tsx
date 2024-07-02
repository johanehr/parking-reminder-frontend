import { InfoWindow, Polygon, useGoogleMap } from '@react-google-maps/api'
import { Fragment } from 'react'
import React from 'react'
import { AugmentedParkingLocationData, CleaningTime, DayOfWeek, ParkingRules } from './types'
import NotificationModal from '@/components/NotificationModal';
import { MapButton } from '@/components/MapButton';

interface ParkingMapPolygonsProps {
  parkingLocations: AugmentedParkingLocationData[];
  highlightedPath: google.maps.LatLng[];
  onPolygonClick: (location: AugmentedParkingLocationData, mapRef: google.maps.Map) => void;
  handleSelectParkingSpotForDisplay: (location: AugmentedParkingLocationData | null) => void;
  selectedParkingForDisplay: AugmentedParkingLocationData | null;
  reminderMode: boolean
  handleMapButtonClick: () => void;
}


export function getCleaningDayDescription(cleaningTime: CleaningTime): string {

  const oddEvenAll = (even: boolean, odd: boolean) => (even && odd) ? 'Alla' : (even ? 'Jämna' : 'Udda')
  const weekday = (day: DayOfWeek) => {
    return (day === DayOfWeek.MONDAY) ? 'måndag' :
      (day === DayOfWeek.TUESDAY) ? 'tisdag' :
        (day === DayOfWeek.WEDNESDAY) ? 'onsdag' :
          (day === DayOfWeek.THURSDAY) ? 'torsdag' :
            (day === DayOfWeek.FRIDAY) ? 'fredag' :
              (day === DayOfWeek.SATURDAY) ? 'lördag' :
                'söndag'
  }

  const oddEven = oddEvenAll(cleaningTime.appliesToEvenWeeks, cleaningTime.appliesToOddWeeks)
  const dayName = weekday(cleaningTime.day)

  return `${oddEven} ${dayName}ar ${cleaningTime.startHour}:00-${cleaningTime.endHour}:00`
}

const generateDescriptionText = (rules: ParkingRules) => {
  return (
    <Fragment>
      <p>Städdagar:</p>
      <ul>
        {
          rules.cleaningTimes.map((cleaning) => { return (<li key={`${cleaning.day}${cleaning.appliesToEvenWeeks}`}> - {getCleaningDayDescription(cleaning)}</li>) })
        }
      </ul>
      <p>Max {rules.maximum.days} dagar.</p>
    </Fragment>
  )
}

export default function ParkingMapPolygons({ parkingLocations, highlightedPath, onPolygonClick, handleSelectParkingSpotForDisplay, selectedParkingForDisplay, reminderMode, handleMapButtonClick }: ParkingMapPolygonsProps) {
  const mapRef = useGoogleMap()

  return (
    <>
      {
        parkingLocations.map((location) => {
          const maxLat = Math.max(...location.path.map((point) => point.lat))
          const minLat = Math.min(...location.path.map((point) => point.lat))
          const midLat = (maxLat + minLat) / 2

          const maxLng = Math.max(...location.path.map((point) => point.lng))
          const minLng = Math.min(...location.path.map((point) => point.lng))
          const midLng = (maxLng + minLng) / 2

          const center = new google.maps.LatLng(midLat, midLng)
          const isHighlighted = highlightedPath.length > 0 && highlightedPath.every(
            (point, index) => point.lat() === location.path[index].lat && point.lng() === location.path[index].lng
          );


          return (
            <React.Fragment key={`${location.name}-fragment`}>
              <Polygon
                key={`${location.name}-polygon`}
                path={location.path}
                options={{
                  strokeColor: isHighlighted ? '#89DAFF' : location.color,
                  strokeOpacity: isHighlighted ? 1.0 : 0.8,
                  strokeWeight: isHighlighted ? 3 : 1,
                  fillColor: location.color,
                  fillOpacity: 0.35,
                }}
                onClick={() => {
                  if (mapRef) {
                    onPolygonClick(location, mapRef);
                    handleSelectParkingSpotForDisplay(location);
                  }
                }}
              />

              {selectedParkingForDisplay?.name === location.name && (
                <InfoWindow
                  key={`${location.name}-infowindow`}
                  position={center}
                  onCloseClick={() => handleSelectParkingSpotForDisplay(null)}
                >
                  <>
                    <div className='mapInfoWindow mb-4' style={{ color: 'black' }}>
                      <h1 style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                        {location.name}
                      </h1>
                      {generateDescriptionText(location.parkingRules)}
                    </div>
                    {reminderMode && <NotificationModal location={location} />}
                    {!reminderMode && <MapButton onClick={handleMapButtonClick} text={"Active reminder mode"} />}
                  </>
                </InfoWindow>
              )}
            </React.Fragment>
          )
        })
      }
    </>
  )
}