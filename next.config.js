/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',  // Enable static exports
    images: {
        unoptimized: true, // Required for static export
    },
    // Set the base path to match the actual hosting location
    basePath: '/iitsec_stats_selfservice',
    assetPrefix: '/iitsec_stats_selfservice/',
    // Configure trailing slashes for static export
    trailingSlash: true,
}

module.exports = nextConfig 