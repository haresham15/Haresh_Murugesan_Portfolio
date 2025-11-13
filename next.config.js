/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Transpile @react-three packages for compatibility
  transpilePackages: ['@react-three/fiber', '@react-three/drei'],
}

module.exports = nextConfig

