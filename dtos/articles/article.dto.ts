import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';
import { Subtopic, Topic } from '@/constants/topics';

export class Article {
  _id?: string;
  type: ArticleType;
  url: string;
  headline: string;
  headlineNative: string;
  externalId: string;
  datePublished?: Date;
  publisher: string;
  articleBody?: string;
  image?: string;
  keywords?: string[];
  inLanguage?: LanguageISO;
  copyrightHolder: string;
  description?: string;
  topic: Topic;
  subtopics?: Subtopic[];
  countryOfOrigin: CountryISO;
  contentLocation?: CountryISO;
  maintainer: string;
  claimreviewed?: string;
  claimreviewedNative?: string;
  reviewRating?: ReviewRating;
  imported?: boolean;
  revised?: boolean;
  appearances?: Array<{
    url?: string;
    archivedAt?: string;
    associatedMedia?: MediaType;
    difussionFormat?: MediaFormat;
    platform?: Platform;
    appearanceDate?: Date;
  }>;
  author?: string;
  associatedClaimReview?: string[];
  dateModified?: Date;
  dateCreated?: Date;
}
