import { LocalStorage } from 'quasar';
import {
  APP_TOKEN_KEY,
  APP_REFRESH_TOKEN_KEY,
  APP_PROFILE_KEY,
} from 'src/configs/storage';

export default {
  setToken(data) {
    const key = APP_TOKEN_KEY;
    if (data) {
      LocalStorage.set(key, data);
    }
  },

  getToken() {
    const key = APP_TOKEN_KEY;
    return LocalStorage.getItem(key);
  },

  removeToken() {
    const key = APP_TOKEN_KEY;
    LocalStorage.remove(key);
  },

  setRefreshToken(data) {
    const key = APP_REFRESH_TOKEN_KEY;
    if (data) {
      LocalStorage.set(key, data);
    }
  },

  getRefreshToken() {
    const key = APP_REFRESH_TOKEN_KEY;
    return LocalStorage.getItem(key);
  },

  removeRefreshToken() {
    const key = APP_REFRESH_TOKEN_KEY;
    LocalStorage.remove(key);
  },

  setProfile(data) {
    const key = APP_PROFILE_KEY;
    if (data) {
      LocalStorage.set(key, data);
    }
  },

  getProfile() {
    const key = APP_PROFILE_KEY;
    return LocalStorage.getItem(key) || {};
  },

  removeProfile() {
    const key = APP_PROFILE_KEY;
    LocalStorage.remove(key);
  },

  removeUser() {
    this.removeProfile();
    this.removeToken();
    this.removeRefreshToken();
  },
};
