import { VercelRequest, VercelResponse } from '@vercel/node';

const SCHEDULE_SECRET_TOKEN = process.env.SECRET_TOKEN;


export default async function handler(req: VercelRequest, res: VercelResponse) {
    const token = req.headers['x-secret-token']
    if (token !== SCHEDULE_SECRET_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(`Cron job triggered at ${new Date().toISOString()}`)
    res.status(200).json({ message: 'Cronjob working as expected' })
}