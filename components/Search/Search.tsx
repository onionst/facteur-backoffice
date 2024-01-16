import { Popover } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import { Search as SearchIcon, X } from 'react-feather';
import { Uploader } from '../Uploader/Uploader';
import s from './Search.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import { FILE_TYPES } from '@/constants/accept';

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
  const [portrait, setPortait] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(props.defaultValue || '');
  const [selector, setSelector] = useState<any>('');

  useEffect(() => {
    setSearch('');
  }, []);

  const handleUpdatePortrait = (url: string) => {
    if (!url) {
      setPortait('');
    }
    let portraitType = 'NONE';
    FILE_TYPES.images.forEach(ext => {
      if (url.includes(ext)) {
        portraitType = 'IMAGE';
      }
    });
    FILE_TYPES.audio.forEach(ext => {
      if (url.includes(ext)) {
        portraitType = 'AUDIO';
      }
    });
    FILE_TYPES.videos.forEach(ext => {
      if (url.includes(ext)) {
        portraitType = 'VIDEO';
      }
    });
    const portrait = {
      NONE: '',
      IMAGE: url,
      AUDIO: '/assets/portraits/audio.svg',
      VIDEO: '/assets/portraits/video.svg'
    }[portraitType];

    console.log(portrait);

    setPortait(portrait || '');
  };

  useEffect(() => {
    handleUpdatePortrait(uploadedUrl);
  }, [uploadedUrl]);

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
      <Popover
        placement="bottomRight"
        trigger={[]}
        open={uploadedUrl != ''}
        content={
          <div className={s['ds-ee24-search__popover']} key={uploadedUrl}>
            <button type="button" className={s['ds-ee24-search__popover-x']} onClick={() => setUploadedUrl('')}>
              <X color="#4b5675" size={18} />
            </button>
            <div className={s['ds-ee24-search__popover-portrait']}>
              <img alt="portrait" src={portrait} />
            </div>
            <div className={s['ds-ee24-search__popover-form']}>
              <Button
                theme="CTA"
                type="button"
                onClick={() => {
                  props.onUpload && props.onUpload(uploadedUrl);
                }}
              >
                Search <SearchIcon />
              </Button>
            </div>
          </div>
        }
      >
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
                  onChange={setUploadedUrl}
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
      </Popover>
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
