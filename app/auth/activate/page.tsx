// filepath: /Users/rozaiman/mynextapp1/app/auth/activate/page.tsx
"use client";

import ComponentsAuthActivateForm from '@/components/auth/components-auth-activate-form';
import React from 'react';

const Activate = () => {
    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 lg:min-h-[600px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-zinc-700 md:text-4xl">Activate Account</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">
                                    Enter your email, contact, and activation code to verify your account
                                </p>
                            </div>
                            <ComponentsAuthActivateForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activate;