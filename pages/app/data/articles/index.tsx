import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Download, Edit, File, Trash } from 'react-feather';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import { Sorter } from '@/bases/Sorter/Sorter';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import ArticleSearch from '@/components/Search/ArticlesSearch';
import { EE24Headline } from '@/components/Table/EE24Table';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';
import { ARTICLES_LIMIT_PER_PAGE, useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { safeReturn } from '@/utils/safeReturn';

export default function Articles() {
  const { session } = useAuth();
  const [filter, setFilter] = useState<any>({ order: '-dateModified' });
  const modals = useModal();

  const { showDeleteArticle, showDownloadArticles } = modals.articles;
  const { articles, fetchArticles, page, ...articlesProps } = useArticles();

  useEffect(() => {
    return () => {
      safeReturn(() => fetchArticles({ order: '-dateModified' }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header icon={<File />} title="Your articles">
        <Link href="/app/data/articles/new">
          <Button theme="CTA">Create article</Button>
        </Link>
      </Header>
      <Wrapper>
        <Page>
          <ArticleSearch
            withFilter
            placeholder="Search articles..."
            onSearch={search => {
              setFilter((prev: any) => ({
                order: prev.order,
                publisher: session.organization?.domain,
                ...search
              }));
              fetchArticles({
                publisher: session.organization?.domain,
                ...search
              });
            }}
          />
        </Page>
        <Page>
          <Table
            firstExtended
            loading={articlesProps.loading}
            columns={[
              'Title of the article/report',
              'URL of the article/report',
              'Type of publication',
              <Sorter
                key="Sorter"
                onSort={() => {
                  const order = filter.order?.includes('-') ? 'dateModified' : '-dateModified';
                  setFilter((prev: any) => ({
                    ...prev,
                    publisher: session.organization?.domain,
                    order
                  }));
                  setTimeout(() => {
                    fetchArticles({ ...filter, order });
                  }, 50);
                }}
                order={filter.order?.includes('-') ? 'DESC' : 'ASC'}
              >
                <span>Date modified</span>
              </Sorter>,
              <Row align="RIGHT" key={'column_actions'}>
                Actions
              </Row>
            ]}
            data={articles.map(article => [
              <EE24Headline key={article?.externalId} image={article?.image} headline={article?.headlineNative} />,
              <Link target="_blank" href={article?.url || ''} key={article?.externalId + 'link'} className="c-link">
                {article?.url}
              </Link>,
              <Badge bg="" className="ds-badge-success" key={article?.url + 'type'}>
                {article?.type}
              </Badge>,
              dayjs(article?.dateModified).format('DD/MM/YYYY'),
              <Row align="RIGHT" key={article?.externalId + 'actions'}>
                <Link href={`/app/data/articles/edit?id=${article?.externalId}`}>
                  <IconButton>
                    <Edit color="#252f4a" size={18} />
                  </IconButton>
                </Link>

                <IconButton
                  onClick={() => {
                    showDeleteArticle(article?.externalId);
                  }}
                >
                  <Trash color="#252f4a" size={18} />
                </IconButton>
              </Row>
            ])}
          />
        </Page>
        <Row align="SPACE">
          <Row align="LEFT">
            {page.records > 0 && (
              <IconButton type="button" onClick={() => showDownloadArticles(filter)}>
                <Download color="#252f4a" size={16} />
              </IconButton>
            )}
            <span>
              Showing {(page.current >= 1 ? 20 : articles.length) * page.current + articles.length} of {page.records} articles
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
