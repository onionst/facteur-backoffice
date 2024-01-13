import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Paperclip } from 'react-feather';

import s from './Uploader.module.scss';
import { useFiles } from '@/contexts/files.context';

export type UploaderProps = {
  onChange: (url: string) => void;
  onLoad: () => void;
  accept: Accept;
  onLoadFinished: () => void;
};

export function Uploader(props: UploaderProps) {
  const { uploadFile } = useFiles();
  const [loading, setLoading] = useState<boolean>(false);
  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      props.onLoad();
      const url = await uploadFile(file);
      props.onChange(url);
      setLoading(false);
      props.onLoadFinished();
    } catch (err) {
      console.error(err);
    }
  };
  const onDrop = useCallback((acceptedFiles: any[]) => {
    if (acceptedFiles[0]) {
      console.log(acceptedFiles[0]);
      handleUpload(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, accept: props.accept });

  return (
    <div>
      {!loading ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <button type="button" className={s['ds-uploader']}>
            <Paperclip color="#252f4a" size={18} />
          </button>
        </div>
      ) : (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#00986d' }} />} />
      )}
    </div>
  );
}
