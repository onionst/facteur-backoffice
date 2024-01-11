import { useRouter } from 'next/router';
import { useState } from 'react';
import { File } from 'react-feather';
import Row from '@/bases/Row/Row';
import ArticleDraftForm from '@/components/Form/ArticleDrafts/ArticleDraftForm';
import DebunkArticleDraftForm from '@/components/Form/ArticleDrafts/DebunkArticleDraftForm';
import ArticlePreviewForm from '@/components/Form/ArticlePreviews/ArticlePreviewForm';
import DebunkArticlePreviewForm from '@/components/Form/ArticlePreviews/DebunkArticlePreviewForm';
import ArticlePublished from '@/components/Form/ArticlePublish';
import SelectArticleType, { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Stepper from '@/components/Stepper/Stepper';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useArticles } from '@/contexts/articles.context';
import useWindowSize from '@/hooks/useWindowWidth';

export default function New() {
  const router = useRouter();
  const { createArticle } = useArticles();
  const [step, setStep] = useState<number>(0);
  const [articleType, setArticleType] = useState<null | ArticleType>(null);
  const { width } = useWindowSize();
  const [form, setForm] = useState({
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
    contentLocation: '',
    claimreviewed: '',
    claimreviewedNative: '',
    reviewRating: '',
    itemReviewed: {
      datePublished: null,
      author: '',
      politicalParty: '',
      appearances: []
    },
    associatedClaimReview: []
  });

  const handleSubmit = async () => {
    try {
      let payload: any = {
        type: articleType,
        url: form.url,
        headline: form.headline,
        headlineNative: form.headlineNative,
        datePublished: form.datePublished || null,
        image: form.image || null,
        keywords: form.keywords || null,
        inLanguage: form.inLanguage || null,
        topics: form.topics || null,
        euRelation: form.euRelation || null,
        countryOfOrigin: form.countryOfOrigin || null,
        contentLocation: form.contentLocation || null
      };
      if (articleType && [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType)) {
        payload = {
          ...payload,
          claimreviewed: form.claimreviewed,
          claimreviewedNative: form.claimreviewedNative,
          reviewRating: form.reviewRating,
          itemReviewed: {
            appearances: form.itemReviewed.appearances.map(appearance => Object.fromEntries(Object.entries(appearance).filter(v => v[1])))
          }
        };

        if (form.itemReviewed.datePublished) {
          payload = {
            ...payload,
            itemReviewed: {
              ...payload.itemReviewed,
              datePublished: form.itemReviewed.datePublished
            }
          };
        }

        if (articleType === ArticleType.Factcheck) {
          const authorData = Object.fromEntries(
            Object.entries({ author: form.itemReviewed.author || null, politicalParty: form.itemReviewed.politicalParty || null }).filter(
              v => v[1] != null
            )
          );

          payload = {
            ...payload,
            itemReviewed: {
              ...payload.itemReviewed,
              ...authorData
            }
          };
        }
      }

      await createArticle(Object.fromEntries(Object.entries(payload).filter(v => v[1] != null)));
      setStep(3);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header
        onBack={() => {
          if (step > 0) {
            setStep(prev => prev - 1);
          } else {
            router.back();
          }
        }}
        backable
        icon={<File />}
        title="Create article"
      ></Header>
      <Wrapper>
        <Row align="SPACE" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: '25%' }}>
            <Stepper
              current={step}
              items={[
                { title: 'Type', description: '' },
                { title: 'Draft', description: '' },
                { title: 'Preview', description: '' },
                { title: 'Publish', description: '' }
              ]}
            />
          </div>
          {step === 0 && (
            <SelectArticleType
              onSelect={type => {
                setArticleType(type);
                setForm({
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
                  contentLocation: '',
                  claimreviewed: '',
                  claimreviewedNative: '',
                  reviewRating: '',
                  itemReviewed: {
                    datePublished: null,
                    author: '',
                    politicalParty: '',
                    appearances: []
                  },
                  associatedClaimReview: []
                });
                setStep(1);
              }}
            />
          )}
          {step === 1 ? (
            articleType ? (
              [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType) ? (
                <DebunkArticleDraftForm form={form} setForm={setForm} type={articleType} onContinue={() => setStep(2)} />
              ) : (
                <ArticleDraftForm form={form} setForm={setForm} type={articleType} onContinue={() => setStep(2)} />
              )
            ) : null
          ) : null}
          {step === 2 ? (
            articleType ? (
              [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType) ? (
                <DebunkArticlePreviewForm form={form} setForm={setForm} type={articleType} onPublish={handleSubmit} />
              ) : (
                <ArticlePreviewForm form={form} setForm={setForm} type={articleType} onPublish={handleSubmit} />
              )
            ) : null
          ) : null}
          {step === 3 ? <ArticlePublished /> : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
