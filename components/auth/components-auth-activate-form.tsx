// filepath: /Users/rozaiman/mynextapp1/components/auth/components-auth-activate-form.tsx
'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ComponentsAuthActivateForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [activationCode, setActivationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const verifyUser = async () => {
        try {
            setError('');
            setLoading(true);

            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contact, activationCode }),
            });

            if (response.ok) {
                setIsVerified(true);
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Verification failed. Please try again.';
                setError(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Verification failed. Please try again.';
            setError(errorMessage);
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const activateUser = async () => {
        try {
            setError('');
            setLoading(true);

            const response = await fetch('/api/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contact, password }),
            });

            if (response.ok) {
                router.push('/auth/login');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Activation failed. Please try again.';
                setError(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Activation failed. Please try again.';
            setError(errorMessage);
            console.error('Activation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {!isVerified ? (
                <form className="space-y-5 dark:text-white" onSubmit={(e) => {
                    e.preventDefault();
                    verifyUser();
                }}>
                    <div>
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
                        <div className="relative text-white-dark">
                            <input
                                id="Contact"
                                type="text"
                                placeholder="Enter contact"
                                className="form-input ps-10 placeholder:text-white-dark"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative text-white-dark">
                            <input
                                id="ActivationCode"
                                type="text"
                                placeholder="Enter activation code"
                                className="form-input ps-10 placeholder:text-white-dark"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            ) : (
                <form className="space-y-5 dark:text-white" onSubmit={(e) => {
                    e.preventDefault();
                    activateUser();
                }}>
                    <div>
                        <div className="relative text-white-dark">
                            <input
                                id="Password"
                                type="password"
                                placeholder="Enter password"
                                className="form-input ps-10 placeholder:text-white-dark"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative text-white-dark">
                            <input
                                id="ConfirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                className="form-input ps-10 placeholder:text-white-dark"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                        disabled={loading}
                    >
                        {loading ? 'Activating...' : 'Activate'}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default ComponentsAuthActivateForm;