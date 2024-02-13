import { notification } from 'antd';
import { createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { UploadFile, UploadVideo } from '@/services/files.service';

export type FilesContextProps = {
  uploadFile: (file: File) => Promise<string>;
  uploadVideo: (file: File) => Promise<any>;
  videoUrl: string;
  fingerPrints: any[];
};
export type FilesProviderProps = { children: any };
export const FilesContext = createContext<FilesContextProps>(
  // @ts-ignore
  {}
);

export const FilesProvider = (props: FilesProviderProps) => {
  const [fingerPrints, setFingerPrints] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<any>('');
  const uploadFile = async (file: File): Promise<string> => {
    try {
      const url = await UploadFile(file);
      return url;
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'File could not be uploaded. Please try again later'
        });
      }
      return '';
    }
  };

  const uploadVideo = async (file: File): Promise<any[]> => {
    try {
      const fingerPrints = await UploadVideo(file);
      setVideoUrl(URL.createObjectURL(file));
      setFingerPrints(fingerPrints);
      return fingerPrints;
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'File could not be uploaded. Please try again later'
        });
      }
      return [];
    }
  };

  const context = { uploadFile, uploadVideo, videoUrl, fingerPrints };

  return <FilesContext.Provider value={context}>{props.children}</FilesContext.Provider>;
};

export const useFiles = () => useContext(FilesContext);
