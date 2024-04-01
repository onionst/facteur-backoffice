import { Filter } from '@/components/EE24Filter/EE24Filter';
import { Article } from '@/dtos/articles/article.dto';
import { FileType } from '@/modals/FileType';

export const plainArticle = (rawData: any, filter: Filter) => {
  const data = {
    externalId: '',
    type: '',
    url: '',
    headline: '',
    headlineNative: '',
    datePublished: null,
    image: '',
    keywords: [],
    inLanguage: '',
    topics: [],
    euRelation: '',
    publisher: '',
    countryOfOrigin: '',
    contentLocation: [],
    claimreviewed: '',
    claimreviewedNative: '',
    reviewRating: '',
    itemReviewed: {
      datePublished: null,
      author: '',
      politicalParty: '',
      appearances: []
    },
    ...rawData
  };

  let responseData: Partial<Article | unknown> = {
    externalId: data?.externalId ?? '',
    type: data?.type ?? '',
    url: data?.url ?? '',
    headline: data?.headline ?? '',
    headlineNative: data?.headlineNative ?? '',
    datePublished: data?.datePublished ?? '',
    image: data?.image ?? '',
    keywords: data?.keywords?.join('|') ?? '',
    inLanguage: data?.inLanguage ?? '',
    topics: data?.topics?.join('|') ?? '',
    euRelation: data?.euRelation ?? '',
    publisher: data?.publisher ?? '',
    countryOfOrigin: data?.countryOfOrigin ?? '',
    contentLocation: data?.contentLocation?.join('|') ?? '',
    claimreviewed: data?.claimreviewed ?? '',
    claimreviewedNative: data?.claimreviewedNative ?? '',
    reviewRating: data?.reviewRating ?? '',
    itemReviewedDatePublished: data?.itemReviewed?.datePublished ?? '',
    itemReviewedAuthor: data?.itemReviewed?.author ?? '',
    itemReviewedPoliticalParty: data?.itemReviewed?.politicalParty ?? ''
  };

  if (filter.fileType !== FileType.JSON) {
    const appearances = rawData?.itemReviewed?.appearances?.map((appearance: any, index: number) => ({
      [`itemReviewedAppearanceUrl_${index}`]: appearance?.url ?? '',
      [`itemReviewedAppearanceArchivedAt_${index}`]: appearance?.archivedAt ?? '',
      [`itemReviewedAppearanceAssociatedMedia_${index}`]: appearance?.associatedMedia ?? '',
      [`itemReviewedAppearanceAssociatedMediaType_${index}`]: appearance?.associatedMediaType ?? '',
      [`itemReviewedAppearanceMediaFormat_${index}`]: appearance?.mediaFormat ?? '',
      [`itemReviewedAppearancePlatform_${index}`]: appearance?.platform ?? ''
    }));
    if (appearances?.length > 0) {
      appearances.forEach((appearance: any) => {
        responseData = { ...responseData, ...appearance };
      });
    }
  } else {
    responseData = { ...responseData, appearances: rawData?.itemReviewed?.appearances } as Partial<Article>;
  }

  return responseData;
};
