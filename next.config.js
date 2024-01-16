const withAntdLess = require('next-plugin-antd-less');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
    PUBLIC_ES_API_URL: process.env.PUBLIC_ES_API_URL,
    GOOGLE_OAUTH_ID: process.env.GOOGLE_OAUTH_ID,
    APP_URL: process.env.APP_URL
  }
};

module.exports = withAntdLess(nextConfig);
