"use client";

import ComponentsAuthActivateForm from '@/app/auth/form/components-auth-activate-form';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Activate = () => {
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const msg = searchParams.get('message');
        if (msg) {
            setMessage(msg);
        }
    }, [searchParams]);

    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 sm:px-10 py-10">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-zinc-700 md:text-4xl">Activate Account</h1>
                                {message ? (
                                    <p className="text-base font-bold leading-normal text-amber-500">
                                        {message}
                                    </p>
                                ) : (
                                    <p className={`text-base font-bold leading-normal ${error ? 'text-red-500' : 'text-white-dark'}`}>
                                        {error || 'Enter your email and contact provided during registration to verify your account'}
                                    </p>
                                )}
                            </div>
                            <ComponentsAuthActivateForm onError={(error) => setError(error)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activate;