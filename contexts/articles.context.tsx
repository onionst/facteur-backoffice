import { notification } from 'antd';
import { createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { CreateArticle, FetchTranslation } from '@/services/articles.service';

export type ArticlesPage = {
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export type ArticlesContextProps = {
  createArticle: (article: any) => Promise<void>;
  fetchTranslation: (text: string) => Promise<string>;
};
export const ArticlesContext = createContext<ArticlesContextProps>(
  // @ts-ignore
  {}
);
export type ArticlesProviderProps = { children: any };
export const ArticlesProvider = (props: ArticlesProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState<ArticlesPage>({
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0
  });

  const createArticle = async (article: any): Promise<void> => {
    try {
      await CreateArticle(article);
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Article published'
      });
    } catch (err: any) {
      console.error(err);
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
      throw new Error();
    }
  };

  const fetchTranslation = async (text: string): Promise<string> => {
    try {
      return await FetchTranslation(text);
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
      throw new Error();
    }
  };

  const context = { createArticle, fetchTranslation };
  return <ArticlesContext.Provider value={context}>{props.children}</ArticlesContext.Provider>;
};

export const useArticles = () => useContext(ArticlesContext);
