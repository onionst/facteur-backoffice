import { api, parseUrl } from './api';
import { Article } from '@/dtos/articles/article.dto';
import { cleanObject } from '@/utils/clean';

const PREFIX = '/articles';

export const CreateArticle = async (article: Partial<Article>) => {
  const response = await api.post(parseUrl(PREFIX), article);
  return response.data;
};

export const FetchArticles = async (
  query: any
): Promise<{
  articles: Article[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX), { params: { order: '-datePublished', ...cleanObject(query) } });
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

export const FetchArticleById = async (id: string): Promise<Article> => {
  const response = await api.get(parseUrl(PREFIX, `/id/${id}`));
  return response.data;
};

export const FetchTranslation = async (text: string): Promise<string> => {
  const response = await api.post(parseUrl(PREFIX, 'translate'), { text });
  return response.data;
};

export const UpdateArticle = async (id: string, article?: Partial<Article>) => {
  const response = await api.patch(parseUrl(PREFIX, id), article);
  return response.data;
};

export const DeleteArticle = async (id: string): Promise<void> => {
  await api.delete(parseUrl(PREFIX, id));
};
