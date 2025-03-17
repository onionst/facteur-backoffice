import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Download, Eye, Search as SearchIcon, X } from 'react-feather';
import Column from '@/bases/Column/Column';
import IconButton from '@/bases/IconButton/IconButton';
import Image from '@/bases/Image/Image';
import Row from '@/bases/Row/Row';
import { Sorter } from '@/bases/Sorter/Sorter';
import Video from '@/bases/Video/Video';
import Card from '@/components/Card/Card';
import Grid from '@/components/Grid/Grid';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import RepositoryFilter, { Filter } from '@/components/RepositoryFilter/RepositoryFilter';
import { FileType } from '@/components/RepositorySearch/RepositorySearch';
import RepositorySearch from '@/components/Search/RepositorySearch';
import { RepositoryHeadline, RepositoryTable } from '@/components/Table/RepositoryTable';
import Wrapper from '@/components/Wrapper/Wrapper';
import { FILE_TYPES } from '@/constants/accept';
import { useFiles } from '@/contexts/files.context';
import { useModal } from '@/contexts/modal.context';
import { ARTICLES_LIMIT_PER_PAGE, useRepository } from '@/contexts/repository.context';
import { plainShowing } from '@/utils/plainShowing';
import { safeReturn } from '@/utils/safeReturn';

export default function Repository() {
  const modals = useModal();
  const router = useRouter();
  const [portrait, setPortait] = useState<string>('');
  const [searchType, setSearchType] = useState<FileType>('TEXT');
  const {
    articles,
    page,
    fetchRepositoryArticles,
    fetchRepositoryArticlesByImage,
    fetchRepositoryArticlesByVideo,
    fetchRepositoryArticlesByAudio,
    ...repositoryProps
  } = useRepository();
  const { showDownloadRepositoryArticles: showDownloaRepositoryArticles } = modals.repository;
  const [key, setKey] = useState(Date.now());
  const [filter, setFilter] = useState<Filter & { search: string }>({ order: '-datePublished', search: '' });
  const { fingerPrints, videoUrl } = useFiles();

  useEffect(() => {
    if (router?.query?.c && router?.query?.q && router?.query?.ft && typeof router?.query?.q === 'string') {
      if (router?.query?.c === 'TEXT') {
        setSearchType('TEXT');
        setFilter({ order: '-datePublished', search: router.query.q });
        // @ts-ignore
        setTimeout(() => fetchRepositoryArticles({ order: '-datePublished', search: router.query.q }), 150);
      } else {
        if (router?.query?.ft === 'IMAGE') {
          setPortait(router?.query?.q);
          setSearchType('IMAGE');
          fetchRepositoryArticlesByImage(router?.query?.q);
        } else if (router?.query?.ft === 'VIDEO') {
          setPortait(videoUrl);
          setSearchType('VIDEO');
          fetchRepositoryArticlesByVideo(fingerPrints, videoUrl);
        } else if (router?.query?.ft === 'AUDIO') {
          setPortait(router?.query?.q);
          setSearchType('AUDIO');
          fetchRepositoryArticlesByAudio(router?.query?.q);
        }
        setFilter({ order: '-datePublished', search: '' });
      }
    } else {
      setSearchType('TEXT');
      if (articles?.length === 0 && !repositoryProps.loading) {
        fetchRepositoryArticles({ order: '-datePublished', search: '' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    return () => {
      safeReturn(() => fetchRepositoryArticles({ order: '-datePublished' }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header icon={<SearchIcon />} title="EuroClimateCheck Repository" />
      <Wrapper>
        <Grid size="20-80">
          <div className="p-rel">
            <RepositoryFilter
              key={key}
              reset={() => {
                setFilter(prev => ({
                  order: prev.order,
                  search: prev?.search
                }));
                setSearchType('TEXT');
                setTimeout(() => {
                  // @ts-ignore
                  fetchRepositoryArticles({ search: filter?.search, order: filter?.search ? '' : filter?.order });
                  setKey(Date.now());
                }, 150);
              }}
              filter={filter}
              onSubmit={() => {
                setTimeout(() => {
                  fetchRepositoryArticles(filter);
                  setSearchType('TEXT');
                }, 150);
              }}
              onChange={(data: Filter) => {
                setFilter(prev => ({
                  ...data,
                  order: prev.order,
                  search: prev.search
                }));
              }}
            />
          </div>
          <Column align="LEFT">
            <Page>
              <RepositorySearch
                withUploader
                accept={{
                  'image/png': FILE_TYPES.images,
                  'video/mp4': FILE_TYPES.videos
                }}
                onUpload={(url, type) => {
                  switch (type) {
                    case 'IMAGE':
                      fetchRepositoryArticlesByImage(url);
                      setPortait(url);

                      break;
                    case 'VIDEO':
                      fetchRepositoryArticlesByVideo(fingerPrints, videoUrl);
                      setPortait(url);

                      break;
                    case 'AUDIO':
                      fetchRepositoryArticlesByAudio(url);
                      setPortait(url);

                      break;
                  }
                  setSearchType(type);
                }}
                onChange={search => {
                  if (search) {
                    setFilter((prev: any) => ({ ...prev, search, order: '' }));
                  } else {
                    setFilter(prev => ({ ...prev, search, order: '-datePublished' }));
                  }
                }}
                defaultValue={filter.search}
                placeholder="Search articles..."
                onSearch={search => {
                  if (search) {
                    setFilter((prev: any) => ({ ...prev, search, order: '' }));
                  } else {
                    setFilter(prev => ({ ...prev, search, order: '-datePublished' }));
                  }

                  setTimeout(() => {
                    fetchRepositoryArticles(filter);
                    setSearchType('TEXT');
                  }, 150);
                }}
              />
            </Page>

            <Page>
              {searchType === 'IMAGE' && (
                <Card style={{ padding: '14px 20px' }}>
                  <Row align="SPACE">
                    <Row align="LEFT">
                      <span>Searching by the following image</span>
                      <Image alt="Search" src={portrait} style={{ height: 42, maxHeight: 42, maxWidth: 100 }} />
                    </Row>
                    <Row align="RIGHT">
                      <span
                        className="c-pointer"
                        onClick={() => {
                          setFilter(prev => ({
                            order: '-datePublished',
                            search: prev?.search
                          }));
                          setTimeout(() => {
                            fetchRepositoryArticles({ search: filter.search });
                            setSearchType('TEXT');
                            setKey(Date.now());
                          }, 150);
                        }}
                      >
                        Clear filter <X size={18} />
                      </span>
                    </Row>
                  </Row>
                </Card>
              )}
              {searchType === 'VIDEO' && (
                <Card style={{ padding: '14px 20px' }}>
                  <Row align="SPACE">
                    <Row align="LEFT">
                      <span>Searching by the following video</span>
                      <Video src={portrait} style={{ height: 42, maxHeight: 42, maxWidth: 100 }} />
                    </Row>
                    <Row align="RIGHT">
                      <span
                        className="c-pointer"
                        onClick={() => {
                          setFilter(prev => ({
                            order: '-datePublished',
                            search: prev?.search
                          }));
                          setTimeout(() => {
                            fetchRepositoryArticles({ search: filter.search });
                            setSearchType('TEXT');
                            setKey(Date.now());
                          }, 150);
                        }}
                      >
                        Clear filter <X size={18} />
                      </span>
                    </Row>
                  </Row>
                </Card>
              )}
              {searchType === 'AUDIO' && (
                <Card style={{ padding: '14px 20px' }}>
                  <Row align="SPACE">
                    <Row align="LEFT">
                      <span>Searching by the following audio</span>
                      <audio controls src={portrait} />
                    </Row>
                    <Row align="RIGHT">
                      <span
                        className="c-pointer"
                        onClick={() => {
                          setFilter(prev => ({
                            order: '-datePublished',
                            search: prev?.search
                          }));
                          setTimeout(() => {
                            fetchRepositoryArticles({ search: filter.search });
                            setSearchType('TEXT');
                            setKey(Date.now());
                          }, 150);
                        }}
                      >
                        Clear filter <X size={18} />
                      </span>
                    </Row>
                  </Row>
                </Card>
              )}
              <RepositoryTable
                notFound={repositoryProps.notFound}
                onReset={() => {
                  setFilter({
                    order: '-datePublished',
                    search: ''
                  });
                  setTimeout(() => {
                    fetchRepositoryArticles({ order: '-datePublished', search: '' });
                    setSearchType('TEXT');
                    setKey(Date.now());
                  }, 150);
                }}
                firstExtended
                onRowClick={(i: any) => {
                  window.open(articles[i].url, '_blank');
                }}
                loading={repositoryProps.loading}
                columns={[
                  'Title of the article/report',
                  'Name of the organization',
                  'Type of publication',
                  <Row align="RIGHT" key="Date">
                    {searchType === 'TEXT' ? (
                      <Sorter
                        onSort={() => {
                          const order = filter.order ? (filter.order?.includes('-') ? 'datePublished' : '-datePublished') : 'datePublished';
                          setFilter(prev => ({
                            ...prev,
                            order
                          }));
                          setTimeout(() => {
                            fetchRepositoryArticles({ ...filter, order });
                            setSearchType('TEXT');
                          }, 150);
                        }}
                        order={filter.order?.includes('-') ? 'DESC' : 'ASC'}
                      >
                        <span>Date published</span>
                      </Sorter>
                    ) : (
                      'Date published'
                    )}
                  </Row>,
                  <div key="empty" />
                ]}
                data={articles.map(article => [
                  <RepositoryHeadline key={article?.url} image={article?.image} headline={article?.headline} />,
                  article?.publisher,
                  <Badge bg="" className="ds-badge-success" key={article?.url + 'type'}>
                    {article?.type}
                  </Badge>,
                  <Row key={article?.url + 'date'} align="RIGHT">
                    {dayjs(article?.datePublished).format('DD/MM/YYYY')}
                  </Row>,
                  <Row align="RIGHT" key={article?.externalId + 'actions'}>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/app/repository/search/view?id=${article?.externalId}&&f=search`);
                      }}
                    >
                      <Eye size={18} color="#252f4a" />
                    </IconButton>
                  </Row>
                ])}
              />
            </Page>
          </Column>
        </Grid>
        <Row align="SPACE">
          <Row align="LEFT">
            {page.records > 0 && (
              <IconButton type="button" onClick={() => showDownloaRepositoryArticles(filter)}>
                <Download color="#252f4a" size={16} />
              </IconButton>
            )}
            <span>{plainShowing(page.current, articles.length, page.records, 'articles')}</span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              limit={ARTICLES_LIMIT_PER_PAGE}
              currentPage={page.current + 1}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchRepositoryArticles(filter, page.current);
                setSearchType('TEXT');
              }}
              nextPage={() => {
                fetchRepositoryArticles(filter, page.current + 1 + 1);
                setSearchType('TEXT');
              }}
              skip={skip => {
                fetchRepositoryArticles(filter, skip);
                setSearchType('TEXT');
              }}
            />
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
