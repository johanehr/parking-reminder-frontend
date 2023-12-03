import 'tailwindcss/tailwind.css'

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:border lg:p-4">
          Städdagar för boendeparkering i Bergshamra
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://www.johanehrenfors.se"
            target="_blank"
            rel="noopener noreferrer"
          >
            Skapad av Johan Ehrenfors
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h2>Om projektet</h2>

        <p>
          Som många andra, så har jag och sambon glömt att flytta bilen inför en städdag, vilket resulterade i saftiga böter.
          Vi ville ha ett sätt att dels veta vart vi borde ställa bilen för att ha så lång tid som möjligt,
          och gärna att kunna få påminnelser om bilen skulle behöva flyttas. 
        </p>

        <p>
          Att bygga en sådan applikation tar en del tid, som ni säkert förstår - men jag tänkte börja
          med att helt enkelt bygga en enkel karta som dynamiskt visar vart det är lämpligast att parkera.
        </p>

        <p>
          Om du har haft nytta av mitt projekt får du gärna Swisha några kronor på 0737600282 :)
        </p>
      </div>
    </main>
  )
}
