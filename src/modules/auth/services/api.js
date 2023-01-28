import { api } from 'src/boot/axios';

export default {
  login: (email, password) =>
    api.get(`Account/ValidatewithAD?email=${email}&password=${password}`),
  logout: (refreshToken) => api.post('/Account/log-out', refreshToken),
  refreshToken: (refreshToken) =>
    api.post(`Account/refresh-token`, refreshToken),
  getProfile: () => api.get('/Account/Profile'),
};
