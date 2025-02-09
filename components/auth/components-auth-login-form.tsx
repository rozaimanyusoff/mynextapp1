'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Handle successful login
            router.push('/');
        } else {
            // Handle login error
            console.error('Login failed');
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input
                        id="Email"
                        type="email"
                        placeholder="Enter email"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        type="password"
                        placeholder="Enter Password"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Login
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
