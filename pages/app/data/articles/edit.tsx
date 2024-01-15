import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { File } from 'react-feather';
import Row from '@/bases/Row/Row';
import EditArticleDraftForm from '@/components/Form/ArticleDrafts/EditArticleDraftForm';
import EditDebunkArticleDraftForm from '@/components/Form/ArticleDrafts/EditDebunkArticleDraftForm';
import ArticlePreviewForm from '@/components/Form/ArticlePreviews/ArticlePreviewForm';
import DebunkArticlePreviewForm from '@/components/Form/ArticlePreviews/DebunkArticlePreviewForm';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Stepper from '@/components/Stepper/Stepper';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import useWindowSize from '@/hooks/useWindowWidth';

export default function Edit() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();
  const { updateArticle, fetchArticles, fetchArticleData, fetchArticleById } = useArticles();
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

  const handleSetup = async (id?: any) => {
    try {
      setLoading(true);
      setStep(0);
      const article: any = await fetchArticleData(id);
      if (!article) {
        const articleFound: any = await fetchArticleById(id);
        if (!articleFound) {
          router.push('/app/data/articles');
        } else {
          setForm(prev => ({ ...prev, ...articleFound }));
          setArticleType(articleFound?.type);
          setLoading(false);
        }
      } else {
        setForm(prev => ({ ...prev, ...article }));
        setArticleType(article?.type);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      handleSetup(router?.query?.id);
    }
  }, [router]);

  const handleSubmit = async () => {
    try {
      let payload: any = {
        externalId: form?.externalId,
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

      await updateArticle(Object.fromEntries(Object.entries(payload).filter(v => v[1] != null)));

      fetchArticles({
        publisher: session.organization?.domain
      });
      router.push('/app/data/articles');
    } catch (err) {
      console.log(err);
      setStep(1);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

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
        title="Edit article"
      ></Header>
      <Wrapper>
        <Row align="SPACE" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: '25%' }}>
            <Stepper
              current={step}
              items={[
                { title: 'Draft', description: '' },
                { title: 'Preview', description: '' },
                { title: 'Publish', description: '' }
              ]}
            />
          </div>

          {step === 0 ? (
            articleType ? (
              [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType) ? (
                <EditDebunkArticleDraftForm
                  onBack={() => setStep(0)}
                  form={form}
                  setForm={setForm}
                  type={articleType}
                  onContinue={() => setStep(1)}
                />
              ) : (
                <EditArticleDraftForm
                  onBack={() => setStep(0)}
                  form={form}
                  setForm={setForm}
                  type={articleType}
                  onContinue={() => setStep(1)}
                />
              )
            ) : null
          ) : null}
          {step === 1 ? (
            articleType ? (
              [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType) ? (
                <DebunkArticlePreviewForm
                  onBack={() => setStep(0)}
                  form={form}
                  setForm={setForm}
                  type={articleType}
                  onPublish={handleSubmit}
                />
              ) : (
                <ArticlePreviewForm onBack={() => setStep(0)} form={form} setForm={setForm} type={articleType} onPublish={handleSubmit} />
              )
            ) : null
          ) : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
