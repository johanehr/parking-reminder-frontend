import { getParkingLocationData } from '@/parking-locations/locations';
import { Polygon } from '@react-google-maps/api';
import { Fragment } from 'react';

export default function ParkingMapPolygons() {
  const parkingLocations = getParkingLocationData()

  return (
    <Fragment>
      {
        parkingLocations.map((location) => (
          <Polygon
            path={location.path}
            options={{
              strokeColor: location.color,
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: location.color,
              fillOpacity: 0.35,
            }}
          />
        ))
      }
    </Fragment>
  )
}