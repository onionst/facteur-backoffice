import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Paperclip } from 'react-feather';
import s from './Uploader.module.scss';
import { FILE_TYPES, MAX_FILE_SIZE } from '@/constants/accept';
import { useFiles } from '@/contexts/files.context';

export type UploaderProps = {
  onChange: (url: string, data: any) => void;
  onLoad: () => void;
  accept: Accept;
  customVideoManagment?: boolean;
  onLoadFinished: () => void;
};

export function Uploader(props: UploaderProps) {
  const { uploadFile, uploadVideo } = useFiles();
  const [loading, setLoading] = useState<boolean>(false);
  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      props.onLoad();
      const url = await uploadFile(file);
      props.onChange(url, null);
      setLoading(false);
      props.onLoadFinished();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadVideo = async (file: File) => {
    try {
      setLoading(true);
      props.onLoad();
      const binary = await uploadVideo(file);
      props.onChange(URL.createObjectURL(file), binary);
      setLoading(false);
      props.onLoadFinished();
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = useCallback((acceptedFiles: any[]) => {
    if (acceptedFiles?.[0]) {
      if (props.customVideoManagment && FILE_TYPES.videos.some((extension: string) => acceptedFiles?.[0]?.path?.includes(extension))) {
        handleUploadVideo(acceptedFiles[0]);
      } else {
        handleUpload(acceptedFiles[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, accept: props.accept, maxSize: MAX_FILE_SIZE });

  return (
    <div>
      {!loading ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Tooltip title="Upload file">
            <button type="button" className={s['ds-uploader']}>
              <Paperclip color="#252f4a" size={18} />
            </button>
          </Tooltip>
        </div>
      ) : (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#00986d' }} />} />
      )}
    </div>
  );
}
