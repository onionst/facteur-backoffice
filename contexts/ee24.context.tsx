import { notification } from 'antd';
import { createContext, useContext, useState } from 'react';
import { Filter } from '@/components/EE24Filter/EE24Filter';
import { FileType } from '@/components/EE24Search/EE24Search';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { Article } from '@/dtos/articles/article.dto';
import { DownloadEE24Articles, FetchEE24Articles, FetchEE24ArticlesByImage } from '@/services/ee24.service';

export type EE24ArticlesPage = {
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export const EE24_ARTICLES_LIMIT_PER_PAGE = 20;
export type EE24ContextProps = {
  loading: boolean;
  notFound: { type: FileType; value: string } | null;
  articles: Article[];
  page: EE24ArticlesPage;
  downloadEE24Articles: (filter: Filter & { search?: string }) => Promise<Array<Partial<Article>>>;
  fetchEE24ArticlesByImage: (url: string) => Promise<void>;
  fetchEE24Articles: (filter: Filter & { search?: string }, pageIndex?: number) => Promise<void>;
};
export const EE24Context = createContext<EE24ContextProps>(
  // @ts-ignore
  {}
);
export type EE24ProviderProps = {
  children: any;
};
export const EE24Provider = (props: EE24ProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [notFound, setNotFound] = useState<{ type: FileType; value: string } | null>(null);
  const [page, setPage] = useState<EE24ArticlesPage>({
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0
  });
  const fetchEE24Articles = async (filter: any, pageIndex: number = 1) => {
    try {
      setLoading(true);
      const data = await FetchEE24Articles({
        ...filter,
        page: pageIndex,
        limit: EE24_ARTICLES_LIMIT_PER_PAGE
      });

      setArticles(data.articles);
      setPage({
        ...data.page,
        records: data.records
      });
      if (data.articles.length === 0) {
        setNotFound({ type: 'TEXT', value: '' });
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
      setArticles([]);
      setNotFound({ type: 'TEXT', value: '' });
      setLoading(false);
    }
  };

  const downloadEE24Articles = async (filter: any): Promise<Array<Partial<Article>>> => {
    try {
      console.log('here!');
      const data = await DownloadEE24Articles({
        ...filter,
        export: true
      });
      console.log(data);
      return data;
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
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
      return [];
    }
  };

  const fetchEE24ArticlesByImage = async (url: string) => {
    try {
      setLoading(true);
      const [data] = await Promise.all([FetchEE24ArticlesByImage(url)]);
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
      setArticles([]);
      setNotFound({ type: 'IMAGE', value: url });
      setLoading(false);
    }
  };

  const context = {
    loading,
    notFound,
    articles,
    page,
    fetchEE24Articles,
    fetchEE24ArticlesByImage,
    downloadEE24Articles
  };

  return <EE24Context.Provider value={context}>{props.children}</EE24Context.Provider>;
};

export const useEE24 = () => useContext(EE24Context);
