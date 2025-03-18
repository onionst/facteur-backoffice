/* eslint-disable @next/next/no-img-element */
import { LoadingOutlined } from '@ant-design/icons';
import { Popover, Spin } from 'antd';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Maximize2, Paperclip, X } from 'react-feather';
import Image from '../Image/Image';
import s from './InputUploader.module.scss';
import { FILE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE } from '@/constants/accept';
import { useFiles } from '@/contexts/files.context';

export type InputUploaderProps = {
  onUrlChange: (url: string) => void;
  accept: Accept;
  label?: string;
  value?: string;
  disabled?: boolean;
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
      const file = acceptedFiles[0];
      const isImage = FILE_TYPES.images.some((ext) => file.name?.toLowerCase().endsWith(ext));
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

      if (file.size > maxSize) {
        console.error(`File size exceeds limit: ${isImage ? '1MB' : '100MB'}`);
        return;
      }

      handleUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, maxSize: MAX_FILE_SIZE, accept: props.accept });
  return (
    <div
      {...(!uploadedUrl && !props.disabled ? getRootProps() : {})}
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
            <Link href={uploadedUrl} target="_blank">
              <span className={s['ds-input-uploader__preview']}>
                <Image key={uploadedUrl} alt="Preview" src={uploadedUrl} />
              </span>
            </Link>
          )}
          <input
            {...props}
            style={{ paddingRight: props?.disabled ? '3rem' : uploadedUrl ? '5rem' : '3rem' }}
            disabled={loading || props.disabled}
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
              props?.disabled ? (
                <Maximize2
                  onClick={() => {
                    if (typeof window != 'undefined') {
                      window.open(uploadedUrl, '_blank');
                    }
                  }}
                  style={{ cursor: 'pointer', zIndex: 11 }}
                  color="#252f4a"
                  size={16}
                />
              ) : uploadedUrl ? (
                <div className={s['ds-input-uploader__buttons']}>
                  <Maximize2
                    onClick={() => {
                      if (typeof window != 'undefined') {
                        window.open(uploadedUrl, '_blank');
                      }
                    }}
                    style={{ cursor: 'pointer', zIndex: 11 }}
                    color="#252f4a"
                    size={16}
                  />
                  <X
                    style={{ cursor: 'pointer', zIndex: 11 }}
                    onClick={() => {
                      setUploadedUrl('');
                      props.onUrlChange('');
                    }}
                    color="#252f4a"
                    size={18}
                  />
                </div>
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
