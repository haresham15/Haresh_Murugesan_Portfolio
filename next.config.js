/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Transpile @react-three packages for compatibility
  transpilePackages: ['@react-three/fiber', '@react-three/drei'],
  // For static export (if needed)
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // }
}

module.exports = nextConfig

