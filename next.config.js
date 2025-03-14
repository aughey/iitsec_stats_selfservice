/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Disable server-side rendering
    ssr: false,
    // Static optimization for all pages
    experimental: {
        // Enable client-side rendering by default
        appDir: true,
    }
}

module.exports = nextConfig 