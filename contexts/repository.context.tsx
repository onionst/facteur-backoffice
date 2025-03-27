import { notification } from 'antd';
import { createContext, useContext, useState } from 'react';
import { Filter } from '@/components/RepositoryFilter/RepositoryFilter';
import { FileType } from '@/components/RepositorySearch/RepositorySearch';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { Article } from '@/dtos/articles/article.dto';
import {
  DownloadRepositoryArticles,
  FetchRepositoryArticleById,
  FetchRepositoryArticles,
  FetchRepositoryArticlesByImage,
  FetchRepositoryArticlesByVideo,
  FetchRepositoryArticlesByVideoOrAudio
} from '@/services/repository.service';

export type RepositoryArticlesPage = {
  maxPage: number;
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export const ARTICLES_LIMIT_PER_PAGE = 20;
export type RepositoryContextProps = {
  loading: boolean;
  notFound: { type: FileType; value: string } | null;
  articles: Article[];
  fetchArticleData: (id: string) => Promise<Article | undefined>;
  fetchArticleById: (id: string) => Promise<Article | undefined>;
  page: RepositoryArticlesPage;
  downloadRepositoryArticles: (filter: Filter & { search?: string }) => Promise<Blob | undefined>;
  fetchRepositoryArticlesByImage: (url: string) => Promise<void>;
  fetchRepositoryArticlesByVideo: (fingerPrints: any[], portrait: string) => Promise<void>;
  fetchRepositoryArticlesByAudio: (url: string) => Promise<void>;
  fetchRepositoryArticles: (filter: Filter & { search?: string }, pageIndex?: number) => Promise<void>;
};
export const RepositoryContext = createContext<RepositoryContextProps>(
  // @ts-ignore
  {}
);
export type RepositoryProviderProps = {
  children: any;
};
export const RepositoryProvider = (props: RepositoryProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [notFound, setNotFound] = useState<{ type: FileType; value: string } | null>(null);
  const [page, setPage] = useState<RepositoryArticlesPage>({
    maxPage: 1,
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0
  });
  const fetchRepositoryArticles = async (filter: any, pageIndex: number = 1) => {
    try {
      setLoading(true);
      const data = await FetchRepositoryArticles({
        ...filter,
        page: pageIndex,
        limit: ARTICLES_LIMIT_PER_PAGE
      });

      setArticles(data.articles);
      setPage({
        ...data.page,
        maxPage: data.page.maxPage,
        records: data.records
      });
      if (data.articles.length === 0) {
        setNotFound({ type: 'TEXT', value: '' });
      } else {
        setNotFound(null);
      }
      setLoading(false);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setArticles([]);
        setNotFound({ type: 'TEXT', value: '' });
      } else if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else if (err?.response?.status === 409) {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'The article url already exists'
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      setLoading(false);
    }
  };

  const fetchArticleData = async (id: string): Promise<Article | undefined> => {
    return articles.find(article => article.externalId === id);
  };

  const fetchArticleById = async (id: string): Promise<Article | undefined> => {
    try {
      return await FetchRepositoryArticleById(id);
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      return undefined;
    }
  };

  const downloadRepositoryArticles = async (filter: any): Promise<Blob | undefined> => {
    try {
      const data = await DownloadRepositoryArticles({
        order: '-datePublished',
        ...filter,
        export: true
      });

      return data;
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      return undefined;
    }
  };

  const fetchRepositoryArticlesByImage = async (url: string) => {
    try {
      setLoading(true);
      const data = await FetchRepositoryArticlesByImage(url);
      setArticles(data.articles);
      setPage({
        ...data.page,
        records: data.records
      });
      if (data.articles.length === 0) {
        setNotFound({ type: 'IMAGE', value: url });
      } else {
        setNotFound(null);
      }
      setLoading(false);
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      setArticles([]);
      setNotFound({ type: 'IMAGE', value: url });
      setLoading(false);
    }
  };

  const fetchRepositoryArticlesByVideo = async (fingerPrints: any[], portrait: string) => {
    try {
      setLoading(true);
      const data = await FetchRepositoryArticlesByVideo(fingerPrints);
      setArticles(data.articles);
      setPage({
        ...data.page,
        records: data.records
      });
      if (data.articles.length === 0) {
        setNotFound({ type: 'VIDEO', value: portrait });
      } else {
        setNotFound(null);
      }
      setLoading(false);
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      setArticles([]);
      setNotFound({ type: 'VIDEO', value: portrait });
      setLoading(false);
    }
  };

  const fetchRepositoryArticlesByAudio = async (url: string) => {
    try {
      setLoading(true);
      const data = await FetchRepositoryArticlesByVideoOrAudio(url);
      setArticles(data.articles);
      setPage({
        ...data.page,
        records: data.records
      });
      if (data.articles.length === 0) {
        setNotFound({ type: 'AUDIO', value: '/assets/portraits/audio.svg' });
      } else {
        setNotFound(null);
      }
      setLoading(false);
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      setArticles([]);
      setNotFound({ type: 'AUDIO', value: '/assets/portraits/audio.svg' });
      setLoading(false);
    }
  };

  const context = {
    loading,
    notFound,
    articles,
    page,
    fetchRepositoryArticles,
    fetchRepositoryArticlesByImage,
    fetchRepositoryArticlesByVideo,
    fetchRepositoryArticlesByAudio,
    downloadRepositoryArticles,
    fetchArticleById,
    fetchArticleData
  };

  return <RepositoryContext.Provider value={context}>{props.children}</RepositoryContext.Provider>;
};

export const useRepository = () => useContext(RepositoryContext);
