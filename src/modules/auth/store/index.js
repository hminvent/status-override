import { defineStore } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
// import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import storage from 'src/services/storage';
import api from '../services/api';
import { timeOutLoader } from 'src/boot/plugins/loading';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  // const { t } = useI18n();

  async function login(email, password) {
    try {
      const response = await api.login(email, password);
      storage.setToken(response.data.jwtToken);
      storage.setRefreshToken(response.data.refreshToken);
      getProfile();
      // notify('success', t('auth.success.login'));
    } catch {
      // notify('error', t('auth.errors.login'));
    }
  }

  async function logout() {
    const refreshToken = storage.getRefreshToken();
    try {
      const response = await api.logout({ refreshToken });
      timeOutLoader();
      storage.removeUser();
      router.push('/auth/login');
    } catch {
      // notify('error', t('global.errors.get'));
    }
  }

  let refreshTokenRunning = false;
  async function refreshToken() {
    if (refreshTokenRunning) {
      return;
    }
    const refreshToken = storage.getRefreshToken();
    try {
      refreshTokenRunning = true;
      const response = await api.refreshToken({ refreshToken });
      storage.setToken(response.data.jwtToken);
      storage.setRefreshToken(response.data.refreshToken);
      refreshTokenRunning = false;
      window.location.reload();
    } catch (err) {
      refreshTokenRunning = false;
      if (err) {
        timeOutLoader();
        storage.removeUser();
        router.push('/auth/login');
      }
    }
  }

  async function getProfile() {
    try {
      // const response = await api.getProfile();
      // storage.setProfile(response.data);
      router.push('/app');
    } catch {
      // notify('error', t('auth.errors.login'));
    }
  }
  return { login, logout, refreshToken };
});
