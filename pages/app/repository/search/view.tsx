import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Edit, File, Trash } from 'react-feather';
import Button from '@/bases/Button/Button';
import Row from '@/bases/Row/Row';
import ArticleView from '@/components/Form/ArticleViews/ArticleView';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Wrapper from '@/components/Wrapper/Wrapper';
import { ROLES } from '@/constants/roles.constants';
import { useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import { useHistory } from '@/contexts/history.context';
import { useModal } from '@/contexts/modal.context';
import useWindowSize from '@/hooks/useWindowWidth';

export default function View() {
  const { canGoBack } = useHistory();
  const router = useRouter();
  const modals = useModal();
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();
  const [articleId, setArticleId] = useState<string>('');
  const { fetchArticleData, fetchArticleById } = useArticles();
  const [step, setStep] = useState<number>(0);
  const [articleType, setArticleType] = useState<null | ArticleType>(null);
  const { width } = useWindowSize();
  const { showDeleteArticle } = modals.articles;

  const [form, setForm] = useState({
    externalId: '',
    type: '',
    url: '',
    headline: '',
    publisher: '',
    headlineNative: '',
    datePublished: null,
    image: '',
    keywords: [],
    inLanguage: session.organization?.language || '',
    topic: '',
    subtopics: [],
    countryOfOrigin: session.organization?.country || '',
    contentLocation: [],
    claimReviewed: '',
    claimReviewedNative: '',
    reviewRating: '',
    appearances: [],
    author: '',
    associatedClaimReview: []
  });

  const handleDeleteArticle = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    showDeleteArticle(articleId, router?.query?.f === 'search' ? '/app/repository/search' : '/app/data/articles');
  };

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
      // @ts-ignore
      setArticleId(router?.query?.id);
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
        backable={canGoBack()}
        icon={<File />}
        title="Article"
      >
        {(session.role === ROLES.SUPER_ADMIN || session.organization?.domain === form?.publisher) && (
          <Row align="RIGHT">
            <Button
              theme="TERTIARY"
              onClick={() => {
                router.push(`/app/data/articles/edit?id=${articleId}&&f=search`);
              }}
            >
              Edit <Edit color="#252f4a" size={16} />
            </Button>
            <Button theme="ATTENTION" onClick={e => handleDeleteArticle(e)}>
              Delete <Trash color="#fff" size={16} />
            </Button>
          </Row>
        )}
      </Header>
      <Wrapper>
        <Row align="SPACE" style={{ alignItems: 'flex-start' }}>
          {width >= 768 && <div style={{ width: '25%' }}></div>}

          {articleType ? <ArticleView form={form} type={articleType} /> : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
