import { GoogleMap, InfoWindow, MarkerClusterer, Polygon, useGoogleMap } from '@react-google-maps/api';
import { Fragment } from 'react';
import { DateTime } from 'luxon';
import { augmentParkingLocationData, getRawParkingLocationData } from './location-helpers';

const handlePolygonClick = (center: google.maps.LatLng, map: google.maps.Map) => {
  console.log(`Center: ${center.lat()}, ${center.lng()}`)
  map.panTo(center)
}

export default function ParkingMapPolygons() {
  const rawData = getRawParkingLocationData()
  const parkingLocations = augmentParkingLocationData(rawData, DateTime.now())

  const mapRef = useGoogleMap()

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
              onClick={(event) => {
                console.log(`Mouse click on ${location.name}`)
                const center = event.latLng // TODO: Use polygon extremities to find rough center
                handlePolygonClick(center!, mapRef!)
              }}
            />

            /*
            <InfoWindow
              key={`${location.name}-infowindow`}
              position={location.path[0]} // TODO: Find middle of min/max lat and lng, use anchor
              options={{
                content: location.name,
              }}
            />
            */
        ))
      }
    </Fragment>
  )
}