'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface ComponentsAuthLoginFormProps {
    onError: (error: string) => void;
}

const ComponentsAuthLoginForm = ({ onError }: ComponentsAuthLoginFormProps) => {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const loginUser = async () => {
        try {
            setError('');
            setLoading(true);
            onError('');

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password, rememberMe }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // Store tokens in cookies
                const expires = rememberMe ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}` : '';
                document.cookie = `token=${data.token}; path=/${expires}`;
                document.cookie = `refreshToken=${data.refreshToken}; path=/${expires}`;
                document.cookie = `user=${JSON.stringify(data.user)}; path=/${expires}`;

                // Store user ID in local storage
                localStorage.setItem('userId', data.user.id);

                // Redirect to dashboard
                router.push(data.user.last_nav || '/analytics');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Login failed. Please try again.';
                setError(errorMessage);
                onError(errorMessage);
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
            loginUser();
        }}>
            <div>
                <div className="relative text-white-dark">
                    <input
                        id="Identifier"
                        type="text"
                        placeholder="Username or Email"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="form-input ps-10 placeholder:text-white-dark"
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
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <label className="flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            id="RememberMe"
                            className="form-checkbox bg-white dark:bg-black"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
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
