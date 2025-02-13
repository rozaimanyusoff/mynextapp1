import { NextResponse } from 'next/server';
import pool from '@/config/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Utility function to create encrypted token
function createEncryptedToken(data: { token: string; expiry: Date }): string {
    const secretKey = process.env.JWT_SECRET || 'my_secret_key';
    const dataString = JSON.stringify(data);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey.padEnd(32)), iv);

    let encrypted = cipher.update(dataString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine IV, encrypted data, and auth tag
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export async function POST(req: Request) {
    try {
        const { email, contact } = await req.json();

        if (!email || !contact) {
            return NextResponse.json(
                { error: 'Email and contact are required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        // Check if user exists and get their status
        const result = await client.query(
            'SELECT * FROM users WHERE email = $1 AND contact = $2',
            [email, contact]
        );

        if (result.rows.length === 0) {
            client.release();
            return NextResponse.json(
                { error: 'No user found with these credentials' },
                { status: 404 }
            );
        }

        const user = result.rows[0];

        // Check if user is activated
        if (user.status === 0) {
            client.release();
            return NextResponse.json(
                {
                    error: 'Account not activated. Please activate your account first.',
                    status: 'inactive'
                },
                { status: 403 }
            );
        }

        // Generate reset token data
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Create combined encrypted token
        const encryptedResetToken = createEncryptedToken({
            token: resetToken,
            expiry: resetTokenExpiry
        });

        // Save reset token in database
        await client.query(
            'UPDATE users SET reset_token = $1 WHERE email = $2',
            [encryptedResetToken, email]
        );

        client.release();

        // Send reset password email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${encryptedResetToken}`;

        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Reset Your Password</h1>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        });

        return NextResponse.json(
            { message: 'Password reset link has been sent to your email' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}