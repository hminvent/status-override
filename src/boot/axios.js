import { boot } from 'quasar/wrappers';
import axios from 'axios';
import Storage from 'src/services/storage';
import { useAuthStore } from 'src/modules/auth/store';
import { showLoading, hideLoader } from 'src/boot/plugins/loading';

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
});

export default boot(() => {
  api.interceptors.request.use((request) => {
    showLoading();
    const token = Storage.getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });

  api.interceptors.response.use(
    (response) => {
      hideLoader();
      if (response.data.errorMessage) {
        return Promise.reject(response);
      }
      return response;
    },
    (error) => {
      hideLoader();
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        // Set logout function here
        const authStore = useAuthStore();
        const { refreshToken } = authStore;
        refreshToken();
      }

      return Promise.reject(error);
    }
  );
});

export { api };
