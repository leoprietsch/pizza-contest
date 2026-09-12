/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'regulator-myself-overpower.ngrok-free.dev',
    '*.ngrok-free.app',
    '*.ngrok-free.dev',
  ],
  devIndicators: false,
};

module.exports = nextConfig;