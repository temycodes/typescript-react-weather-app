/** @type {import('next').NextConfig} */
/**register environment variables */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:["openweathermap.org"],
  },
}
module.exports = nextConfig
