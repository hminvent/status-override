import api from '../services/api';
import { defineStore } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const profileId = ref(null);
  const fullName = ref(null);
  const title = ref(null);
  const profilePicture = ref(null);
  const currentStatus = ref(null);
  const toggleValue = ref(null);
  const AllStatus = ref(null);

  const getManagerProfileByEmail = async (email) => {
    try {
      const response = await api.getManagerProfileByEmail(email);
      const { employee, statusObject, employeeCurrentStatus } = response.data;
      profileId.value = employee?.id;
      fullName.value = employee?.fullName;
      title.value = employee?.title;
      profilePicture.value = employee?.attachment?.filePath;
      toggleValue.value = employee?.getProfileStatusFromExchange;
      currentStatus.value = employeeCurrentStatus?.id;
      AllStatus.value = statusObject.filter((status) => !status.dimmed);
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
      notify('success', 'status updated');
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
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    profileId,
    fullName,
    title,
    profilePicture,
    currentStatus,
    toggleValue,
    AllStatus,
    getManagerProfileByEmail,
    updateManagerProfileStatusByEmail,
    updateGetProfileStatusFromExchange,
  };
});
