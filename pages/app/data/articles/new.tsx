import { useRouter } from 'next/router';
import { useState } from 'react';
import { File } from 'react-feather';
import Row from '@/bases/Row/Row';
import ArticleForm from '@/components/Form/ArticleDrafts/ArticleForm';
import ArticlePublished from '@/components/Form/ArticlePublish';
import SelectArticleType, { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Stepper from '@/components/Stepper/Stepper';
import Wrapper from '@/components/Wrapper/Wrapper';
import { MIN_LENGTH_KEYWORDS } from '@/constants/accept';
import { useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import useWindowSize from '@/hooks/useWindowWidth';

export default function New() {
  const router = useRouter();
  const { session } = useAuth();
  const { createArticle, fetchArticles, isDebunkArticle } = useArticles();
  const [step, setStep] = useState<number>(0);
  const [articleType, setArticleType] = useState<null | ArticleType>(null);
  const { width } = useWindowSize();
  const [form, setForm] = useState({
    externalId: '',
    type: '',
    url: '',
    headline: '',
    headlineNative: '',
    datePublished: null,
    image: '',
    keywords: [],
    inLanguage: session.organization?.language || '',
    topics: [],
    euRelation: '',
    countryOfOrigin: session.organization?.country || '',
    contentLocation: [],
    claimReviews: [
      {
        claimReviewed: '',
        claimReviewedNative: '',
        reviewRating: '',
        appearances: [],
        itemReviewed: {
          datePublished: null,
          author: '',
          politicalParty: ''
        },
        associatedClaimReview: []
      }
    ],
    evidences: []
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
        keywords: form?.keywords?.filter((keyword: string) => keyword?.length >= MIN_LENGTH_KEYWORDS) || null,
        inLanguage: form.inLanguage || null,
        topics: form.topics || null,
        euRelation: form.euRelation || null,
        countryOfOrigin: form.countryOfOrigin || null,
        contentLocation: form.contentLocation || null,
        claimReviews: structuredClone(form.claimReviews),
        evidences: structuredClone(form.evidences)
      };
      if (articleType && isDebunkArticle(articleType)) {
        payload = {
          ...payload
        };

        if (articleType === ArticleType.Factcheck) {
          const authorData = Object.fromEntries(
            Object.entries({
              author: form.claimReviews[0].itemReviewed.author || null,
              politicalParty: form.claimReviews[0].itemReviewed.politicalParty || null
            }).filter(v => v[1] != null)
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
      fetchArticles({
        publisher: session.organization?.domain
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      setStep(1);
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
                  externalId: '',
                  type: '',
                  url: '',
                  headline: '',
                  headlineNative: '',
                  datePublished: null,
                  image: '',
                  keywords: [],
                  inLanguage: session.organization?.language || '',
                  topics: [],
                  euRelation: '',
                  countryOfOrigin: session.organization?.country || '',
                  contentLocation: [],
                  claimReviews: [
                    {
                      claimReviewed: '',
                      claimReviewedNative: '',
                      reviewRating: '',
                      appearances: [],
                      itemReviewed: {
                        datePublished: null,
                        author: '',
                        politicalParty: ''
                      },
                      associatedClaimReview: []
                    }
                  ],
                  evidences: []
                });
                setStep(1);
              }}
            />
          )}
          {step === 1 && articleType ? (
            <ArticleForm onBack={() => setStep(0)} form={form} setForm={setForm} type={articleType} onContinue={() => setStep(2)} />
          ) : null}
          {step === 2 && articleType ? (
            <ArticleForm
              preview={true}
              onBack={() => setStep(1)}
              form={form}
              setForm={setForm}
              type={articleType}
              onPublish={handleSubmit}
            />
          ) : null}
          {step === 3 ? <ArticlePublished /> : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
