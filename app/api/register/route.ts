import { NextResponse } from "next/server";
import pool from "@/config/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { fullname, contact, email } = await req.json();

        if (!fullname || !contact || !email) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const client = await pool.connect();

        // Check if user already exists
        const checkUser = await client.query("SELECT email FROM users WHERE email = $1", [email]);

        if (checkUser.rows.length > 0) {
            client.release();
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Generate activation code
        const activationCode = crypto.randomBytes(20).toString("hex");

        // Insert user with NULL username, password, and user_type (set during activation)
        await client.query(
            "INSERT INTO users (fname, contact, email, activation_code, status, created_at) VALUES ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP)",
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
            subject: "Account Activation",
            text: `Please activate your account by clicking the following link: ${process.env.NEXT_PUBLIC_API_URL}/auth/activate?code=${activationCode}`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Registration successful. Check your email for activation link." }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}