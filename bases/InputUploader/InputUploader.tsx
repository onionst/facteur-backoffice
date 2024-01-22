/* eslint-disable @next/next/no-img-element */
import { LoadingOutlined } from '@ant-design/icons';
import { Popover, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Paperclip, X } from 'react-feather';
import Image from '../Image/Image';
import s from './InputUploader.module.scss';
import { MAX_FILE_SIZE } from '@/constants/accept';
import { useFiles } from '@/contexts/files.context';

export type InputUploaderProps = {
  onUrlChange: (url: string) => void;
  accept: Accept;
  label?: string;
  value?: string;
};
export default function InputUploader(props: any) {
  const { uploadFile } = useFiles();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props?.value) {
      setUploadedUrl(props?.value);
    }
  }, [props]);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const url = await uploadFile(file);
      setUploadedUrl(url);
      props.onUrlChange(url);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  const onDrop = useCallback((acceptedFiles: any[]) => {
    if (acceptedFiles[0]) {
      handleUpload(acceptedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, maxSize: MAX_FILE_SIZE, accept: props.accept });
  return (
    <div
      {...(!uploadedUrl ? getRootProps() : {})}
      onMouseOver={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      className="w-full"
      style={{ position: 'relative' }}
    >
      <Popover
        open={uploadedUrl && showPreview ? true : false}
        placement="bottomLeft"
        content={
          <Image
            key={uploadedUrl}
            alt="preview popup"
            src={uploadedUrl}
            style={{ height: 130, maxHeight: 130, minHeight: 130, width: '100%', borderRadius: '0.475rem', objectFit: 'cover' }}
          />
        }
      >
        {!uploadedUrl && (
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10 }}>
            <input {...getInputProps()} />
          </div>
        )}
        {props.label && (
          <label className="form-label" style={{ marginBottom: 2 }}>
            {props.label} {props.required ? <span>*</span> : ''}
          </label>
        )}
        <div className="w-full" style={{ position: 'relative' }}>
          {uploadedUrl && (
            <span className={s['ds-input-uploader__preview']}>
              <Image key={uploadedUrl} alt="Preview" src={uploadedUrl} />
            </span>
          )}
          <input
            {...props}
            style={{ paddingRight: '3.5rem' }}
            disabled={loading}
            className={`form-control ${uploadedUrl ? s['ds-input-uploader'] : ''} ${
              props.type === 'password' ? 'form-control__input' : ''
            } ${props.className || ''}`}
          />

          <span
            style={{
              position: 'absolute',
              right: 14,
              top: 42,
              cursor: 'pointer',
              transform: 'translateY(-31px)'
            }}
          >
            {!loading ? (
              uploadedUrl ? (
                <X
                  style={{ cursor: 'pointer', zIndex: 11 }}
                  onClick={() => {
                    setUploadedUrl('');
                    props.onUrlChange('');
                  }}
                  color="#252f4a"
                  size={18}
                />
              ) : (
                <Paperclip color="#252f4a" size={18} />
              )
            ) : (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#00986d' }} />} />
            )}
          </span>
        </div>
      </Popover>
    </div>
  );
}
