import { Popover } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
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
  const [portrait, setPortait] = useState('');
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
  const handleUpdatePortrait = (urlUploaded: string) => {
    if (!urlUploaded) {
      setPortait('');
    } else {
      const url = urlUploaded?.toLowerCase();
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
      // eslint-disable-next-line no-shadow
      const portrait = {
        NONE: '',
        IMAGE: url,
        AUDIO: '/assets/portraits/audio.svg',
        VIDEO: '/assets/portraits/video.svg'
      }[portraitType];

      setPortait(portrait || '');
    }
  };

  useEffect(() => {
    handleUpdatePortrait(uploadedUrl);
  }, [uploadedUrl]);

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="portrait" src={portrait} />
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
                Search <Search size={18} />
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
                'image/png': FILE_TYPES.images,
                'video/mp4': FILE_TYPES.videos,
                'audio/mp3': FILE_TYPES.audio
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
