'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // Store tokens in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            // Redirect to the home page
            router.push('/analytics');
        } else {
            // Handle login error
            console.error('Login failed');
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
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
                <Link href="/forgotpassword" className="text-primary transition font-semibold">Forgot password?</Link>
            </div>
            <button type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Login
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
