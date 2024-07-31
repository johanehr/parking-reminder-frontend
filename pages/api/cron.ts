import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import { DateTime } from 'luxon'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const sendgridApiKey = process.env.SENDGRID_API_KEY as string
const senderEmail = process.env.SENDGRID_SENDER_EMAIL as string //TODO ask Johan to verify my email as sender.  
const scheduleSecretToken = process.env.SCHEDULE_SECRET_TOKEN as string

enum NotificationStatus {
  Pending = 'pending',
  Sent = 'sent',
  Failed = 'failed',
}

if (!sendgridApiKey) {
  const error = new Error('SENDGRID_API_KEY was not provided as environment variable.') as Error & { code: number }
  error.code = 401
  throw error
}

if (!senderEmail) {
  const error = new Error('SENDGRID_SENDER_EMAIL was not provided as environment variable.') as Error & { code: number }
  error.code = 401
  throw error
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
sgMail.setApiKey(sendgridApiKey)



export default async function handler(req: VercelRequest, res: VercelResponse) {
  const google_schedule_token = req.headers['x-secret-token']
  //only allowing cron endpoint to be hit by google task scheduler. 
  if (google_schedule_token !== scheduleSecretToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  console.log(`Cron job triggered at ${new Date().toISOString()}`)

  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
    if (error) {
      throw error
    }

    const now = DateTime.now()

    for (const notification of notifications) {
      const { email, car_nickname, notification_date, location_name, location_path, id } = notification
      const notification_id = id
      const date = DateTime.fromISO(notification_date)
      const formattedDate = date.toFormat('yyyy-MM-dd HH:mm:ss')
      if (DateTime.fromISO(notification_date) <= now) {
        const msg = {
          to: email,
          from: senderEmail,
          subject: `Reminder: Time To Move ${car_nickname ?? 'Your Car'}`,
          html: reminderHTML(car_nickname, formattedDate, location_name, location_path),
        }

        try {
          await sgMail.send(msg)
          await updateSupabaseStatus(NotificationStatus.Sent, notification_id)
        } catch (emailError) {
          console.error('Error sending email:', emailError)
          await updateSupabaseStatus(NotificationStatus.Failed, notification_id)
        }
      }
    }
    res.status(200).json({ message: 'Notifications processed' })
  } catch (error) {
    console.error('Error processing notifications:', error)
    res.status(500).json({ error: (error as Error).message })
  }
}

const updateSupabaseStatus = async (status: string, notificationId: string) => {
  try {
    await supabase
      .from('notifications')
      .update({ status: status })
      .eq('id', notificationId)
  } catch (error) {
    console.error("error updating supabase notiication status to sent")
  }
}

const reminderHTML = function (car_nickname: string, formattedDate: string, location_name: string, location_path: { lat: number, lng: number }[]) {
  return `<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
    <style>
      body {
        background: white;
      }
      
      .reminder {
        width: 80%;
        margin: auto;
        height: 100vh;
        text-align: center;
        color: #484848;
      }

      .reminder-header {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 2.0em;
        text-align: left;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
      }

      .reminder-text {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 1.5em;
        text-align: left;
        padding: 30px 0px;
      }

      .reminder-text ul {
        text-align: left;
      }

      .reminder-footer {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 1.0em;
        font-style: italic;
      }

      a {
        color: #484848
        text-decoration: #484848 wavy underline;
      }
    </style>
  </head>
  <body>
    <div class="reminder">
      <div class="reminder-header">
        <h1>Hello!</h1>
      </div>
      <div class="reminder-text">
        <p>Just a friendly reminder that the scheduled cleaning time for your parked car at <a href="https://www.google.com/maps/search/?api=1&query=${location_path[0].lat},${location_path[0].lng}">${location_name}</a> is approaching:</p>
        <ul>
          <li><b>Last time to move:</b> ${formattedDate}</li>
          <li><b>Car nickname:</b> ${car_nickname ?? 'Not specified'}</li>
        </ul>

        <p>Please ensure your car is moved before the scheduled cleaning starts to avoid any parking tickets.</p>

        <h2>Need a New Spot?</h2>
        <p>
          If you're looking for a new place to park, our app can help you find the best available spots nearby.
          Simply open <a href="https://parkering.johanehrenfors.se">the app</a> and check the map for current parking information.
        </p>

        <h3>Thank you for using our app!</h3>
        <p>Best wishes,<br><i>The Boendeparkering team</i></p>


      </div>
      <div class="reminder-footer">
        <p>
          You have received this email because you've subscribed to receive reminders from <a href="https://parkering.johanehrenfors.se">Boendeparkering</a>.
          If you did not request this reminder, email us at <a href="mailto:johanehrenfors@hotmail.com">johanehrenfors@hotmail.com</a>, so that we can blacklist this email.
        </p>
      </div>
      </div>
  </body>
</html>`
}
