import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log(`Cron job triggered at ${new Date().toISOString()}`)
    res.status(200).json({ message: 'Cronjob working as expected' })
}