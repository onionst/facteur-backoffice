import { notification } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { Article } from '@/dtos/articles/article.dto';
import {
  CreateArticle,
  DeleteArticle,
  DownloadArticles,
  FetchArticleById,
  FetchArticles,
  FetchMetadata,
  FetchTranslation,
  UpdateArticle
} from '@/services/articles.service';

export type ArticlesPage = {
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export type ArticlesContextProps = {
  articles: Article[];
  page: ArticlesPage;
  loading: boolean;
  fetchArticleData: (id: string) => Promise<Article | undefined>;
  fetchArticleById: (id: string) => Promise<Article | undefined>;
  fetchMetadata: (type: ArticleType, url: string) => Promise<any>;
  isDebunkArticle: (articleType: ArticleType) => boolean;
  handleFetchUrlMetadata: (
    articleType: ArticleType,
    url: string,
    setForm: Dispatch<SetStateAction<any>>,
    setFetchingUrlMetadata: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
  fetchArticles: (filter?: any, pageIndex?: any) => Promise<void>;
  createArticle: (article: any) => Promise<void>;
  updateArticle: (article: any) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  fetchTranslation: (text: string) => Promise<string>;
  downloadArticles: (filter: any) => Promise<Blob | undefined>;
};
export const ArticlesContext = createContext<ArticlesContextProps>(
  // @ts-ignore
  {}
);
export const ARTICLES_LIMIT_PER_PAGE = 20;
export type ArticlesProviderProps = { children: any };
export const ArticlesProvider = (props: ArticlesProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const [page, setPage] = useState<ArticlesPage>({
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0
  });

  const fetchArticleData = async (id: string): Promise<Article | undefined> => {
    return articles.find(article => article.externalId === id);
  };

  const fetchArticleById = async (id: string): Promise<Article | undefined> => {
    try {
      return await FetchArticleById(id);
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

  const fetchArticles = async (filter?: any, pageIndex: number = 1) => {
    try {
      setLoading(true);
      const data = await FetchArticles({
        order: '-dateModified',
        ...filter,
        page: pageIndex,
        limit: ARTICLES_LIMIT_PER_PAGE
      });

      setArticles(data.articles);
      setPage({
        ...data.page,
        records: data.records
      });
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
      setArticles([]);
    }
  };

  const fetchMetadata = async (type: ArticleType, url: string): Promise<any> => {
    try {
      return await FetchMetadata(type, url);
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
      return {};
    }
  };

  const isDebunkArticle = (articleType: ArticleType) => [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType);

  const handleFetchUrlMetadata = async (
    articleType: ArticleType,
    url: string,
    setForm: any,
    setFetchingUrlMetadata: any
  ): Promise<void> => {
    try {
      setFetchingUrlMetadata(true);

      const { metadata, claimReview, language } = await fetchMetadata(articleType, url);

      setForm((prev: any) => ({
        ...prev,
        inLanguage: language || '',
        description: metadata?.summary || '',
        headlineNative: metadata?.title || prev?.headlineNative,
        image: metadata?.image || metadata?.meta_image || prev?.image,
        datePublished: dayjs(metadata?.date).isValid() ? dayjs(metadata?.date) : prev?.datePublished
      }));

      if (isDebunkArticle(articleType)) {
        setForm((prev: any) => ({
          ...prev,
          claimreviewedNative: claimReview?.claimReviewed,
          itemReviewed: {
            datePublished: claimReview?.itemReviewed?.datePublished ?? claimReview?.datePublished,
            author: claimReview?.itemReviewed?.author?.name,
            politicalParty: prev?.itemReviewed?.politicalParty,
            appearances: prev?.itemReviewed?.appearances
          }
        }));
      }

      setFetchingUrlMetadata(false);
    } catch (err) {
      setFetchingUrlMetadata(false);
    }
  };

  const createArticle = async (article: any): Promise<void> => {
    try {
      await CreateArticle(article);
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Article updated'
      });
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else if (err?.response?.status === 409 || err?.statusCode === 409) {
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

  const updateArticle = async (article: any): Promise<void> => {
    try {
      const { externalId, ...payload } = article;
      await UpdateArticle(externalId, payload);
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Article published'
      });
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else if (err?.response?.status === 409 || err?.statusCode === 409) {
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
      console.log(text);
      const response = await FetchTranslation(text);
      console.log(response);
      return response;
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

  const downloadArticles = async (filter: any): Promise<Blob | undefined> => {
    try {
      const data = await DownloadArticles({
        order: '-dateModified',
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
      } else if (err?.response?.status === 409 || err?.statusCode === 409) {
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
      return undefined;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await DeleteArticle(id);
      setArticles((prev: any) => prev.filter((article: any) => article.externalId != id));
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Article deleted'
      });
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
    articles,
    page,
    loading,
    fetchArticleData,
    fetchArticleById,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchTranslation,
    downloadArticles,
    isDebunkArticle,
    handleFetchUrlMetadata,
    fetchMetadata
  };
  return <ArticlesContext.Provider value={context}>{props.children}</ArticlesContext.Provider>;
};

export const useArticles = () => useContext(ArticlesContext);
