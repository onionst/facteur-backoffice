import Store from 'store';
import { api, parseUrl } from './api';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import { SETTINGS } from '@/constants/settings';
import { STORAGE_KEYS } from '@/constants/store.constant';
import { Article } from '@/dtos/articles/article.dto';
import { cleanObject } from '@/utils/clean';

const PREFIX = '/articles';

export const CreateArticle = async (article: Partial<Article>) => {
  const response = await api.post(parseUrl(PREFIX), article);
  return response.data;
};

export const DownloadArticles = async (filter: any) => {
  try {
    const headers = new Headers({
      Authorization: `Bearer ${Store.get(STORAGE_KEYS.ACCESS_TOKEN)}`
    });
    const url = SETTINGS.PUBLIC_API_URL + parseUrl(PREFIX);
    // @ts-ignore
    const response = await fetch(url + '?' + new URLSearchParams(cleanObject(filter)), { headers });

    const reader: any = response?.body?.getReader();
    const chunks = [];
    let done, value;

    while (!done) {
      ({ done, value } = await reader.read());
      if (done) break;
      chunks.push(value);
    }

    const concatenatedChunks = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []));
    const text = new TextDecoder().decode(concatenatedChunks);

    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
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

export const FetchMetadata = async (type: ArticleType, url: string) => {
  const response = await api.post(parseUrl(PREFIX, '/url/metadata'), { type, url });
  return response?.data;
};
