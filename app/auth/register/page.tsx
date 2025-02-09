import ComponentsAuthRegisterForm from '@/components/auth/components-auth-register-form';
import IconFacebookCircle from '@/components/icon/icon-facebook-circle';
import IconGoogle from '@/components/icon/icon-google';
import IconInstagram from '@/components/icon/icon-instagram';
import IconTwitter from '@/components/icon/icon-twitter';
import LanguageDropdown from '@/components/language-dropdown';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Register Boxed',
};

const BoxedSignUp = () => {
    const bgImage = process.env.NEXT_PUBLIC_AUTH_BG_IMAGE || '/assets/images/auth/map.png';
    return (
        <div>

            <div className={`relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16`}>
                <div className="relative w-full max-w-[570px]">
                    <div className="relative flex flex-col justify-center rounded-md bg-zinc-300/40 px-6 backdrop-blur-sm dark:bg-black/50 lg:min-h-[680px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-zinc-700 md:text-4xl">Register</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to register</p>
                            </div>
                            <ComponentsAuthRegisterForm />

                            
                            <div className="text-center mt-10 dark:text-white">
                                Already have an account ?&nbsp;
                                <Link href="/" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
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

export default BoxedSignUp;
