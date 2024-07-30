import { createClient } from "@supabase/supabase-js"
import { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    const { data, error } = await supabase
      .from('parking_locations')
      .select('*')

    if (error) {
      console.log(error, "there has been an error fetching locatons")
      return res.status(500).json({ message: "there has been an error fetching locations" })
    } else {
      return res.status(200).json(data)
    }

  } catch (err) {
    console.log(err)

  }
}