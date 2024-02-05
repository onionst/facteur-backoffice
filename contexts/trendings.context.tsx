import { notification } from 'antd';
import dayjs from 'dayjs';
import { ReactNode, createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { Trending } from '@/dtos/trendings/trending.dto';
import { FetchTrendings } from '@/services/trendings.service';

export type TrendingsContextProps = {
  trendings: Trending[];
  lastModifiedAt: Date;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [trendings, setTrendings] = useState<Trending[]>([]);
  const [lastModifiedAt, setLastModifiedAt] = useState<Date>(new Date());

  const fetchTrendings = async () => {
    try {
      setLoading(true);
      const data = await FetchTrendings();
      setTrendings(data?.trendings);
      setLastModifiedAt(dayjs(data?.lastModifiedAt).toDate());
      setLoading(false);
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
      setLoading(false);
    }
  };

  const context = {
    loading,
    trendings,
    fetchTrendings,
    lastModifiedAt
  };
  return <TrendingsContext.Provider value={context}>{props.children}</TrendingsContext.Provider>;
};

export const useTrendings = () => useContext(TrendingsContext);
