import { InfoWindow, Polygon, useGoogleMap } from '@react-google-maps/api'
import { Fragment } from 'react'
import React from 'react'
import { AugmentedParkingLocationData, CleaningTime, DayOfWeek, ParkingRules } from './types'
import NotificationModal from '@/components/NotificationModal'
import { calculateLocationCenter } from './helper-functions/calculateLocationCenter'



interface ParkingMapPolygonsProps {
  parkingLocations: AugmentedParkingLocationData[];
  onPolygonClick: (location: AugmentedParkingLocationData, mapRef: google.maps.Map) => void;
  handleSelectParkingSpotForDisplay: (location: AugmentedParkingLocationData | null) => void;
  selectedParkingForDisplay: AugmentedParkingLocationData | null;
}


export function getCleaningDayDescription(cleaningTime: CleaningTime): string {

  const oddEvenAll = (even: boolean, odd: boolean) => (even && odd) ? 'All' : (even ? 'Even' : 'Odd')
  const weekday = (day: DayOfWeek) => {
    return (day === DayOfWeek.MONDAY) ? 'Monday' :
      (day === DayOfWeek.TUESDAY) ? 'Tuesday' :
        (day === DayOfWeek.WEDNESDAY) ? 'Wednesday' :
          (day === DayOfWeek.THURSDAY) ? 'Thursday' :
            (day === DayOfWeek.FRIDAY) ? 'Friday' :
              (day === DayOfWeek.SATURDAY) ? 'Saturday' :
                'Sunday'
  }

  const oddEven = oddEvenAll(cleaningTime.appliesToEvenWeeks, cleaningTime.appliesToOddWeeks)
  const dayName = weekday(cleaningTime.day)

  return `${oddEven} ${dayName}s ${cleaningTime.startHour}:00-${cleaningTime.endHour}:00`
}

const generateDescriptionText = (rules: ParkingRules) => {
  return (
    <Fragment>
      <p>Cleaning days:</p>
      <ul>
        {
          rules.cleaningTimes.map((cleaning) => { return (<li key={`${cleaning.day}${cleaning.appliesToEvenWeeks}`}> - {getCleaningDayDescription(cleaning)}</li>) })
        }
      </ul>
      <p>Max {rules.maximum.days} days.</p>
    </Fragment>
  )
}

export default function ParkingMapPolygons({ parkingLocations, onPolygonClick, handleSelectParkingSpotForDisplay, selectedParkingForDisplay }: ParkingMapPolygonsProps) {
  const mapRef = useGoogleMap()

  return (
    <>
      {
        parkingLocations.map((location) => {
          const center = calculateLocationCenter(location)
          return (
            <React.Fragment key={`${location.name}-fragment`}>
              <Polygon
                key={`${location.name}-polygon`}
                path={location.path}
                options={{
                  strokeColor: location.color,
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                  fillColor: location.color,
                  fillOpacity: 0.35,
                  zIndex: 10, // Ensure this is above e.g. location accuracy circle
                }}
                onClick={() => {
                  if (mapRef) {
                    onPolygonClick(location, mapRef)
                    handleSelectParkingSpotForDisplay(location)
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
                    <NotificationModal location={location} />
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
