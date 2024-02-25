import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import storage from 'src/services/storage';
import api from '../services/api';
import { timeOutLoader } from 'src/boot/plugins/loading';
import { DEFAULT_ROUTE } from 'src/configs/router';
import { notify } from 'src/boot/plugins/notify';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const { t } = useI18n();

  const signIn = async (params) => {
    try {
      const response = await api.signIn(params);
      storage.setToken(response.data.jwtToken);
      storage.setRefreshToken(response.data.refreshToken);
      return Promise.resolve(response);
    } catch (error) {
      notify('error', t('auth.errors.login'));
      return Promise.reject(error);
    }
  };

  async function login(data) {
    try {
      const response = await api.login(data);
      storage.setToken(response.data.jwtToken);
      storage.setRefreshToken(response.data.refreshToken);
      getProfile();
    } catch (error) {
      notify('error', t('auth.errors.login'));
      return Promise.reject(error);
    }
  }

  async function getToken(data) {
    try {
      const response = await api.getToken(data);
      storage.setToken(response.data.jwtToken);
      storage.setRefreshToken(response.data.refreshToken);
      getProfile();
    } catch (error) {
      notify('error', t('auth.errors.login'));
      return Promise.reject(error);
    }
  }

  async function ssoLogin(data) {
    try {
      const response = await api.ssoLogin(data);
      window.location.href = response.data;
      return Promise.resolve(response);
    } catch (error) {
      notify('error', t('auth.errors.login'));
      return Promise.reject(error);
    }
  }

  async function logout() {
    const refreshToken = storage.getRefreshToken();
    try {
      const response = await api.logout({ refreshToken });
      timeOutLoader();
      storage.removeUser();
      router.push('/auth/login');
    } catch (error) {
      return Promise.reject(error);
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
      const response = await api.getProfile();
      storage.setProfile(response.data);
      router.push(DEFAULT_ROUTE);
      return Promise.resolve(response);
    } catch (error) {
      notify('error', t('auth.errors.login'));
      return Promise.reject(error);
    }
  }
  return {
    login,
    ssoLogin,
    signIn,
    logout,
    refreshToken,
    getProfile,
    getToken,
  };
});
