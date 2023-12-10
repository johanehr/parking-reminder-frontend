import { InfoWindow, Polygon, useGoogleMap } from '@react-google-maps/api';
import { Fragment } from 'react';
import React from 'react';
import { AugmentedParkingLocationData, CleaningTime, DayOfWeek, ParkingRules } from './types';

const handlePolygonClick = (center: google.maps.LatLng, map: google.maps.Map) => {
  console.log(`Center: ${center.lat()}, ${center.lng()}`)
  map.panTo(center)
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
        rules.cleaningTimes.map((cleaning) => { return (<li> - { getCleaningDayDescription(cleaning) }</li>) })
      }
      </ul>
      <p>Max {rules.maximum.days} dagar.</p>
    </Fragment>
  )
}

export default function ParkingMapPolygons({ parkingLocations }: { parkingLocations: AugmentedParkingLocationData[] }) {
  const mapRef = useGoogleMap()

  const [selectedParking, setSelectedParking] = React.useState<AugmentedParkingLocationData | null>(null);

  return (
    <>
      {
        parkingLocations.map((location) => {
            // TODO: Use polygon extremities to find rough center
            const center = new google.maps.LatLng(location.path[0])

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
                  }}
                  onClick={(event) => {
                    console.log(`Mouse click on ${location.name}`)
                    handlePolygonClick(center!, mapRef!)
                    setSelectedParking(location)
                  }}
                />

                {selectedParking?.name === location.name && (
                  <InfoWindow
                    key={`${location.name}-infowindow`}
                    position={center}
                    onCloseClick={() => setSelectedParking(null)}
                  >
                    <div className='mapInfoWindow' style={{ color: 'black' }}>
                      <h1 style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                        {location.name}
                      </h1>
                      { generateDescriptionText(location.parkingRules) }
                    </div>
                  </InfoWindow>
                )}
            </React.Fragment>
        )
            
          })
      }
    </>
  )
}