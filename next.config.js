/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
            {
                source: '/register',
                destination: '/auth/register',
                permanent: true,
            },
        ];
    }
};

module.exports = {
  ...nextConfig,
};
