import { api, parseUrl } from './api';

const PREFIX = '/articles';

export const CreateArticle = async (article: any) => {
  const response = await api.post(parseUrl(PREFIX), article);
  return response.data;
};

export const FetchTranslation = async (text: string): Promise<string> => {
  const response = await api.post(parseUrl(PREFIX, 'translate'), { text });
  return response.data;
};
