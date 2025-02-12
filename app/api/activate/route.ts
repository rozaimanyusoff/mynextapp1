import { NextResponse } from "next/server";
import pool from "@/config/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, contact, userType, password } = await req.json();

        if (!email || !contact || !userType || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const client = await pool.connect();

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            "UPDATE users SET password = $1, user_type = $2, activation_code = NULL, status = 1 WHERE email = $3 AND contact = $4 RETURNING id",
            [hashedPassword, userType, email, contact]
        );

        client.release();

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Invalid activation details" }, { status: 401 });
        }

        return NextResponse.json({ message: "Account activated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Activation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}