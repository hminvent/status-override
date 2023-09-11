import api from '../services/api';
import { defineStore } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
import { useI18n } from 'vue-i18n';

export const useAppStore = defineStore('app', () => {
  const { t } = useI18n();

  const getManagerProfileByEmail = async (email) => {
    try {
      const response = await api.getManagerProfileByEmail(email);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateManagerProfileStatusByEmail = async (profileId, status) => {
    try {
      const response = await api.updateManagerProfileStatusByEmail(
        profileId,
        status
      );
      notify('success', t('app.status.success'));
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateGetProfileStatusFromExchange = async (profileId, toggleValue) => {
    try {
      const response = api.updateGetProfileStatusFromExchange(
        profileId,
        !toggleValue
      );

      notify(
        'success',
        toggleValue ? t('app.status.change') : t('app.status.noChange')
      );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    getManagerProfileByEmail,
    updateManagerProfileStatusByEmail,
    updateGetProfileStatusFromExchange,
  };
});
