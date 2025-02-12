import { NextResponse } from "next/server";
import pool from "@/config/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email, contact, userType, password, username } = await req.json();

        if (!email || !contact || !userType || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const client = await pool.connect();

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            "UPDATE users SET password = $1, user_type = $2, activation_code = NULL, status = 1, username = $3, role = 5, permission = 5 WHERE email = $4 AND contact = $5 RETURNING id",
            [hashedPassword, userType, username, email, contact]
        );

        client.release();

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Invalid activation details" }, { status: 401 });
        }

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
            subject: 'Account Activated',
            text: `Your account has been activated successfully. You can now log in using either your email or username and the provided password.`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Account activated successfully. An email has been sent to notify the user." }, { status: 200 });

    } catch (error) {
        console.error("Activation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}