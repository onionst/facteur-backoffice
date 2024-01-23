import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Edit, File } from 'react-feather';
import Button from '@/bases/Button/Button';
import Row from '@/bases/Row/Row';
import ArticleViewForm from '@/components/Form/ArticleViews/ArticleViewForm';
import DebunkArticleViewForm from '@/components/Form/ArticleViews/DebunkArticleViewForm';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import useWindowSize from '@/hooks/useWindowWidth';

export default function View() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();
  const { fetchArticleData, fetchArticleById } = useArticles();
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
          if (router?.query?.f === 'search') {
            router.push('/app/ee24/search');
          } else {
            router.push('/app/data/articles');
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
        title="Article"
      >
        <Button theme="SECONDARY">
          Edit <Edit />
        </Button>
      </Header>
      <Wrapper>
        <Row align="SPACE" style={{ alignItems: 'flex-start' }}>
          {width >= 768 && <div style={{ width: '25%' }}></div>}

          {articleType ? (
            [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType) ? (
              <DebunkArticleViewForm form={form} type={articleType} />
            ) : (
              <ArticleViewForm form={form} type={articleType} />
            )
          ) : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
