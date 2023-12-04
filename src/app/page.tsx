"use client"; // Necessary due to using src/app instead of legacy pages structure?

import Header from './elements/header';
import { ParkingMap } from './elements/parking-map';

export default function Home() {

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
