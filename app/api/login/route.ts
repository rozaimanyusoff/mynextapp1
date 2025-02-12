// filepath: /Users/rozaiman/mynextapp1/pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import pool from '@/config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type Data = {
    success: boolean;
    token: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
    };
    error?: string; // Add optional error field for better error handling in client-side code.
};

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const user = result.rows[0];

        if (!(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

        return NextResponse.json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}