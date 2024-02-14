import { Popover } from 'antd';
import { FormEvent, useState } from 'react';
import { Search, X } from 'react-feather';
import { Uploader } from '../Uploader/Uploader';
import s from './EE24Search.module.scss';
import Button from '@/bases/Button/Button';
import Image from '@/bases/Image/Image';
import Row from '@/bases/Row/Row';
import Video from '@/bases/Video/Video';
import { FILE_TYPES } from '@/constants/accept';
import { useFiles } from '@/contexts/files.context';

export type FileType = 'NONE' | 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO';
export type EE24SearchProps = {
  onSearch: (filter: { value: string; type: 'TEXT' | 'URL'; fileType: FileType }) => void;
};

export default function EE24Search(props: EE24SearchProps) {
  const [filter, setFilter] = useState<string>('');
  const [fileType, setFileType] = useState<FileType>('NONE');
  const [portrait, setPortait] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const { videoUrl } = useFiles();

  const handleSearch = (e: FormEvent) => {
    try {
      e.preventDefault();
      props.onSearch({
        type: 'TEXT',
        value: filter,
        fileType: 'TEXT'
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
              {fileType === 'IMAGE' && <Image key={portrait + 'image'} alt="portrait" src={portrait} />}
              {fileType === 'VIDEO' && <Video key={portrait + 'video'} src={portrait} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {fileType === 'AUDIO' && <img key={portrait + 'audio'} alt="audio" src={portrait} />}
            </div>
            <div className={s['ds-ee24-search__popover-form']}>
              <Button
                theme="CTA"
                type="button"
                onClick={() => {
                  if (fileType === 'VIDEO') {
                    props.onSearch({
                      type: 'URL',
                      value: videoUrl,
                      fileType: fileType
                    });
                  } else {
                    props.onSearch({
                      type: 'URL',
                      value: uploadedUrl,
                      fileType: fileType
                    });
                  }
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
              customVideoManagment
              accept={{
                'image/png': FILE_TYPES.images,
                'video/mp4': FILE_TYPES.videos
              }}
              onChange={(url, binary) => {
                if (binary) {
                  setUploadedUrl(url);
                  setFileType('VIDEO');
                  setPortait(url);
                } else {
                  setUploadedUrl(url);
                  setFileType('IMAGE');
                  setPortait(url);
                }
              }}
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
