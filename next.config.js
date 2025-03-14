/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Disable server-side rendering
    ssr: false,
    // Static optimization for all pages
    experimental: {
        // Enable client-side rendering by default
        appDir: true,
    },
    output: 'export',  // Enable static exports
    images: {
        unoptimized: true, // Required for static export
    },
    // Required for GitHub Pages - set the base path to your repo name
    // You'll need to replace 'iitsec2' with your actual repository name
    basePath: '/iitsec2',
}

module.exports = nextConfig 