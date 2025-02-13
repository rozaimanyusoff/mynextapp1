'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import crypto from 'crypto';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faPhone, faUserTag, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface ComponentsAuthResetPasswordFormProps {
    token: string;
    setMessage: (message: string) => void;
    setErrors: (errors: string) => void;
}

const ComponentsAuthResetPasswordForm = ({ token, setMessage, setErrors }: ComponentsAuthResetPasswordFormProps) => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const decryptToken = (encryptedToken: string): { token: string; expiry: Date } | null => {
            try {
                const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "my_secret_key";
                if (!encryptedToken || !secretKey) {
                    throw new Error("Missing encrypted token or secret key");
                }

                const parts = encryptedToken.split(":");
                if (parts.length !== 3) {
                    throw new Error("Invalid token format");
                }

                const [ivHex, encrypted, authTagHex] = parts;
                const iv = Buffer.from(ivHex, "hex");
                const authTag = Buffer.from(authTagHex, "hex");
                const key = Buffer.from(secretKey.padEnd(32), "utf-8");

                const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
                decipher.setAuthTag(authTag);

                let decrypted = decipher.update(encrypted, "hex", "utf8");
                decrypted += decipher.final("utf8");

                return JSON.parse(decrypted);
            } catch (error) {
                console.error("Decryption failed:", error);
                return null;
            }
        };

        const decryptedToken = decryptToken(token);

        if (!decryptedToken || new Date() > new Date(decryptedToken.expiry)) {
            setErrors('Invalid or expired token');
            setMessage('');
        }
    }, [token, setErrors, setMessage]);

    const resetPassword = async () => {
        if (password !== confirmPassword) {
            setErrors('Passwords do not match');
            return;
        }

        try {
            setErrors('');
            setLoading(true);

            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                setMessage('Password has been reset successfully. You can now log in with your new password.');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000); // Redirect to login page after 3 seconds
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Reset password failed. Please try again.';
                setErrors(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Reset password failed. Please try again.';
            setErrors(errorMessage);
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                resetPassword();
            }}
        >
            <div className="relative">

                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-input ps-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                </span>
                <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5 text-white-dark" />
                </span>
            </div>
            <div className="relative">
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-input ps-10"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                </span>
                <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5 text-white-dark" />
                </span>
            </div>
            <button
                type="submit"
                className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                disabled={loading}
            >
                {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
        </form>
    );
};

export default ComponentsAuthResetPasswordForm;