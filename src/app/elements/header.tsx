export default function Header() {

  return (
    <div className="my-header m-auto max-w-5xl flex flex-col sm:flex-row items-center justify-around">
      <a
        className="border-b lg:static border p-4"
        href="./"
      >
      Boendeparkering i Bergshamra
      </a>
      <a
        className="sm:ml-auto lg:pointer-events-auto pointer-events-none"
        href="https://www.johanehrenfors.se"
        target="_blank"
        rel="author"
      >
      Skapad av Johan Ehrenfors,
      </a>
      <span className="ml-2">
        <a
          className="sm:ml-auto text-xs lg:pointer-events-auto pointer-events-none"
          href="https://www.fullstackfrancis.com"
          target="_blank"
          rel="author"
        >
      bidrag av Francis Jones
        </a>
      </span>

    </div>
  )
}