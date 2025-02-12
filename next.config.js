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
                source: '/login',
                destination: '/auth/login',
                permanent: true,
            },
        ];
    }
};

module.exports = nextConfig;
