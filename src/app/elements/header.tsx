export default function Header() {

  return (
    <div className="my-header m-auto max-w-5xl flex items-center justify-around mb-12">
      <a
        className="border-b lg:static border p-4"
        href="./"
      >
        Boendeparkering i Bergshamra
      </a>

      <a
        href="./about"
        className="group rounded-lg border border-transparent px-5 py-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      >
        <h2 className={`mb-2 text-xl font-semibold`}>
          Om projektet{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
      </a>

    </div>
  )
}