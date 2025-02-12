'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPhone, faUserTag } from '@fortawesome/free-solid-svg-icons';

interface ComponentsAuthActivateFormProps {
    onError: (error: string) => void;
}

const ComponentsAuthActivateForm = ({ onError }: ComponentsAuthActivateFormProps) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [activationCode, setActivationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [userType, setUserType] = useState('employee');
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            setActivationCode(code);
        }
    }, [searchParams]);

    const verifyUser = async () => {
        try {
            setError('');
            setLoading(true);
            onError('');

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
                onError(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Verification failed. Please try again.';
            setError(errorMessage);
            onError(errorMessage);
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const activateUser = async () => {
        try {
            setError('');
            setLoading(true);
            onError('');

            // Validate all required fields
            if (!email || !contact || !password || !confirmPassword || !userType) {
                setError('All fields are required');
                setLoading(false);
                onError('All fields are required');
                return;
            }

            // Validate passwords match
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                onError('Passwords do not match');
                return;
            }

            const response = await fetch('/api/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    contact,
                    password,
                    userType,
                    activationCode, // Include activation code in request
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful activation
                console.log('Activation successful');
                router.push('/auth/login');
            } else {
                // Handle activation error
                const errorMessage = data.error || 'Activation failed. Please try again.';
                setError(errorMessage);
                onError(errorMessage);
                console.error('Activation error:', errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Activation failed. Please try again.';
            setError(errorMessage);
            onError(errorMessage);
            console.error('Activation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isVerified) {
            await activateUser();
        } else {
            await verifyUser();
        }
    };

    return (
        <div>
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                <div>
                    <div className="relative text-white-dark">
                        <input
                            id="Email"
                            type="email"
                            placeholder="Enter email"
                            className="form-input ps-10 placeholder:text-white-dark"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isVerified}
                        />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white-dark" />
                        </span>
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
                            disabled={isVerified}
                        />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-white-dark" />
                        </span>
                    </div>
                </div>

                {isVerified && (
                    <>
                        <div>
                            <div className="relative text-white-dark">
                                <select
                                    id="UserType"
                                    className="form-select ps-10 placeholder:text-white-dark"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="1">Employee</option>
                                    <option value="2">Non-Employee</option>
                                </select>
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <FontAwesomeIcon icon={faUserTag} className="h-5 w-5 text-white-dark" />
                                </span>
                            </div>
                        </div>
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
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                                </span>
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
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                                </span>
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                    disabled={loading}
                >
                    {loading ? (isVerified ? 'Activating...' : 'Verifying...') : (isVerified ? 'Activate' : 'Verify')}
                </button>

            </form>
        </div>
    );
};

export default ComponentsAuthActivateForm;