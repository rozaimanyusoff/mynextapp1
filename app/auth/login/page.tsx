"use client";

import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = false; // Replace with actual login check logic
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [router]);

    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 lg:min-h-[600px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-zinc-700 md:text-4xl">Login</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your username or email, and password to login</p>
                            </div>
                            <ComponentsAuthLoginForm />

                            <div className="mt-10 text-center dark:text-white">
                                Don&apos;t have an account ?&nbsp;
                                <Link href="/auth/register" className="uppercase text-primary transition font-semibold hover:text-black dark:hover:text-white">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
