import Store from 'store';
import { STORAGE_KEYS } from '@/constants/store.constant';
export function safeReturn(cb: () => void) {
  if (Store.get(STORAGE_KEYS.ACCESS_TOKEN, null)) {
    cb();
  }
}
