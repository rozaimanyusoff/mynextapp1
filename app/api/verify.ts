// filepath: /Users/rozaiman/mynextapp1/app/api/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/config/db';

type Data = {
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
    if (req.method === 'POST') {
        const { email, contact, activationCode } = req.body;

        try {
            const client = await pool.connect();
            const result = await client.query(
                'SELECT * FROM users WHERE email = $1 AND contact = $2 AND activation_code = $3',
                [email, contact, activationCode]
            );
            client.release();

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid verification details' });
            }

            res.status(200).json({ message: 'Verification successful' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}