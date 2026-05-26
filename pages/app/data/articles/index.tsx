import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Download, Edit, Trash } from 'react-feather';
import Badge from '@/bases/Badge/Badge';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import { Sorter } from '@/bases/Sorter/Sorter';
import { ArticleType } from '@/components/Form/SelectArticleType/SelectArticleType';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import ArticleSearch from '@/components/Search/ArticlesSearch';
import { RepositoryHeadline, NotFound } from '@/components/Table/RepositoryTable';
import { Table } from '@/components/Table/Table';
import Toolbar from '@/components/Toolbar/Toolbar';
import Wrapper from '@/components/Wrapper/Wrapper';
import { ARTICLES_LIMIT_PER_PAGE, useArticles } from '@/contexts/articles.context';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { plainShowing } from '@/utils/plainShowing';
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
      <Header
        title="Your articles"
        breadcrumb={[{ label: 'Data' }, { label: 'Articles' }]}
        subtitle="All articles owned by your organisation, regardless of state. Use the search to narrow down."
      >
        <Link href="/app/data/articles/new">
          <Button theme="CTA">Create article</Button>
        </Link>
      </Header>
      <Wrapper>
        <Toolbar>
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
        </Toolbar>
        <Page>
          <Table
            firstExtended
            clickable
            loading={articlesProps.loading}
            columns={[
              'Title of the article/report',
              'Type of publication',
              'Imported',
              'Revised',
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
            onRowClick={(i: any) => {
              window.open(articles[i].url, '_blank');
            }}
            notFound={<NotFound withoutButton value="" onClick={() => setFilter({})} type="TEXT" />}
            data={articles.map(article => [
              <RepositoryHeadline key={article?.externalId} image={article?.image} headline={article?.headlineNative} />,
              <Badge tone="ink" key={article?.url + 'type'}>
                {article?.type === ArticleType.Factcheck ? 'Fact-check' : article?.type}
              </Badge>,
              <Badge tone={article.imported ? 'success' : 'neutral'} key={article?.url + 'imported'}>
                {article.imported ? 'Yes' : 'No'}
              </Badge>,
              <Badge tone={article.revised ? 'success' : 'neutral'} key={article?.url + 'revised'}>
                {article.revised ? 'Yes' : 'No'}
              </Badge>,
              dayjs(article?.dateModified).format('DD/MM/YYYY'),
              <Row align="RIGHT" key={article?.externalId + 'actions'}>
                <Link onClick={e => e.stopPropagation()} href={`/app/data/articles/edit?id=${article?.externalId}`}>
                  <IconButton onClick={e => e.stopPropagation()}>
                    <Edit color="#252f4a" size={18} />
                  </IconButton>
                </Link>

                <IconButton
                  onClick={e => {
                    e.stopPropagation();
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
            <span>{plainShowing(page.current, articles.length, page.records, ARTICLES_LIMIT_PER_PAGE, 'articles')}</span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              maxPage={page.maxPage}
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
