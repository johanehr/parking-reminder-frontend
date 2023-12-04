export default function Header() {

  return (
    <div className="my-header m-auto max-w-5xl flex flex-col sm:flex-row items-center justify-around">
    <a
      className="border-b lg:static border p-4"
      href="./"
    >
      Städdagar för boendeparkering i Bergshamra
    </a>
    <a
      className="sm:ml-auto lg:pointer-events-auto pointer-events-none"
      href="https://www.johanehrenfors.se"
      target="_blank"
      rel="author"
    >
      Skapad av Johan Ehrenfors
    </a>
    </div>
  )
}