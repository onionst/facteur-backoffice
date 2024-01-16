import { ee24api, parseUrl } from './api';
import { Filter } from '@/components/EE24Filter/EE24Filter';
import { Article } from '@/dtos/articles/article.dto';
import { cleanObject } from '@/utils/clean';

const PREFIX = '/articles';

export const FetchEE24Articles = async (
  filter: Filter & { search: string; page?: number; limit?: number }
): Promise<{
  articles: Article[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await ee24api.get(parseUrl(PREFIX), { params: { order: '-datePublished', ...cleanObject(filter) } });
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
