"use client"; // Necessary due to using src/app instead of legacy pages structure?

import ParkingMapPolygons from '@/parking-locations/map-visualization';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';
import Header from './elements/header';

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

      <Header />

      <div className="m-auto max-w-5xl w-full mt-4 md:mt-12 mb-4 md:mb-12">
        <ParkingMap />
      </div>

      <div className="m-auto max-w-5xl w-full grid text-center md:grid-cols-2 lg:grid-cols-3 lg:text-left">
        <a
          href="./about"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
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
