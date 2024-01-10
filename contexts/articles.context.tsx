import { notification } from 'antd';
import { createContext, useContext } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { FetchTranslation } from '@/services/articles.service';

export type ArticlesContextProps = {
  fetchTranslation: (text: string) => Promise<string>;
};
export const ArticlesContext = createContext<ArticlesContextProps>(
  // @ts-ignore
  {}
);
export type ArticlesProviderProps = { children: any };
export const ArticlesProvider = (props: ArticlesProviderProps) => {
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

  const context = { fetchTranslation };
  return <ArticlesContext.Provider value={context}>{props.children}</ArticlesContext.Provider>;
};

export const useArticles = () => useContext(ArticlesContext);
