import api from '../services/api';
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

export const useAppStore = defineStore('app', () => {
  const managerProfile = reactive({
    fullName: '',
    title: '',
    attachment: { filePath: '' },
  });
  const managerStatus = ref(null);

  const getManagerProfileByEmail = async (email) => {
    try {
      const response = await api.getManagerProfileByEmail(email);
      const { employee, statusObject } = response.data;
      managerProfile.fullName = employee.fullName;
      managerProfile.title = employee.title;
      managerProfile.attachment.filePath = employee.attachment.filePath;
      managerStatus.value = statusObject;
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { managerProfile, managerStatus, getManagerProfileByEmail };
});
