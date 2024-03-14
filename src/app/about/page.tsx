import 'tailwindcss/tailwind.css'
import Header from '../elements/header'

export default function About() {
  return (
    <main className="min-h-screen p-12">
      <Header />

      <div className="m-auto max-w-5xl w-full mt-12">
        <h1 className="text-2xl">
          Om projektet
        </h1>

        <p className="mt-2">
          Projektet är skapat av   <a
            className="lg:pointer-events-auto pointer-events-none italic hover:underline"
            href="https://www.johanehrenfors.se"
            target="_blank"
            rel="author"
          >
            Johan Ehrenfors&nbsp;  
          </a>
         med bidrag från&nbsp;
          <a
            className="lg:pointer-events-auto pointer-events-none italic hover:underline"
            href="https://www.fullstackfrancis.com"
            target="_blank"
            rel="author"
          >
             Francis Jones
          </a>, i Typescript och Next.js.
          
        </p>

        <p className="mt-2">
          Som många andra, så har vi glömt att flytta bilen inför en städdag, vilket har resulterat i saftiga böter.
          Vi ville snabbt kunna ta reda på vart vi kan låta bilen stå så länge som möjligt, men även ett smidigt sätt att få relevanta påminnelser när det är dags att flytta bilen igen.
        </p>

        <p className="mt-2">
          Att bygga en sådan applikation tar en del tid, som ni säkert förstår - men vi tänkte börja
          med att helt enkelt bygga en enkel karta som dynamiskt visar vart det är lämpligast att parkera.
        </p>

        <h1 className="text-2xl mt-6">
          Hjälp till
        </h1>

        <p className="mt-2">
          Vill du hjälpa till att förbättra tjänsten,
          antingen som utvecklare eller genom att lägga till fler områden, kanske även utanför Bergshamra?
          Tveka inte att kontakta mig på johanehrenfors@hotmail.com!
        </p>
      </div>
    </main>
  )
}
