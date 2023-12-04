import { Polygon } from '@react-google-maps/api';
import { Fragment } from 'react';
import ParkingLocationHelpers from './locations';
import { DateTime } from 'luxon';

export default function ParkingMapPolygons() {
  const rawData = ParkingLocationHelpers.getRawParkingLocationData()
  const parkingLocations = ParkingLocationHelpers.augmentParkingLocationData(rawData, DateTime.now())

  return (
    <Fragment>
      {
        parkingLocations.map((location) => (
          <Polygon
            key={location.name}
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