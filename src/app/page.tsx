"use client"; // Necessary due to using src/app instead of legacy pages structure?

import { augmentParkingLocationData } from '@/parking-locations/locations';
import ParkingMapPolygons from '@/parking-locations/map-visualization';
import { useLoadScript, GoogleMap, Polyline, Marker, Polygon } from '@react-google-maps/api';
import { Fragment, useMemo } from 'react';

export default function Home() {

  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Laddar...</p>;
  }

  return (
    <main className="min-h-screen p-4 md:p-12">
      <div className="my-header m-auto max-w-5xl flex flex-col sm:flex-row items-center justify-around">
        <p className="border-b lg:static border p-4">
          Städdagar för boendeparkering i Bergshamra
        </p>
        <a
          className="sm:ml-auto lg:pointer-events-auto pointer-events-none"
          href="https://www.johanehrenfors.se"
          target="_blank"
          rel="noopener noreferrer"
        >
          Skapad av Johan Ehrenfors
        </a>
      </div>

      <div className="m-auto max-w-5xl w-full mt-4 md:mt-12 mb-4 md:mb-12">
        <ParkingMap />
      </div>

      <div className="m-auto max-w-5xl w-full grid text-center md:grid-cols-2 lg:grid-cols-3 lg:text-left">
        <a
          href="./about"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Om projektet{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[45ch] text-sm opacity-50`}>
            Mer information om tjänsten och dess ursprung
          </p>
        </a>

        <a
          href="./about"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Vill du hjälpa till?{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[45ch] text-sm opacity-50`}>
            Förbättra upplevelsen för dig själv och andra
          </p>
        </a>
      </div>
    </main>
  )
}

export function ParkingMap() {

  const mapCenter = useMemo(
    () => ({ lat: 59.380065, lng: 18.035959 }), // Hardcoded to Bergshamra
    []
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: true,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string
    }),
    []
  );



  return (
    <GoogleMap
      options={mapOptions}
      zoom={16}
      center={mapCenter}
      mapContainerStyle={{ width: '100%', height: '75vh' }}
      onLoad={() => console.log('Map Component Loaded...')}
    >
      <Marker position={mapCenter} />
      <ParkingMapPolygons />
    </GoogleMap>
  )
}
