import 'tailwindcss/tailwind.css'
import Header from '../elements/header'

export default function About() {
  return (
    <main className="min-h-screen p-12">
      <Header/>

      <div className="m-auto max-w-5xl w-full mt-12">
        <h1 className="text-2xl">
          Om projektet
        </h1>

        <p className="mt-2">
          Som många andra, så har jag och sambon glömt att flytta bilen inför en städdag, vilket resulterade i saftiga böter.
          Vi ville ha ett sätt att dels veta vart vi borde ställa bilen för att ha så lång tid som möjligt,
          och gärna att kunna få påminnelser om bilen skulle behöva flyttas. 
        </p>

        <p className="mt-2">
          Att bygga en sådan applikation tar en del tid, som ni säkert förstår - men jag tänkte börja
          med att helt enkelt bygga en enkel karta som dynamiskt visar vart det är lämpligast att parkera.
        </p>

        <p className="mt-2">
          Om du har haft nytta av mitt projekt får du gärna Swisha några kronor till 0737600282 :)
          Användningen av Google Maps kostar mer ju fler sidladdningar som görs.
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
