import { useRouter } from 'next/router';
import { useState } from 'react';
import { File } from 'react-feather';
import Row from '@/bases/Row/Row';
import ArticleDraftForm from '@/components/Form/ArticleDrafts/ArticleDraftForm';
import DebunkArticleDraftForm from '@/components/Form/ArticleDrafts/DebunkArticleDraftForm';
import SelectArticleType, { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Stepper from '@/components/Stepper/Stepper';
import Wrapper from '@/components/Wrapper/Wrapper';
import useWindowSize from '@/hooks/useWindowWidth';

export default function New() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [articleType, setArticleType] = useState<null | ArticleType>(null);
  const { width } = useWindowSize();
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
                setStep(1);
              }}
            />
          )}
          {step === 1 ? (
            articleType ? (
              [ArticleType.Factcheck, ArticleType.Debunk].includes(articleType) ? (
                <DebunkArticleDraftForm type={articleType} onContinue={() => setStep(2)} />
              ) : (
                <ArticleDraftForm type={articleType} onContinue={() => setStep(2)} />
              )
            ) : null
          ) : null}
          {width >= 768 && <div style={{ width: '25%' }}></div>}
        </Row>
      </Wrapper>
    </>
  );
}
