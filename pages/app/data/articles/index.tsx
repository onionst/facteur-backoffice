import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { Download, Edit, File, X } from 'react-feather';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';
import { ARTICLES_LIMIT_PER_PAGE, useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';

export default function Articles() {
  const [filter, setFilter] = useState<any>({});
  const modals = useModal();
  const { session } = useAuth();
  const { showDeleteArticle } = modals.articles;
  const { articles, fetchArticles, page, ...articlesProps } = useArticles();
  return (
    <>
      <Header icon={<File />} title="Articles">
        <Link href="/app/data/articles/new">
          <Button theme="CTA">Create article</Button>
        </Link>
      </Header>
      <Wrapper>
        <Page>
          <Search
            placeholder="Search articles..."
            onSearch={search => {
              if (search) {
                setFilter({
                  publisher: session.organization?.domain,
                  search
                });
                fetchArticles({
                  publisher: session.organization?.domain,
                  search
                });
              } else {
                setFilter({
                  publisher: session.organization?.domain
                });
                fetchArticles({
                  publisher: session.organization?.domain
                });
              }
            }}
          />
        </Page>
        <Page>
          <Table
            loading={articlesProps.loading}
            columns={[
              'Headline',
              'URL',
              'Date modified',
              <Row align="RIGHT" key={'column_actions'}>
                Actions
              </Row>
            ]}
            data={articles.map(article => [
              article?.headlineNative,
              <Link href={article?.url} key={article?.externalId + 'link'}>
                {article?.url}
              </Link>,
              dayjs(article?.dateModified).format('DD/MM/YYYY'),
              <Row align="RIGHT" key={article?.externalId + 'actions'}>
                <IconButton
                  onClick={() => {
                    // showEditUser(user?.id);
                  }}
                >
                  <Edit color="#252f4a" size={18} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    showDeleteArticle(article?.externalId);
                  }}
                >
                  <X color="#252f4a" size={18} />
                </IconButton>
              </Row>
            ])}
          />
        </Page>
        <Row align="SPACE">
          <Row align="LEFT">
            <IconButton>
              <Download color="#252f4a" size={16} />
            </IconButton>
            <span>
              Showing {articles.length} of {page.records} articles
            </span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              limit={ARTICLES_LIMIT_PER_PAGE}
              currentPage={page.current + 1}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchArticles(filter, page.current);
              }}
              nextPage={() => {
                fetchArticles(filter, page.current + 1 + 1);
              }}
              skip={skip => fetchArticles(filter, skip)}
            />
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
