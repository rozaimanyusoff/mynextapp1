'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

interface ComponentsAuthRegisterFormProps {
    onError: (error: string) => void;
}

const ComponentsAuthRegisterForm = ({ onError }: ComponentsAuthRegisterFormProps) => {
    const router = useRouter();
    const [fullname, setFullname] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const registerUser = async () => {
        try {
            setError('');
            setLoading(true);
            onError('');

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname, contact, email }),
            });

            if (response.ok) {
                router.push('/auth/login');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Registration failed. Please try again.';
                setError(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            onError(errorMessage);
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={(e) => {
            e.preventDefault();
            registerUser();
        }}>
            <div>
                <div className="relative text-white-dark">
                    <input
                        id="Fullname"
                        type="text"
                        placeholder="Enter fullname"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white-dark" />
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
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>
            </div>
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
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>
            </div>
            <div>
                <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                    <span className="text-white-dark">I declare the above information is true and correct</span>
                </label>
            </div>
            <button
                type="submit"
                className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                disabled={loading}
            >
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default ComponentsAuthRegisterForm;
