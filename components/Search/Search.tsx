import { Popover } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import { Search as SearchIcon, X } from 'react-feather';
import { FileType } from '../EE24Search/EE24Search';
import { Uploader } from '../Uploader/Uploader';
import s from './Search.module.scss';
import Button from '@/bases/Button/Button';
import Image from '@/bases/Image/Image';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Video from '@/bases/Video/Video';
import { FILE_TYPES } from '@/constants/accept';
import { ROLES } from '@/constants/roles.constants';
import { parseRole } from '@/modals/users/InviteUsers.modal';

export type SearchProps = {
  placeholder: string;
  defaultValue?: string;
  onUpload?: (url: string, fileType: FileType) => void;
  onSearch: (search: string, selector?: string, role?: string) => void;
  accept?: Accept;
  onChange?: (v: string) => void;
  withUploader?: boolean;
  withFilter?: boolean;
  withSelector?: Array<{ label: string; value: string }>;
  withRoles?: boolean;
};

export default function Search(props: SearchProps) {
  const [portrait, setPortait] = useState('');
  const [fileType, setFileType] = useState<FileType>('NONE');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(props.defaultValue || '');
  const [selector, setSelector] = useState<any>('');
  const [role, setRole] = useState<any>('');

  useEffect(() => {
    setSearch('');
  }, []);

  const handleUpdatePortrait = (urlUploaded: string) => {
    if (!urlUploaded) {
      setPortait('');
      setFileType('NONE');
    } else {
      const url = urlUploaded?.toLowerCase();
      let portraitType: FileType = 'NONE';
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
      // eslint-disable-next-line no-shadow
      const portrait = {
        NONE: '',
        IMAGE: url,
        AUDIO: '/assets/portraits/audio.svg',
        VIDEO: url
      }[portraitType];

      setPortait(portrait || '');
      setFileType(portraitType);
    }
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
    props.onSearch(search, selector, role);
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
              {fileType === 'IMAGE' && <Image key={portrait + 'image'} alt="portrait" src={portrait} />}
              {fileType === 'VIDEO' && <Video key={portrait + 'video'} src={portrait} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {fileType === 'AUDIO' && <img key={portrait + 'audio'} alt="audio" src="/assets/portraits/audio.svg" />}
            </div>
            <div className={s['ds-ee24-search__popover-form']}>
              <Button
                theme="CTA"
                type="button"
                onClick={() => {
                  props.onUpload && props.onUpload(uploadedUrl, fileType);
                  setUploadedUrl('');
                  setPortait('');
                  setFileType('NONE');
                }}
              >
                Search <SearchIcon size={18} />
              </Button>
            </div>
          </div>
        }
      >
        <div className={s['ds-search__left']}>
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
            onChange={v => {
              setSearch(v.target.value);
              props.onChange && props.onChange(v.target.value);
            }}
          />
          {props.withSelector && (
            <Select
              options={props.withSelector}
              onChange={v => {
                setSelector(v);
                props.onSearch(search, v, role);
              }}
            />
          )}
          {props.withRoles && (
            <Select
              onChange={v => {
                setRole(v);
                props.onSearch(search, selector, v);
              }}
              options={[
                {
                  label: 'Filter by role',
                  value: ''
                },
                {
                  label: parseRole(ROLES.SUPER_ADMIN),
                  value: ROLES.SUPER_ADMIN
                },
                {
                  label: parseRole(ROLES.ADMIN),
                  value: ROLES.ADMIN
                },
                {
                  label: parseRole(ROLES.RESEARCHER),
                  value: ROLES.RESEARCHER
                },
                {
                  label: parseRole(ROLES.FACT_CHECKER),
                  value: ROLES.FACT_CHECKER
                }
              ]}
            />
          )}
        </div>
      </Popover>
      <div className={s['ds-search__right']}>
        <Row align="RIGHT">
          <Button theme="SECONDARY" type="submit">
            Search
            <SearchIcon size={14} />
          </Button>
        </Row>
      </div>
    </form>
  );
}
