/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',  // Enable static exports
    images: {
        unoptimized: true, // Required for static export
    },
    // Required for GitHub Pages - set the base path to your repo name
    basePath: '/iitsec2',
}

module.exports = nextConfig 