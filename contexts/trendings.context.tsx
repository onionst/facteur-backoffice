import { notification } from 'antd';
import { ReactNode, createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { Trending } from '@/dtos/trendings/trending.dto';
import { FetchTrendings } from '@/services/trendings.service';

export type TrendingsContextProps = {
  trendings: Trending[];
  fetchTrendings: () => Promise<void>;
};
export const TrendingsContext = createContext<TrendingsContextProps>(
  // @ts-ignore
  {}
);

export type TrendingsProviderProps = {
  children: ReactNode;
};
export const TrendingsProvider = (props: TrendingsProviderProps) => {
  const [trendings, setTrendings] = useState<Trending[]>([]);

  const fetchTrendings = async () => {
    try {
      const data = await FetchTrendings();
      setTrendings(data);
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
    }
  };

  const context = {
    trendings,
    fetchTrendings
  };
  return <TrendingsContext.Provider value={context}>{props.children}</TrendingsContext.Provider>;
};

export const useTrendings = () => useContext(TrendingsContext);
