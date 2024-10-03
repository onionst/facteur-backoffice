import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { File, Trash } from 'react-feather';
import Button from '@/bases/Button/Button';
import Row from '@/bases/Row/Row';
import ArticleForm from '@/components/Form/ArticleDrafts/ArticleForm';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Stepper from '@/components/Stepper/Stepper';
import Wrapper from '@/components/Wrapper/Wrapper';
import { MIN_LENGTH_KEYWORDS } from '@/constants/accept';
import { ROLES } from '@/constants/roles.constants';
import { useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import { useHistory } from '@/contexts/history.context';
import { useModal } from '@/contexts/modal.context';
import useWindowSize from '@/hooks/useWindowWidth';

export default function Edit() {
  const { canGoBack } = useHistory();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();
  const modals = useModal();
  const { showDeleteArticle } = modals.articles;
  const { updateArticle, fetchArticles, fetchArticleData, fetchArticleById } = useArticles();
  const [step, setStep] = useState<number>(0);
  const [articleType, setArticleType] = useState<null | ArticleType>(null);
  const { width } = useWindowSize();
  const [articleId, setArticleId] = useState<string>('');
  const [ogForm, setOgForm] = useState({
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
        itemReviewed: {
          datePublished: null,
          author: '',
          politicalParty: '',
          appearances: [
            {
              url: ''
            }
          ]
        },
        associatedClaimReview: []
      }
    ],
    evidences: []
  });
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

  const handleSetup = async (id?: any) => {
    try {
      setLoading(true);
      setStep(0);
      const article: any = await fetchArticleData(id);
      if (!article) {
        const articleFound: any = await fetchArticleById(id);
        if (!articleFound) {
          if (router?.query?.f === 'search') {
            router.push('/app/ee24/search');
          } else {
            router.push('/app/data/articles');
          }
        } else {
          setForm(prev => ({ ...prev, ...articleFound }));
          setOgForm(prev => ({ ...prev, ...articleFound }));
          setArticleType(articleFound?.type);
          setLoading(false);
        }
      } else {
        setOgForm(prev => ({ ...prev, ...article }));
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
      // @ts-ignore
      setArticleId(router?.query?.id);
      handleSetup(router?.query?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleDeleteArticle = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    showDeleteArticle(articleId, router?.query?.f === 'search' ? '/app/ee24/search' : '/app/data/articles');
  };

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
        keywords: form?.keywords?.filter((keyword: string) => keyword?.length >= MIN_LENGTH_KEYWORDS) || null,
        inLanguage: form.inLanguage || null,
        topics: form.topics || null,
        euRelation: form.euRelation || null,
        countryOfOrigin: form.countryOfOrigin || null,
        contentLocation: form.contentLocation || null,
        claimReviews: form.claimReviews,
        evidences: form.evidences
      };
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
          claimReviews: payload.claimReviews.map((claimReview: any) => ({
            ...claimReview,
            itemReviewed: {
              ...claimReview.itemReviewed,
              ...authorData
            }
          }))
        };
      } else if (articleType === ArticleType.Prebunk) {
        payload = {
          ...payload,
          claimReviews: payload.claimReviews.map((obj: any) => {
            const { ...rest } = obj;
            delete rest.itemReviewed;
            return rest;
          })
        };
      }

      await updateArticle(Object.fromEntries(Object.entries(payload).filter(v => v[1] != null)));

      let params = {};
      if ([ROLES.ADMIN, ROLES.FACT_CHECKER].includes(session?.role)) {
        params = {
          publisher: session.organization?.domain
        };
      }
      fetchArticles(params);

      if (router?.query?.f === 'search') {
        router.push('/app/ee24/search');
      } else {
        router.push('/app/data/articles');
      }
    } catch (err) {
      console.error(err);
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
        backable={canGoBack()}
        icon={<File />}
        title="Edit article"
      >
        <Button theme="ATTENTION" onClick={e => handleDeleteArticle(e)}>
          Delete <Trash size={18} />
        </Button>
      </Header>
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

          {step === 0 && articleType ? (
            <ArticleForm
              onBack={() => setStep(0)}
              form={form}
              ogForm={ogForm}
              setForm={setForm}
              type={articleType}
              onContinue={() => setStep(1)}
            />
          ) : null}
          {step === 1 && articleType ? (
            <ArticleForm
              preview={true}
              onBack={() => setStep(0)}
              form={form}
              setForm={setForm}
              type={articleType}
              onPublish={handleSubmit}
            />
          ) : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
