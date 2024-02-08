import { Popover } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Download, Edit, Eye, MoreHorizontal, Search as SearchIcon, X } from 'react-feather';
import Button from '@/bases/Button/Button';
import Column from '@/bases/Column/Column';
import IconButton from '@/bases/IconButton/IconButton';
import Image from '@/bases/Image/Image';
import Row from '@/bases/Row/Row';
import { Sorter } from '@/bases/Sorter/Sorter';
import Video from '@/bases/Video/Video';
import Card from '@/components/Card/Card';
import EE24Filter, { Filter } from '@/components/EE24Filter/EE24Filter';
import { FileType } from '@/components/EE24Search/EE24Search';
import Grid from '@/components/Grid/Grid';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { EE24Headline, EE24Table } from '@/components/Table/EE24Table';
import Wrapper from '@/components/Wrapper/Wrapper';
import { FILE_TYPES } from '@/constants/accept';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { EE24_ARTICLES_LIMIT_PER_PAGE, useEE24 } from '@/contexts/ee24.context';
import { useModal } from '@/contexts/modal.context';
import { plainShowing } from '@/utils/plainShowing';
import { safeReturn } from '@/utils/safeReturn';

export default function Repository() {
  const modals = useModal();
  const router = useRouter();
  const { session } = useAuth();
  const [portrait, setPortait] = useState<string>('');
  const [searchType, setSearchType] = useState<FileType>('TEXT');
  const { articles, page, fetchEE24Articles, fetchEE24ArticlesByImage, fetchEE24ArticlesByVideo, fetchEE24ArticlesByAudio, ...ee24Props } =
    useEE24();
  const { showDownloadEE24Articles } = modals.ee24;
  const [key, setKey] = useState(Date.now());
  const [filter, setFilter] = useState<Filter & { search: string }>({ order: '-datePublished', search: '' });

  useEffect(() => {
    if (router?.query?.c && router?.query?.q && router?.query?.ft && typeof router?.query?.q === 'string') {
      if (router?.query?.c === 'TEXT') {
        setSearchType('TEXT');
        setFilter({ order: '-datePublished', search: router.query.q });
        // @ts-ignore
        setTimeout(() => fetchEE24Articles({ order: '-datePublished', search: router.query.q }), 150);
      } else {
        if (router?.query?.ft === 'IMAGE') {
          setPortait(router?.query?.q);
          setSearchType('IMAGE');
          fetchEE24ArticlesByImage(router?.query?.q);
        } else if (router?.query?.ft === 'VIDEO') {
          setPortait(router?.query?.q);
          setSearchType('VIDEO');
          fetchEE24ArticlesByVideo(router?.query?.q);
        } else if (router?.query?.ft === 'AUDIO') {
          setPortait(router?.query?.q);
          setSearchType('AUDIO');
          fetchEE24ArticlesByAudio(router?.query?.q);
        }
        setFilter({ order: '-datePublished', search: '' });
      }
    } else {
      setSearchType('TEXT');
      if (articles?.length === 0 && !ee24Props.loading) {
        fetchEE24Articles({ order: '-datePublished', search: '' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    return () => {
      safeReturn(() => fetchEE24Articles({ order: '-datePublished' }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header icon={<SearchIcon />} title="EE24 Repository" />
      <Wrapper>
        <Grid size="20-80">
          <div className="p-rel">
            <EE24Filter
              key={key}
              reset={() => {
                setFilter(prev => ({
                  order: prev.order,
                  search: prev?.search
                }));
                setSearchType('TEXT');
                setTimeout(() => {
                  // @ts-ignore
                  fetchEE24Articles({ search: filter?.search, order: filter?.search ? '' : filter?.order });
                  setKey(Date.now());
                }, 150);
              }}
              filter={filter}
              onSubmit={() => {
                setTimeout(() => {
                  fetchEE24Articles(filter);
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
              <Search
                withUploader
                accept={{
                  'image/png': FILE_TYPES.images,
                  'video/mp4': FILE_TYPES.videos
                }}
                onUpload={(url, type) => {
                  switch (type) {
                    case 'IMAGE':
                      fetchEE24ArticlesByImage(url);
                      setPortait(url);

                      break;
                    case 'VIDEO':
                      fetchEE24ArticlesByVideo(url);
                      setPortait(url);

                      break;
                    case 'AUDIO':
                      fetchEE24ArticlesByAudio(url);
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
                    fetchEE24Articles(filter);
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
                            fetchEE24Articles({ search: filter.search });
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
                            fetchEE24Articles({ search: filter.search });
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
                            fetchEE24Articles({ search: filter.search });
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
              <EE24Table
                notFound={ee24Props.notFound}
                onReset={() => {
                  setFilter(prev => ({
                    order: '-datePublished',
                    search: prev?.search
                  }));
                  setTimeout(() => {
                    fetchEE24Articles({ search: filter.search });
                    setSearchType('TEXT');
                    setKey(Date.now());
                  }, 150);
                }}
                firstExtended
                onRowClick={(i: any) => {
                  window.open(articles[i].url, '_blank');
                }}
                loading={ee24Props.loading}
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
                            fetchEE24Articles({ ...filter, order });
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
                  <EE24Headline key={article?.url} image={article?.image} headline={article?.headline} />,
                  article?.publisher,
                  <Badge bg="" className="ds-badge-success" key={article?.url + 'type'}>
                    {article?.type}
                  </Badge>,
                  <Row key={article?.url + 'date'} align="RIGHT">
                    {dayjs(article?.datePublished).format('DD/MM/YYYY')}
                  </Row>,
                  <Row align="RIGHT" key={article?.externalId + 'actions'}>
                    {session.role === ROLES.RESEARCHER ||
                    (session.role != ROLES.SUPER_ADMIN && session.organization?.domain != article.publisher) ? (
                      <IconButton
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/app/ee24/search/view?id=${article?.externalId}&&f=search`);
                        }}
                      >
                        <Eye size={18} color="#252f4a" />
                      </IconButton>
                    ) : (
                      <Popover
                        trigger="click"
                        placement="bottomRight"
                        content={
                          <div className="w-full">
                            <Link
                              onClick={e => e?.stopPropagation()}
                              href={`/app/ee24/search/view?id=${article?.externalId}&&f=search`}
                              target="_blank"
                            >
                              <Button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                }}
                                style={{ width: '100%', marginBottom: 4 }}
                                theme="TERTIARY"
                              >
                                View <Eye size={18} />
                              </Button>
                            </Link>
                            <Link
                              onClick={e => e?.stopPropagation()}
                              href={`/app/data/articles/edit?id=${article?.externalId}&&f=search`}
                              target="_blank"
                            >
                              <Button
                                onClick={e => {
                                  e.stopPropagation();
                                }}
                                type="button"
                                style={{ width: '100%' }}
                                theme="TERTIARY"
                              >
                                Edit <Edit size={18} />
                              </Button>
                            </Link>
                          </div>
                        }
                      >
                        <IconButton onClick={e => e.stopPropagation()}>
                          <MoreHorizontal size={18} color="#252f4a" />
                        </IconButton>
                      </Popover>
                    )}
                  </Row>
                ])}
              />
            </Page>
          </Column>
        </Grid>
        <Row align="SPACE">
          <Row align="LEFT">
            {page.records > 0 && (
              <IconButton type="button" onClick={() => showDownloadEE24Articles(filter)}>
                <Download color="#252f4a" size={16} />
              </IconButton>
            )}
            <span>{plainShowing(page.current, articles.length, page.records, 'articles')}</span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              limit={EE24_ARTICLES_LIMIT_PER_PAGE}
              currentPage={page.current + 1}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchEE24Articles(filter, page.current);
                setSearchType('TEXT');
              }}
              nextPage={() => {
                fetchEE24Articles(filter, page.current + 1 + 1);
                setSearchType('TEXT');
              }}
              skip={skip => {
                fetchEE24Articles(filter, skip);
                setSearchType('TEXT');
              }}
            />
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
