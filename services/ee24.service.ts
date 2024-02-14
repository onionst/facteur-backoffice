import Store from 'store';
import { api, ee24api, parseUrl } from './api';
import { Filter } from '@/components/EE24Filter/EE24Filter';
import { STORAGE_KEYS } from '@/constants/store.constant';
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
  const response = await ee24api.get(parseUrl(PREFIX), { params: cleanObject(filter) });
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

export const DownloadEE24Articles = async (filter: Filter & { search: string }) => {
  try {
    const headers = new Headers({
      Authorization: `Bearer ${Store.get(STORAGE_KEYS.ACCESS_TOKEN)}`
    });
    const url = ee24api.getUri({
      url: parseUrl(PREFIX),
      params: cleanObject(filter)
    });
    // @ts-ignore
    const response = await fetch(url, { headers });

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
export const FetchEE24ArticleById = async (id: string): Promise<Article> => {
  const response = await ee24api.get(parseUrl(PREFIX, `/id/${id}`));
  return response.data;
};
export const FetchEE24ArticlesByImage = async (
  url: string
): Promise<{
  articles: Article[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX, `/find/image/${url.replaceAll(':', '%3A').replaceAll('/', '%2F')}`));
  const current = 1;
  const maxPage = 1;
  return {
    articles: response?.data,
    records: parseInt(response.data.length),
    page: {
      current: current - 1,
      prevPage: current > 1 ? current - 1 : null,
      nextPage: current < maxPage ? current + 1 : null
    }
  };
};

export const FetchEE24ArticlesByVideoOrAudio = async (
  url: string
): Promise<{
  articles: Article[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX, `/find/media/${url.replaceAll(':', '%3A').replaceAll('/', '%2F')}`));
  const current = 1;
  const maxPage = 1;
  return {
    articles: response?.data,
    records: parseInt(response.data.length),
    page: {
      current: current - 1,
      prevPage: current > 1 ? current - 1 : null,
      nextPage: current < maxPage ? current + 1 : null
    }
  };
};

export const FetchEE24ArticlesByVideo = async (
  fingerPrints: any[]
): Promise<{
  articles: Article[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.post(parseUrl(PREFIX, `/find/video/fingerprints`), fingerPrints);
  const current = 1;
  const maxPage = 1;
  return {
    articles: response?.data,
    records: parseInt(response.data.length),
    page: {
      current: current - 1,
      prevPage: current > 1 ? current - 1 : null,
      nextPage: current < maxPage ? current + 1 : null
    }
  };
};
