// filepath: /Users/rozaiman/mynextapp1/app/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/config/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

type Data = {
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
    if (req.method === 'POST') {
        const { fullname, contact, email } = req.body;

        try {
            const client = await pool.connect();

            // Check if user already exists
            const checkUser = await client.query(
                'SELECT email FROM users WHERE email = $1',
                [email]
            );

            if (checkUser.rows.length > 0) {
                client.release();
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const activationCode = crypto.randomBytes(20).toString('hex');

            await client.query(
                'INSERT INTO users (fullname, contact, email, activation_code) VALUES ($1, $2, $3, $4)',
                [fullname, contact, email, activationCode]
            );
            client.release();

            // Send activation email
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
                to: email,
                subject: 'Account Activation',
                text: `Please activate your account by clicking the following link: ${process.env.NEXT_PUBLIC_API_URL}/auth/activate?code=${activationCode}`,
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json({ message: 'Registration successful. Please check your email for activation link.' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}