import { Skeleton } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Trash } from 'react-feather';
import Button from '@/bases/Button/Button';
import ArticleChrome from '@/components/Article/ArticleChrome';
import ArticleStatus from '@/components/Article/ArticleStatus';
import ArticleTabs from '@/components/Article/ArticleTabs';
import ArticleForm from '@/components/Form/ArticleDrafts/ArticleForm';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Wrapper from '@/components/Wrapper/Wrapper';
import { MIN_LENGTH_KEYWORDS } from '@/constants/accept';
import { ROLES } from '@/constants/roles.constants';
import { useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { normalizeTopic, normalizeSubTopic } from '@/utils/legacyTopics';
import { removeFalsyValues } from '@/utils/validateUrl';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'metadata', label: 'Metadata' },
  { key: 'claims', label: 'Claims' },
  { key: 'ai-reviews', label: 'AI Reviews' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'changelog', label: 'Changelog' }
];

export default function Edit() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();
  const modals = useModal();
  const { showDeleteArticle } = modals.articles;
  const { updateArticle, fetchArticles, fetchArticleData, fetchArticleById } = useArticles();
  const [step, setStep] = useState<number>(0);
  const [articleType, setArticleType] = useState<null | ArticleType>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
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
    topic: '',
    subtopics: [],
    countryOfOrigin: session.organization?.country || '',
    contentLocation: [],
    claimReview: {
      claimReviewed: '',
      aiVerification: '',
      claimReviewedNative: '',
      reviewRating: '',
      author: '',
      appearances: [
        {
          url: ''
        }
      ],
      associatedClaimReview: []
    },
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
    topic: '',
    subtopics: [],
    countryOfOrigin: session.organization?.country || '',
    contentLocation: [],
    claimReview: {
      claimReviewed: '',
      aiVerification: '',
      claimReviewedNative: '',
      reviewRating: '',
      multiclaim: false,
      author: '',
      appearances: [
        {
          url: ''
        }
      ],
      associatedClaimReview: []
    },
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
            router.push('/app/repository/search');
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
    showDeleteArticle(articleId, router?.query?.f === 'search' ? '/app/repository/search' : '/app/data/articles');
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
        topic: normalizeTopic(form.topic) || null,
        subtopics: form.subtopics?.map(subtopic => normalizeSubTopic(form.topic, subtopic)) || null,
        countryOfOrigin: form.countryOfOrigin || null,
        contentLocation: form.contentLocation || null
      };
      payload = {
        ...payload
      };

      if (articleType === ArticleType.Factcheck) {
        payload.evidences = form.evidences;
        payload.claimReview = form.claimReview;
        if (payload.claimReview.multiclaim === undefined) {
          payload.claimReview.multiclaim = false;
        }
        const authorData = Object.fromEntries(
          Object.entries({
            author: form.claimReview.author || null
          }).filter(v => v[1] != null)
        );

        payload = {
          ...payload,
          claimReview: {
            ...payload.claimReview,
            ...authorData
          }
        };
      }
      payload = removeFalsyValues(payload);
      await updateArticle(Object.fromEntries(Object.entries(payload).filter(v => v[1] != null)));

      let params = {};
      if ([ROLES.ADMIN, ROLES.FACT_CHECKER].includes(session?.role)) {
        params = {
          publisher: session.organization?.domain
        };
      }
      fetchArticles(params);

      if (router?.query?.f === 'search') {
        router.push('/app/repository/search');
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

  const articleLabel = form?.headline || form?.headlineNative || `Article ${articleId ? `#${articleId.slice(0, 6)}` : ''}`;

  return (
    <>
      <Head>
        <title>{`${articleLabel} | Facteur`}</title>
      </Head>
      <Wrapper>
        <ArticleChrome crumbs={[{ label: 'Articles', href: '/app/data/articles' }]} current={articleLabel} />
        <ArticleTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
        <ArticleStatus
          state="In review"
          version="V1"
          actions={
            <Button theme="ATTENTION" onClick={e => handleDeleteArticle(e)}>
              Delete <Trash size={18} />
            </Button>
          }
        />

        {activeTab === 'overview' && articleType && step === 0 && (
          <ArticleForm
            onBack={() => (session.role === ROLES.SUPER_ADMIN ? router.push('/app/repository/search') : router.push('/app/data/articles'))}
            form={form}
            ogForm={ogForm}
            setForm={setForm}
            type={articleType}
            onContinue={() => setStep(1)}
          />
        )}
        {activeTab === 'overview' && articleType && step === 1 && (
          <ArticleForm preview={true} onBack={() => setStep(0)} form={form} setForm={setForm} type={articleType} onPublish={handleSubmit} />
        )}

        {activeTab !== 'overview' && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--gray-500)' }}>
            <p style={{ fontFamily: 'var(--display)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Coming soon</p>
          </div>
        )}
      </Wrapper>
    </>
  );
}
