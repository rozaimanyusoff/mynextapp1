'use client';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';

interface ForgotPasswordProps {
    onError: (error: string) => void;
}

const ForgotPassword = ({ onError }: ForgotPasswordProps) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        onError('');

        try {
            const response = await fetch('/api/forgotpass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contact }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setTimeout(() => {
                    router.push('/auth/login?message=Reset password link sent to your email');
                }, 3000);
            } else {
                if (data.status === 'inactive') {
                    // Redirect to activation page if account is not activated
                    router.push(`/auth/activate?message=${data.error}`);
                } else {
                    setError(data.error || 'Failed to process request');
                    onError(data.error || 'Failed to process request');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            onError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
                setContact(value);
            }
        };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <div className="relative text-white-dark">
                    <input id="Email" type="email" placeholder="Enter email" className="form-input ps-10 placeholder:text-white-dark" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>
            </div>
            <div>
                <div className="relative text-white-dark">
                    <input id="Contact" type="text" placeholder="Enter contact" className="form-input ps-10 placeholder:text-white-dark" value={contact} onChange={handleContactChange} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>
                <small className='font-semibold text-red-500'>*Enter contact provided by you during registration</small>
            </div>

            <button type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                RECOVER
            </button>
        </form>
    );
};

export default ForgotPassword;
