import { Popover } from 'antd';
import { FormEvent, useState } from 'react';
import { Search, X } from 'react-feather';
import { Uploader } from '../Uploader/Uploader';
import s from './EE24Search.module.scss';
import Button from '@/bases/Button/Button';
import Row from '@/bases/Row/Row';
import { FILE_TYPES } from '@/constants/accept';
export type EE24SearchProps = {
  onSearch: (filter: { value: string; type: 'TEXT' | 'URL' }) => void;
};

export default function EE24Search(props: EE24SearchProps) {
  const [filter, setFilter] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const handleSearch = (e: FormEvent) => {
    try {
      e.preventDefault();
      props.onSearch({
        type: 'TEXT',
        value: filter
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSearch} className={s['ds-ee24-search']}>
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
              <img alt="portrait" src={uploadedUrl} />
            </div>
            <div className={s['ds-ee24-search__popover-form']}>
              <Button
                theme="CTA"
                type="button"
                onClick={() => {
                  props.onSearch({
                    type: 'URL',
                    value: uploadedUrl
                  });
                }}
              >
                Search <Search />
              </Button>
            </div>
          </div>
        }
      >
        <Row align="LEFT">
          <div className={s['ds-ee24-search__input']}>
            <input
              value={filter}
              onChange={v => setFilter(v.target.value)}
              type="text"
              disabled={uploadingImage}
              className={s['ds-navbar__left-input']}
              placeholder="Search in the EE24 dataset..."
            />
            <Uploader
              accept={{
                'image/*': FILE_TYPES.images,
                'video/*': FILE_TYPES.videos,
                'audio/*': FILE_TYPES.audio
              }}
              onChange={setUploadedUrl}
              onLoadFinished={() => setUploadingImage(false)}
              onLoad={() => {
                setUploadingImage(true);
              }}
            />
          </div>
        </Row>
      </Popover>
    </form>
  );
}
