import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { email, carNickname, notificationDate } = req.body;

    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([
                { email, car_nickname: carNickname || null, notification_date: notificationDate },
            ]);
        if (error) {
            throw error; 
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}