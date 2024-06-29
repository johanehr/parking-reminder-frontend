import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    // Handle the POST request here
    // You can access the request body using req.body
    console.log("This should not show up in the browser")
    res.status(200).json({ message: 'API is working', nickname: req.body.nickname })
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }


}