// filepath: /Users/rozaiman/mynextapp1/app/api/update-last-nav/route.ts
import { NextResponse } from 'next/server';
import pool from '@/config/db';

export async function POST(req: Request) {
    try {
        const { userId, lastNav } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const client = await pool.connect();
        await client.query(
            "UPDATE users SET last_nav = $1 WHERE id = $2",
            [lastNav, userId]
        );
        client.release();

        return NextResponse.json({ message: "Last navigation time updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Update last_nav error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}