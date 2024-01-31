import { useRouter } from 'next/router';
import ModalHeader from '../ModalHeader/ModalHeader';
import Page from '../Page/Page';
import Button from '@/bases/Button/Button';
import Row from '@/bases/Row/Row';

export default function ArticlePublished() {
  const router = useRouter();
  return (
    <Page>
      <ModalHeader subTitle="Article published" style={{ margin: 0 }} title="Your article has been successfully published" />
      <Row align="LEFT">
        <Button theme="SECONDARY" onClick={() => router.push('/app/data/articles')}>
          Go back
        </Button>
        <Button theme="CTA" onClick={() => router.reload()}>
          Create another article
        </Button>
      </Row>
    </Page>
  );
}
