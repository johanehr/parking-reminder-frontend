"use client" // "Necessary due to google-maps-react using create-context, which is not SSR compatible" 

import Header from './elements/header'
import { ParkingMap } from './elements/parking-map'

export default function Home() {

  return (
    <main className="min-h-screen p-4 md:p-12">

      <Header />

      <div className="m-auto max-w-5xl w-full mt-4 md:mt-12 mb-4 md:mb-12">
        <p>The map displays how long you can stay parked if you park now. Be sure to double-check the signs!</p>
        <ParkingMap />

        <div className="flex flex-col sm:flex-row items-center justify-around p-2 text-contrast">
          <p style={{ color: "red" }}>&lt;3 h</p>
          <p style={{ color: "orangered" }}>&gt;3 h</p>
          <p style={{ color: "orange" }}>&gt;12 h</p>
          <p style={{ color: "yellow" }}>&gt;24 h</p>
          <p style={{ color: "yellowgreen" }}>&gt;3 dagar</p>
          <p style={{ color: "limegreen" }}>&gt;5 dagar</p>
          <p style={{ color: "green" }}>&gt;7 dagar</p>
        </div>

      </div>

      <div className="m-auto max-w-5xl w-full grid text-center md:grid-cols-2 lg:grid-cols-3 lg:text-left">
        <a
          href="./about"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Would you like to help?{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[45ch] text-sm opacity-50`}>
            Improve the experience for yourself and others.
          </p>
        </a>
        <a
          href="./about"
          className="group rounded-lg border border-transparent px-5 py-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-2 text-xl font-semibold`}>
            About the project{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[45ch] text-sm opacity-50`}>
            Read more about the project, its origins and notification functionality.
          </p>
        </a>
      </div>
    </main>
  )
}
