// filepath: /Users/rozaiman/mynextapp1/app/api/activate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/config/db';
import bcrypt from 'bcrypt';

type Data = {
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
    if (req.method === 'POST') {
        const { email, contact, password } = req.body;

        try {
            const client = await pool.connect();
            const hashedPassword = await bcrypt.hash(password, 10);

            await client.query(
                'UPDATE users SET password = $1, activation_code = NULL WHERE email = $2 AND contact = $3',
                [hashedPassword, email, contact]
            );
            client.release();

            res.status(200).json({ message: 'Account activated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}