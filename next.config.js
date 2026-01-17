/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['cdn.supabase.com', 'upcdn.supabase.com', 'lh3.googleusercontent.com', 'cjhjbxtfmilpavjewvsi.supabase.co'],
  },
};

module.exports = nextConfig;