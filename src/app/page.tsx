export default function Home() {
  return (
    <main className="min-h-screen p-12">
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

      <div className="m-auto max-w-5xl w-full mt-12 mb-12">
        <p>This is where my map will go</p>
      </div>

      <div className="m-auto max-w-5xl w-full grid text-center lg:grid-cols-4 lg:text-left">
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
