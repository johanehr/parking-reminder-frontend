import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("This should not show up in the browser")
  res.status(200).json({ message: 'API is working' });
}