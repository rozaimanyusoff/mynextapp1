// filepath: /Users/rozaiman/mynextapp1/app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import pool from '@/config/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Utility function to decrypt token
function decryptToken(encryptedToken: string): { token: string; expiry: Date } | null {
    const secretKey = process.env.JWT_SECRET || 'my_secret_key';
    const [ivHex, encrypted, authTagHex] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', new Uint8Array(Buffer.from(secretKey.padEnd(32))), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        const decryptedToken = decryptToken(token);

        if (!decryptedToken) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        const { token: resetToken, expiry } = decryptedToken;

        if (new Date() > new Date(expiry)) {
            return NextResponse.json(
                { error: 'Token has expired' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        // Check if the reset token matches
        const result = await client.query(
            'SELECT * FROM users WHERE reset_token = $1',
            [token]
        );

        if (result.rows.length === 0) {
            client.release();
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 400 }
            );
        }

        const user = result.rows[0];

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token
        await client.query(
            'UPDATE users SET password = $1, reset_token = NULL WHERE id = $2',
            [hashedPassword, user.id]
        );

        client.release();

        return NextResponse.json(
            { message: 'Password has been reset successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}