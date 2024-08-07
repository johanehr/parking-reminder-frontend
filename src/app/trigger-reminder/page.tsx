
'use client'

import 'tailwindcss/tailwind.css'
import Header from '../elements/header'
import { useState } from 'react'

export default function TriggerReminder() {

  const [statusCode, setStatusCode] = useState<number | null>(null)
  const callApi = async () => {
    try {
      const response = await fetch('/api/trigger-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: 'HARDCODED FRONTEND NICKNAME' })
      })
      setStatusCode(response.status)

      const data = await response.json()
      console.log(`Triggered an email with car nickname: ${data.nickname}`)
    } catch (error) {
      console.error('Error calling API:', error)
    }
  }

  return (
    <main className="min-h-screen p-12">
      <Header />

      <div className="m-auto max-w-5xl w-full mt-12">
        <h1 className="text-2xl">
          Manually trigger a reminder
        </h1>

        <p className="mt-2">
          This is a temporary page to verify that it is possible to trigger a reminder from the frontend.
          This will trigger a hardcoded email to be sent.
        </p>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button onClick={callApi}>Call backend function</button>
          {statusCode && <p>HTTP Status Code: {statusCode}</p>}
        </div>
      </div>
    </main>
  )
}
