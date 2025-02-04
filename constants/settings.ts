import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const SETTINGS = {
  APP_URL: publicRuntimeConfig.APP_URL,
  PUBLIC_API_URL: publicRuntimeConfig.PUBLIC_API_URL,
  PUBLIC_ES_API_URL: publicRuntimeConfig.PUBLIC_ES_API_URL,
  GOOGLE_OAUTH_ID: publicRuntimeConfig.GOOGLE_OAUTH_ID,
  PUBLIC_CHATBOT_URL: publicRuntimeConfig.PUBLIC_CHATBOT_URL + '/api/chat',
  PUBLIC_STATS_URL: publicRuntimeConfig.PUBLIC_STATS_URL,
  PUBLIC_TRENDS_URL: publicRuntimeConfig.PUBLIC_TRENDS_URL,
  PUBLIC_SECTIONS: (publicRuntimeConfig.PUBLIC_SECTIONS || '').split(',').map((section: string) => section.trim().toLowerCase()),
  PUBLIC_SEARCH_API_KEY: publicRuntimeConfig.PUBLIC_SEARCH_API_KEY
};
