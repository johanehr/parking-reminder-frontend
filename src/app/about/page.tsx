"use client"
import 'tailwindcss/tailwind.css'
import Header from '../elements/header'
import PrivacyPolicyModal from '../components/privacypolicymodal'

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
          </a>.

        </p>

        <p className="mt-2">
          Som många andra har vi glömt att flytta bilen inför en städdag, vilket har resulterat i saftiga böter.
          Vi ville snabbt kunna ta reda på vart vi kan låta bilen stå så länge som möjligt, men även ett smidigt sätt att få relevanta påminnelser när det är dags att flytta bilen igen.
        </p>

        {/* notifikationer kommer bli klara när vi lanserad detta   <p className="mt-2">
            Att bygga en sådan applikation tar en del tid, som ni säkert förstår - men vi tänkte börja
            med att helt enkelt bygga en enkel karta som dynamiskt visar vart det är lämpligast att parkera just nu baserad på kommande städdagar och tider
          </p> */}

        <h1 className="text-2xl mt-6">Om Påminnelser och Sekretess</h1>
          <p className="mt-4">Så fungerar det:</p>
          <p className="mt-2">Anpassade Påminnelser:</p> Vårt system skickar ut påminnelser baserat på de tider och platser du anger. Detta gör att du alltid får relevanta påminnelser och aldrig missar en städdag. Du kan själv välja hur långt i förväg du vill bli påmind, och om du vill bli påmind via SMS eller e-post.
          <p className="mt-2">Personuppgifter:</p> Vi samlar endast in den information som är nödvändig för att skicka effektiva påminnelser. Detta inkluderar din e-postadress/telefonnummer och platsen där din bil är parkerad.
          <p className="mt-2">Dataskydd:</p> Din information är säker hos oss. Vi använder ledande säkerhetsteknik för att skydda dina uppgifter och delar dem aldrig med tredje part utan ditt uttryckliga medgivande.
          <p className="mt-2">Privacy policy:</p>Läs mer om vår integritetspolicy här:
        <PrivacyPolicyModal />
        <h1 className="text-2xl mt-6">
          Tekniken bakom
        </h1>

        <p className="mt-2">
          Appen är byggd i React, Next.js, TS och Tailwind CSS. Vi använder Google-cloud tasks och SendGrid för notifikationssystemet.
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
    </main >
  )
}
