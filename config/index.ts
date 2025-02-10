export const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    apiVersion: 'v1', // if you need versioning
    endpoints: {
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }
};