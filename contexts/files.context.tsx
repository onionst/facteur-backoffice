import { notification } from 'antd';
import { createContext, useContext } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { UploadFile } from '@/services/files.service';

export type FilesContextProps = {
  uploadFile: (file: File) => Promise<string>;
};
export type FilesProviderProps = { children: any };
export const FilesContext = createContext<FilesContextProps>(
  // @ts-ignore
  {}
);

export const FilesProvider = (props: FilesProviderProps) => {
  const uploadFile = async (file: File): Promise<string> => {
    try {
      // const url = await UploadFile(file);
      const url = 'http://please-replace-upload-service-from-context.com';
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

  const context = { uploadFile };

  return <FilesContext.Provider value={context}>{props.children}</FilesContext.Provider>;
};

export const useFiles = () => useContext(FilesContext);
