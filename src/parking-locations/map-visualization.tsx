import { GoogleMap, InfoWindow, MarkerClusterer, Polygon, useGoogleMap } from '@react-google-maps/api';
import { Fragment } from 'react';
import { DateTime } from 'luxon';
import { augmentParkingLocationData, getParkingRulesDescription, getRawParkingLocationData } from './location-helpers';
import React from 'react';
import { AugmentedParkingLocationData } from './types';

const handlePolygonClick = (center: google.maps.LatLng, map: google.maps.Map) => {
  console.log(`Center: ${center.lat()}, ${center.lng()}`)
  map.panTo(center)
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
                    // TODO: Map day to e.g. 'jämna måndagar'
                  >
                    <div className='mapInfoWindow'>
                      <h1>{location.name}</h1>
                      <p>{getParkingRulesDescription(location)}</p>
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