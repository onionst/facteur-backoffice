export const plainArticle = (rawData: any) => {
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

  return {
    externalId: data?.externalId || '',
    type: data?.type || '',
    url: data?.url || '',
    headline: data?.headline || '',
    headlineNative: data?.headlineNative || '',
    datePublished: data?.datePublished || '',
    image: data?.image || '',
    keywords: data?.keywords?.join('|') || '',
    inLanguage: data?.inLanguage || '',
    topics: data?.topics?.join('|') || '',
    euRelation: data?.euRelation || '',
    countryOfOrigin: data?.countryOfOrigin || '',
    contentLocation: data?.contentLocation?.join('|') || '',
    claimreviewed: data?.claimreviewed || '',
    claimreviewedNative: data?.claimreviewedNative || '',
    reviewRating: data?.reviewRating || '',
    itemReviewedDatePublished: data?.itemReviewed?.datePublished || '',
    itemReviewedAuthor: data?.itemReviewed?.author || '',
    itemReviewedPoliticalParty: data?.itemReviewed?.politicalParty || '',
    ...data?.itemReviewed?.appearances?.map((appearance: any, index: number) => ({
      [`itemReviewedAppearanceDescription_${index}`]: appearance?.description || '',
      [`itemReviewedAppearanceHeadlineNative_${index}`]: appearance?.headlineNative || '',
      [`itemReviewedAppearanceImage_${index}`]: appearance?.image || '',
      [`itemReviewedAppearanceDatePublished_${index}`]: appearance?.datePublished || ''
    }))
  };
};
