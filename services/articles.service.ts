import { api, parseUrl } from './api';

const PREFIX = '/articles';

export const CreateArticle = async (article: any) => {
  const response = await api.post(parseUrl(PREFIX), article);
  return response.data;
};

export const FetchArticles = async (
  query: any
): Promise<{
  articles: any[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX), { params: query });
  const headers = response?.headers;
  const current = parseInt(headers['pagination-page']);
  const maxPage = parseInt(headers['pagination-total-pages']);
  return {
    articles: response?.data,
    records: parseInt(headers['pagination-count']),
    page: {
      current: current - 1,
      prevPage: current > 1 ? current - 1 : null,
      nextPage: current < maxPage ? current + 1 : null
    }
  };
};

export const FetchTranslation = async (text: string): Promise<string> => {
  const response = await api.post(parseUrl(PREFIX, 'translate'), { text });
  return response.data;
};
