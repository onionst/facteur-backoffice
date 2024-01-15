import { Popover } from 'antd';
import { FormEvent, useState } from 'react';
import { Search, X } from 'react-feather';
import { Uploader } from '../Uploader/Uploader';
import s from './EE24Search.module.scss';
import Button from '@/bases/Button/Button';
import Row from '@/bases/Row/Row';
export type EE24SearchProps = {
  onSearch: (filter: string) => void;
};

export default function EE24Search(props: EE24SearchProps) {
  const [filter, setFilter] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const handleSearch = (e: FormEvent) => {
    try {
      e.preventDefault();
      props.onSearch(filter);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSearch} className={s['ds-ee24-search']}>
      <Popover
        placement="bottomRight"
        trigger={[]}
        open={uploadedUrl != ''}
        content={
          <form className={s['ds-ee24-search__popover']} key={uploadedUrl}>
            <button type="button" className={s['ds-ee24-search__popover-x']} onClick={() => setUploadedUrl('')}>
              <X color="#4b5675" size={18} />
            </button>
            <div className={s['ds-ee24-search__popover-portrait']}>
              <img src={uploadedUrl} />
            </div>
            <div className={s['ds-ee24-search__popover-form']}>
              <Button theme="CTA">
                Search <Search />
              </Button>
            </div>
          </form>
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
                'image/png': ['.png', '.jpeg', '.jpg', '.webp'],
                'video/mp4': ['.mp4', '.avi', '.mov', '.wav']
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
