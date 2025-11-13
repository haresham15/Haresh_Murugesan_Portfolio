/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Transpile @react-three packages for compatibility
  transpilePackages: ['@react-three/fiber', '@react-three/drei'],
}

module.exports = nextConfig

