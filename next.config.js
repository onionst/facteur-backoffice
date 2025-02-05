const withAntdLess = require('next-plugin-antd-less');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
    PUBLIC_ES_API_URL: process.env.PUBLIC_ES_API_URL,
    GOOGLE_OAUTH_ID: process.env.GOOGLE_OAUTH_ID,
    APP_URL: process.env.APP_URL,
    PUBLIC_CHATBOT_URL: process.env.PUBLIC_CHATBOT_URL,
    PUBLIC_STATS_URL: process.env.PUBLIC_STATS_URL,
    PUBLIC_TRENDS_URL: process.env.PUBLIC_TRENDS_URL,
    PUBLIC_SECTIONS: process.env.PUBLIC_SECTIONS,
    PUBLIC_SEARCH_API_KEY: process.env.PUBLIC_SEARCH_API_KEY
  }
};

module.exports = withAntdLess(nextConfig);
