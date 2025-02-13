"use client";
import ComponentsAuthResetPasswordForm from '@/app/auth/form/forgot-password-form';
import LanguageDropdown from '@/components/language-dropdown';
import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

/* export const metadata: Metadata = {
    title: 'Forgot Password',
}; */

const BoxedPasswordReset = () => {
    const [errors, setErrors] = useState('');

    return (
        <div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 lg:min-h-[500px]">

                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-7">
                                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Password Reset</h1>
                                <p className={`text-base font-bold leading-normal ${errors ? 'text-red-500' : 'text-white-dark'}`}>{errors || 'Enter your email to recover your ID'}</p>
                            </div>
                            <ComponentsAuthResetPasswordForm onError={(error) => setErrors(error)} />
                            <div className="mt-10 text-center dark:text-white">
                                <Link href="/login" className=" text-primary transition hover:text-black dark:hover:text-white">
                                    Back to login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxedPasswordReset;
