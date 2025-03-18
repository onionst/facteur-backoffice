import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip, notification } from 'antd';
import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Paperclip } from 'react-feather';
import s from './Uploader.module.scss';
import { FILE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE } from '@/constants/accept';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
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
  const [api, contextHolder] = notification.useNotification();
  const handleUpload = async (file: File, key: string) => {
    try {
      setLoading(true);
      props.onLoad();
      const url = await uploadFile(file);
      props.onChange(url, null);
      api.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'File uploaded successfully',
        type: 'success',
        key,
        duration: 100000
      });
      setTimeout(() => {
        api.destroy(key);
      }, 1000);
      setLoading(false);
      props.onLoadFinished();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadVideo = async (file: File, key: string) => {
    try {
      setLoading(true);
      props.onLoad();
      const binary = await uploadVideo(file);
      props.onChange(URL.createObjectURL(file), binary);
      api.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'File uploaded successfully',
        type: 'success',
        key,
        duration: 100000
      });
      setTimeout(() => {
        api.destroy(key);
      }, 1000);
      setLoading(false);
      props.onLoadFinished();
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = useCallback((acceptedFiles: any[]) => {
    const key = Date.now().toString();
    api.open({
      ...NOTIFICATIONS_CONFIG.success,
      message: 'Uploading file...',
      type: 'success',
      icon: <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#00986d' }} />}></Spin>,
      key,
      duration: 100000
    });

    if (acceptedFiles?.[0]) {
      const file = acceptedFiles[0];
      const isImage = FILE_TYPES.images.some((extension: string) => file.path?.toLowerCase()?.endsWith(extension));
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
      if (file.size > maxSize) {
        api.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: `File size exceeds limit: ${isImage ? '1MB' : '100MB'}`,
          key,
          duration: 5000
        });
        return;
      }
      if (
        props.customVideoManagment &&
        FILE_TYPES.videos.some((extension: string) => acceptedFiles?.[0]?.path?.toLowerCase()?.includes(extension))
      ) {
        handleUploadVideo(acceptedFiles[0], key);
      } else {
        handleUpload(acceptedFiles[0], key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, accept: props.accept, maxSize: MAX_FILE_SIZE });

  return (
    <div>
      {contextHolder}
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
