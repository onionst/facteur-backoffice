import { api, parseUrl } from './api';

const PREFIX = '/files';

export const UploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(parseUrl(PREFIX, 'upload'), formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
