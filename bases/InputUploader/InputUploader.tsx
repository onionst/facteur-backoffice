import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Paperclip, X } from 'react-feather';
import { MAX_FILE_SIZE } from '@/constants/accept';
import { useFiles } from '@/contexts/files.context';

export type InputUploaderProps = {
  onUrlChange: (url: string) => void;
  accept: Accept;
  label?: string;
};
export default function InputUploader(props: any) {
  const { uploadFile } = useFiles();
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const url = await uploadFile(file);
      props.onUrlChange(url);
      setUploadedUrl(url);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  const onDrop = useCallback((acceptedFiles: any[]) => {
    if (acceptedFiles[0]) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, maxSize: MAX_FILE_SIZE, accept: props.accept });

  return (
    <div {...(!uploadedUrl ? getRootProps() : {})} className="w-full" style={{ position: 'relative' }}>
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
        <input
          {...props}
          style={{ paddingRight: '3.5rem' }}
          disabled={loading}
          className={`form-control ${props.type === 'password' ? 'form-control__input' : ''} ${props.className || ''}`}
        />

        <span
          style={{
            position: 'absolute',
            right: 16,
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
    </div>
  );
}
