'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ComponentsAuthResetPasswordForm from '@/app/auth/form/reset-password-form';
import { useSearchParams } from 'next/navigation';

const ResetPassword = () => {
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState('');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 sm:px-10 py-16">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-zinc-700 md:text-4xl">Reset Password</h1>
                                {message ? (
                                    <p className="text-base font-bold leading-normal text-green-500">
                                        {message}
                                    </p>
                                ) : (
                                    <p className={`text-base font-bold leading-normal ${errors ? 'text-red-500' : 'text-white-dark'}`}>
                                        {errors || 'Password must be at least 6 characters long, include 1 uppercase letter, 1 number, and 1 special character.'}
                                    </p>
                                )}
                            </div>
                            {token && <ComponentsAuthResetPasswordForm token={token} setMessage={setMessage} setErrors={setErrors} />}

                            <div className="mt-10 text-center dark:text-white uppercase">
                                Return to&nbsp;
                                <Link href="/auth/login" className="uppercase text-primary transition font-semibold hover:text-black dark:hover:text-white">
                                    Login&nbsp;
                                </Link>
                                page
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;