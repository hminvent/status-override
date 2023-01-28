import api from '../services/api';
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useAppStore = defineStore('app', () => {
  const managerProfileId = ref(null);
  const managerFullName = ref(null);
  const managerTitle = ref(null);
  const managerProfilePicture = ref(null);
  const mangerActiveStatus = ref(null);
  const managerStatus = ref(null);

  const getManagerProfileByEmail = async (email) => {
    try {
      const response = await api.getManagerProfileByEmail(email);
      const { employee, statusObject } = response.data;
      managerProfileId.value = employee.id;
      managerFullName.value = employee.fullName;
      managerTitle.value = employee.title;
      managerProfilePicture.value = employee.attachment.filePath;
      mangerActiveStatus.value = employee.profileTypeId;
      managerStatus.value = statusObject.filter((status) => !status.dimmed);
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
      notify('success', 'statusUpdated');
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateGetProfileStatusFromExchange = async (profileId, toggleValue) => {
    try {
      const response = api.updateGetProfileStatusFromExchange(
        profileId,
        toggleValue
      );
      notify('success', 'statusUpdated');
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    managerProfileId,
    managerFullName,
    managerTitle,
    managerProfilePicture,
    mangerActiveStatus,
    managerStatus,
    getManagerProfileByEmail,
    updateManagerProfileStatusByEmail,
    updateGetProfileStatusFromExchange,
  };
});
