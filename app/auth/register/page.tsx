"use client";

import ComponentsAuthRegisterForm from '@/app/auth/form/components-auth-register-form';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

/* export const metadata: Metadata = {
    title: 'Register',
}; */


const Register = () => {
    const bgImage = process.env.NEXT_PUBLIC_AUTH_BG_IMAGE || '/assets/images/auth/map.png';
    const [registerError, setRegisterError] = useState('');

    return (
        <div>

            <div className={`relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16`}>
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 sm:px-10 py-16">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-zinc-700 md:text-4xl">Register</h1>
                                <p className={`text-base font-bold leading-normal ${registerError ? 'text-red-500' : 'text-white-dark'}`}>
                                    {registerError || 'Enter your email and password to register'}
                                </p>
                            </div>
                            <ComponentsAuthRegisterForm onError={(error) => setRegisterError(error)} />

                            <div className="text-center mt-10 dark:text-white">
                                Already have an account ?&nbsp;
                                <Link href="/auth/login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
