import { api } from 'src/boot/axios';

export default {
  login: (data) => api.post(`Account/ValidatewithAD`, data),
  logout: (refreshToken) => api.post('/Account/log-out', refreshToken),
  refreshToken: (refreshToken) =>
    api.post(`Account/refresh-token`, refreshToken),
  getProfile: () => api.get('/Account/Profile'),
};
