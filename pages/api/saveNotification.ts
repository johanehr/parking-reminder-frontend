import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
const API_KEY = process.env.API_KEY as string


const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = req.headers['x-api-key']

  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' })
  }


  const { email, carNickname, notificationDate, locationName, locationPath} = req.body

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        { email, car_nickname: carNickname || null, notification_date: notificationDate,  location_name: locationName, location_path: locationPath},
      ])
    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
    res.status(200).json({ message: 'Notification saved successfully' })


    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}