import { api, parseUrl } from './api';
const PREFIX = '/articles';

import { Trending } from '@/dtos/trendings/trending.dto';

export const FetchTrendings = async (): Promise<{ trendings: Trending[]; lastModifiedAt: string }> => {
  const response = await api.get(parseUrl(PREFIX, 'trends'));
  const { data } = response;

  return {
    trendings: data?.trendings,
    lastModifiedAt: data?.lastModifiedAt
  };
};
