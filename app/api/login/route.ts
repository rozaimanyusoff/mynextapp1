// filepath: /Users/rozaiman/mynextapp1/app/api/login/route.ts
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
        email: string;
        contact: string;
        role: number;
        permission: number;
        last_login: string;
        last_nav: string;
    };
    error?: string; // Add optional error field for better error handling in client-side code.
};

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: "Identifier (username or email) and password are required" }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [identifier, identifier]
        );

        if (result.rows.length === 0) {
            client.release();
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const user = result.rows[0];

        if (!(await bcrypt.compare(password, user.password))) {
            client.release();
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Update last_login field
        await client.query(
            "UPDATE users SET last_login = NOW() WHERE id = $1",
            [user.id]
        );

        client.release();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

        return NextResponse.json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                contact: user.contact,
                role: user.role,
                permission: user.permission,
                last_login: user.last_login,
                last_nav: user.last_nav,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}