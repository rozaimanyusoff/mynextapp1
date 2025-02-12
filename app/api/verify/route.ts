import { NextResponse } from "next/server";
import pool from "@/config/db";

export async function POST(req: Request) {
    try {
        const { email, contact } = await req.json();

        if (!email || !contact) {
            return NextResponse.json({ error: "Email and contact are required" }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            "SELECT * FROM users WHERE email = $1 AND contact = $2",
            [email, contact]
        );
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Invalid verification details" }, { status: 401 });
        }

        return NextResponse.json({ message: "Verification successful" }, { status: 200 });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}