import { defineStore } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
import storage from 'src/services/storage';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '../services/api';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const { t } = useI18n();

  const email = ref(null);
  const password = ref(null);

  async function login(email, password) {
    try {
      const response = await api.login(email, password);
      storage.setToken(response.data.jwtToken);
      router.push('/app');
    } catch {
      notify('error', t('auth.errors.login'));
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
      await api.refreshToken({ refreshToken }).then((response) => {
        storage.setToken(response.data.jwtToken);
        storage.setRefreshToken(response.data.refreshToken);
        refreshTokenRunning = false;
      });
    } catch (err) {
      refreshTokenRunning = false;
      if (err) {
        timeOutLoader();
        storage.removeUser();
        router.push('/auth/login');
      }
    }
  }
  return { email, password, login, refreshToken };
});
