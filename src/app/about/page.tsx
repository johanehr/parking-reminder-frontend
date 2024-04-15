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
          About the project
        </h1>

        <p className="mt-2">
          This project is created by<a
            className="lg:pointer-events-auto pointer-events-none italic hover:underline"
            href="https://www.johanehrenfors.se"
            target="_blank"
            rel="author"
          >
            Johan Ehrenfors&nbsp;
          </a>
          with contributions from&nbsp;
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
          Like many others, we've forgotten to move our car before a cleaning day, resulting in hefty fines.
          We wanted to quickly find out where we could leave our car for as long as possible, as well as a convenient way to receive relevant reminders when it's time to move our car again.
        </p>

        {/* notifikationer kommer bli klara när vi lanserad detta   <p className="mt-2">
            Att bygga en sådan applikation tar en del tid, som ni säkert förstår - men vi tänkte börja
            med att helt enkelt bygga en enkel karta som dynamiskt visar vart det är lämpligast att parkera just nu baserad på kommande städdagar och tider
          </p> */}

        <h1 className="text-2xl mt-6">Notifications and Privacy</h1>
        <p className="mt-4 text-xl">How it works</p>
        <p className="mt-2">Customised reminders:</p> Our system sends out reminders based on the times, locations and vehicle nickname you specify. This ensures you always receive relevant reminders and never miss a cleaning day. You can choose how far in advance you want to be reminded, and if you prefer to receive reminders via SMS or email
        <p className="mt-2">Personal Data:</p> We only collect the information necessary to send effective reminders. This includes your email address/phone number and the location where your car is parked.
        <p className="mt-2">Data Protection:</p> Your information is safe with us. We use leading security technologies to protect your data and never share it with third parties without your explicit consent.
        <p className="mt-2">Privacy policy:</p>Read more about our data policy here:
        <PrivacyPolicyModal />
        <h1 className="text-2xl mt-6">
          Technology overview
        </h1>

        <p className="mt-2">
          Our app is built using React, Next.js, TypeScript, and Tailwind CSS. We utilise Google Cloud Tasks and SendGrid for the notification system.
        </p>

        <h1 className="text-2xl mt-6">
          Join our effort
        </h1>

        <p className="mt-2">
          Would you like to help enhance our service, either by contributing as a developer or by adding new locations, possibly even beyond Bergshamra? Please feel free to contact me at johanehrenfors@hotmail.com!
        </p>
      </div>
    </main >
  )
}
