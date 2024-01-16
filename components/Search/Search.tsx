import { FormEvent, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import { Search as SearchIcon } from 'react-feather';
import { Uploader } from '../Uploader/Uploader';
import s from './Search.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';

export type SearchProps = {
  placeholder: string;
  defaultValue?: string;
  onUpload?: (url: string) => void;
  onSearch: (search: string, selector?: string) => void;
  accept?: Accept;
  withUploader?: boolean;
  withSelector?: Array<{ label: string; value: string }>;
};

export default function Search(props: SearchProps) {
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(props.defaultValue || '');
  const [selector, setSelector] = useState<any>('');

  useEffect(() => {
    setSearch('');
  }, []);

  useEffect(() => {
    if (typeof props.defaultValue === 'string') {
      setSearch(props.defaultValue);
    }
  }, [props.defaultValue]);

  const handleSearch = (e: FormEvent) => {
    e?.preventDefault();
    props.onSearch(search, selector);
  };

  return (
    <form onSubmit={handleSearch} className={s['ds-search']}>
      <div className={s['ds-search__left']}>
        {/* <span>Filter</span> */}
        <Input
          defaultValue={props?.defaultValue}
          placeholder={props.placeholder}
          value={search}
          withIcon={
            props.withUploader ? (
              <Uploader
                accept={props.accept || {}}
                onChange={url => props.onUpload && props.onUpload(url)}
                onLoad={() => setUploadingImage(true)}
                onLoadFinished={() => setUploadingImage(false)}
              />
            ) : null
          }
          disabled={uploadingImage}
          onChange={v => setSearch(v.target.value)}
        />
        {props.withSelector && (
          <Select
            options={props.withSelector}
            onChange={v => {
              setSelector(v);
              props.onSearch(search, v);
            }}
          />
        )}
      </div>
      <div className={s['ds-search__right']}>
        <Row align="RIGHT">
          <Button theme="SECONDARY" type="submit">
            <SearchIcon size={14} />
            Search
          </Button>
        </Row>
      </div>
    </form>
  );
}
