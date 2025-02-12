'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { LoginCredentials } from '@/types/auth';

interface ComponentsAuthLoginFormProps {
    onError: (error: string) => void;
}

const ComponentsAuthLoginForm = ({ onError }: ComponentsAuthLoginFormProps) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loginUser = async (credentials: LoginCredentials) => {
        try {
            setError('');
            setLoading(true);
            onError('');

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                // Store tokens in cookies with secure settings
                document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
                document.cookie = `refreshToken=${data.refreshToken}; path=/; secure; samesite=strict`;
                document.cookie = `user=${JSON.stringify(data.user)}; path=/; secure; samesite=strict`;

                router.push('/analytics');
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed. Please try again.';
            setError(errorMessage);
            onError(errorMessage);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={(e) => {
            e.preventDefault();
            loginUser({ username, password });
        }}>
            <div>
                <div className="relative text-white-dark">
                    <input
                        id="Username"
                        type="text"
                        placeholder="Username / Email"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>
            </div>
            <div>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        type="password"
                        placeholder="Enter Password"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <label className="flex cursor-pointer items-center">
                        <input type="checkbox" id="RememberMe" className="form-checkbox bg-white dark:bg-black" />
                        <span className="text-white-dark">Remember me</span>
                    </label>
                </div>
                <Link href="/auth/forgotpassword" className="text-primary transition font-semibold">Forgot password?</Link>
            </div>
            <button
                type="submit"
                className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
