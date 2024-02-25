import { api } from 'src/boot/axios';

export default {
  login: (data) => api.post(`Account/ValidatewithAD`, data),
  ssoLogin: (data) => api.post(`Account/GenerateSSOLoginURL`, data),
  signIn: (params) => api.get('/Account/SignIn', { params }),
  logout: (refreshToken) => api.post('/Account/log-out', refreshToken),
  refreshToken: (refreshToken) =>
    api.post(`Account/refresh-token`, refreshToken),
  getProfile: () => api.get('/Account/Profile'),
  getToken: (data) => api.post(`Account/token`, data),
};
