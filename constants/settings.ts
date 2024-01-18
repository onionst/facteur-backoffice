import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const SETTINGS = {
  APP_URL: publicRuntimeConfig.APP_URL,
  PUBLIC_API_URL: publicRuntimeConfig.PUBLIC_API_URL,
  PUBLIC_ES_API_URL: publicRuntimeConfig.PUBLIC_ES_API_URL,
  GOOGLE_OAUTH_ID: publicRuntimeConfig.GOOGLE_OAUTH_ID,
  PUBLIC_CHATBOT_URL: publicRuntimeConfig.PUBLIC_CHATBOT_URL,
  PUBLIC_STATS_URL: publicRuntimeConfig.PUBLIC_STATS_URL
};
