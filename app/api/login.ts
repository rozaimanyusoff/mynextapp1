// filepath: /Users/rozaiman/mynextapp1/pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type Data = {
    token: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            client.release();

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];

            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

            res.status(200).json({
                token,
                refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                },
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}