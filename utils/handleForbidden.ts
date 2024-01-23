import { AxiosError } from 'axios';
import Store from 'store';
import { STORAGE_KEYS } from '@/constants/store.constant';

export const handleForbidden = async (err: AxiosError) => {
  if (err.response?.status === 403) {
    await Store.remove(STORAGE_KEYS.ACCESS_TOKEN);
    if (typeof window != 'undefined') {
      window.location.replace('/auth/sign-in?expired=true');
    }
  }
};
