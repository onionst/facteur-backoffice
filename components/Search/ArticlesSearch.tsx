import { Popover, Tag } from 'antd';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import { Search as SearchIcon } from 'react-feather';
import ArticlesFilter, { Filter } from '../EE24Filter/ArticlesFilter';
import { FileType } from '../EE24Search/EE24Search';
import s from './Search.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';

export type SearchProps = {
  placeholder: string;
  defaultValue?: string;
  onUpload?: (url: string, fileType: FileType) => void;
  onSearch: (filter: Filter, selector?: string) => void;
  accept?: Accept;
  withFilter?: boolean;
  withSelector?: Array<{ label: string; value: string }>;
};

export default function ArticleSearch(props: SearchProps) {
  const [filter, setFilter] = useState<any>({});
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [submittedFilter, setSubmittedFilter] = useState<any>({});
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    if (typeof props.defaultValue === 'string') {
      setFilter({ search: props.defaultValue });
    }
  }, [props.defaultValue]);

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    props.onSearch(filter);
    setSubmittedFilter(filter);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className={`${s['ds-search']} ${s['ds-search-articles']}`}>
        <div className={s['ds-search__left']}>
          <Popover
            placement="bottomLeft"
            open={showFilter}
            content={
              <ArticlesFilter
                key={key}
                filter={filter}
                reset={() => {
                  setFilter({});
                  props.onSearch({});
                  setSubmittedFilter({});
                  setKey(Date.now());
                  setShowFilter(false);
                }}
                onSubmit={() => {
                  handleSearch();
                  setShowFilter(false);
                }}
                onChange={data => setFilter((prev: any) => ({ ...prev, ...data }))}
              />
            }
          >
            <div style={{ maxWidth: 'max-content' }}>
              <Button onClick={() => setShowFilter(prev => !prev)} type="button" theme="TERTIARY">
                Filter
              </Button>
            </div>
          </Popover>
          <Input
            defaultValue={props?.defaultValue}
            placeholder={props.placeholder}
            value={filter?.search || ''}
            onChange={v => setFilter((prev: any) => ({ ...prev, search: v.target.value }))}
          />
        </div>

        <div className={s['ds-search__right']}>
          <Row align="RIGHT">
            <Button theme="SECONDARY" type="submit">
              Search
              <SearchIcon size={14} />
            </Button>
          </Row>
        </div>
      </form>
      {((submittedFilter?.sinceDate && submittedFilter?.untilDate) || (submittedFilter?.type && submittedFilter?.type?.length > 0)) && (
        <div className="w-full mt-5">
          {submittedFilter?.sinceDate && submittedFilter?.untilDate && (
            <Tag>{`From ${dayjs(submittedFilter?.sinceDate).format('DD/MM/YYYY')} to ${dayjs(submittedFilter?.untilDate).format(
              'DD/MM/YYYY'
            )}`}</Tag>
          )}
          {submittedFilter?.type &&
            submittedFilter?.type?.length > 0 &&
            submittedFilter?.type?.map((type: any) => <Tag key={type}>{type}</Tag>)}
        </div>
      )}
    </div>
  );
}
